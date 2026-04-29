/**
 * BCMS REST client — auth, fetch, retry/backoff, bounded concurrency.
 *
 * Endpoints used:
 *   - /api/v3/instance/<id>/template/all
 *   - /api/v3/instance/<id>/template/<tid>/entry/all/parsed
 *   - /api/v3/instance/<id>/template/<tid>/entry/<slug>/parse
 *   - /api/v3/instance/<id>/media/all
 *   - /api/v3/instance/<id>/media/<mediaId>
 *   - /api/v3/instance/<id>/media/<mediaId>/bin/<filename>
 *   - /api/v3/instance/<id>/media/<mediaId>/bin2/<filename>  (also seen in parity data)
 *
 * BCMS_API_KEY env var is the 3-part `id.secret.instanceId` form. If only
 * 2 parts are provided we append the configured instance id (matches the
 * pattern used by scripts/bcms-spike.mjs).
 */

const DEFAULT_ORIGIN = "https://app.thebcms.com";
const DEFAULT_CDN_ORIGIN = "https://cdn.thebcms.com";
const DEFAULT_INSTANCE = "6710e3bdeeda0c4a2de4b330";
const DEFAULT_ORG = "620528baca65b6578d29868d";
// Media-scoped public API key embedded in rendered heroicrankings.com image URLs.
// Read scope only, scoped to media binaries. Used because the content API key
// (`BCMS_API_KEY`) does NOT have binary download permission — confirmed via
// 403 on /api/v3/instance/.../media/.../bin2/<filename> with content key.
const DEFAULT_MEDIA_PUBLIC_KEY =
  "6720fb7d4af2f1ddaa6bbdf6.c00cf44655f4c098ecc0082a201e6c7eaef24cda05e94d2845e3c7a12ae6773b";
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

export class BcmsAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "BcmsAuthError";
  }
}

export class BcmsHttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "BcmsHttpError";
    this.status = status;
  }
}

/**
 * Build a bounded-concurrency pool. Pattern matches bcms-full-inventory.mjs.
 */
export function createPool(concurrency) {
  let active = 0;
  const queue = [];
  function run() {
    while (queue.length > 0 && active < concurrency) {
      const { fn, resolve, reject } = queue.shift();
      active++;
      fn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          active--;
          run();
        });
    }
  }
  return {
    submit(fn) {
      return new Promise((resolve, reject) => {
        queue.push({ fn, resolve, reject });
        run();
      });
    },
  };
}

export function createBcmsClient(options = {}) {
  const apiKey = options.apiKey ?? process.env.BCMS_API_KEY;
  const instanceId = options.instanceId ?? process.env.BCMS_INSTANCE_ID ?? DEFAULT_INSTANCE;
  const orgId = options.orgId ?? process.env.BCMS_ORG_ID ?? DEFAULT_ORG;
  const origin = options.origin ?? process.env.BCMS_API_ORIGIN ?? DEFAULT_ORIGIN;
  const cdnOrigin = options.cdnOrigin ?? process.env.BCMS_CDN_ORIGIN ?? DEFAULT_CDN_ORIGIN;
  const mediaPublicKey =
    options.mediaPublicKey ??
    process.env.BCMS_MEDIA_PUBLIC_KEY ??
    DEFAULT_MEDIA_PUBLIC_KEY;
  const concurrency = options.concurrency ?? 5;

  if (!apiKey) {
    throw new BcmsAuthError(
      "Missing BCMS_API_KEY env var. Set BCMS_API_KEY=<id.secret.instanceId> and rerun.",
    );
  }

  const fullKey = apiKey.split(".").length === 3 ? apiKey : `${apiKey}.${instanceId}`;
  const baseHeaders = { Authorization: `ApiKey ${fullKey}` };
  const pool = createPool(concurrency);

  async function rawFetch(path, init = {}) {
    const url = path.startsWith("http") ? path : `${origin}${path}`;
    const headers = { ...baseHeaders, ...(init.headers ?? {}) };
    const res = await fetch(url, { ...init, headers });
    return res;
  }

  async function withRetry(fn, label) {
    let lastErr;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastErr = err;
        const status = err?.status ?? 0;
        const isRetryable = status === 429 || status >= 500 || !status;
        if (!isRetryable || attempt === MAX_RETRIES) throw err;
        const wait = RETRY_BASE_MS * Math.pow(2, attempt - 1);
        process.stdout.write(
          `[warn] [bcms] [retry ${attempt}/${MAX_RETRIES}] ${label} status=${status} wait=${wait}ms\n`,
        );
        await new Promise((r) => setTimeout(r, wait));
      }
    }
    throw lastErr;
  }

  /**
   * Fetch JSON from a BCMS path; retries on 429/5xx with exponential backoff.
   */
  async function bcmsFetch(path, init) {
    return pool.submit(() =>
      withRetry(async () => {
        const res = await rawFetch(path, init);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new BcmsHttpError(
            `${res.status} ${res.statusText} ${path} :: ${text.slice(0, 200)}`,
            res.status,
          );
        }
        return res.json();
      }, `GET ${path}`),
    );
  }

  /**
   * Fetch raw bytes (for media binary download). Returns a Buffer.
   */
  async function bcmsFetchBinary(path) {
    return pool.submit(() =>
      withRetry(async () => {
        const res = await rawFetch(path);
        if (!res.ok) {
          throw new BcmsHttpError(
            `${res.status} ${res.statusText} ${path}`,
            res.status,
          );
        }
        const arr = await res.arrayBuffer();
        return Buffer.from(arr);
      }, `GET-bin ${path}`),
    );
  }

  return {
    instanceId,
    origin,
    bcmsFetch,
    bcmsFetchBinary,

    /** GET /template/all */
    async listTemplates() {
      const data = await bcmsFetch(`/api/v3/instance/${instanceId}/template/all`);
      return data.items ?? data ?? [];
    },

    /** GET /template/<id>/entry/all/parsed */
    async listEntries(templateId) {
      const data = await bcmsFetch(
        `/api/v3/instance/${instanceId}/template/${templateId}/entry/all/parsed`,
      );
      return data.items ?? data ?? [];
    },

    /** GET /template/<id>/entry/<slug>/parse */
    async getEntryBySlug(templateId, slug) {
      const data = await bcmsFetch(
        `/api/v3/instance/${instanceId}/template/${templateId}/entry/${slug}/parse`,
      );
      return data.item ?? data;
    },

    /** GET /media/all */
    async listMedia() {
      const data = await bcmsFetch(`/api/v3/instance/${instanceId}/media/all`);
      return Array.isArray(data) ? data : (data.items ?? []);
    },

    /** GET /media/<mediaId> */
    async getMedia(mediaId) {
      const data = await bcmsFetch(`/api/v3/instance/${instanceId}/media/${mediaId}`);
      return data.item ?? data;
    },

    /**
     * Download the original binary for a BCMS media item.
     *
     * Uses the CDN origin (cdn.thebcms.com) with a media-public-key query
     * param (the same path used by the public site's <img> tags). The
     * content API key does NOT have binary download permission against the
     * /app/api endpoint — confirmed 403 in initial migration run.
     */
    async downloadMediaBinary(media) {
      if (!media || typeof media !== "object") {
        throw new Error("downloadMediaBinary requires the BCMS media object.");
      }
      const id = media._id;
      const filename = media.name;
      if (!id || !filename) {
        throw new Error(`Cannot download media without _id and name (got id=${id}, name=${filename}).`);
      }
      const encoded = encodeURIComponent(filename);
      const cdnPaths = [
        `${cdnOrigin}/api/v3/org/${orgId}/instance/${instanceId}/media/${id}/bin2/${encoded}?apiKey=${mediaPublicKey}`,
        `${cdnOrigin}/api/v3/org/${orgId}/instance/${instanceId}/media/${id}/bin/${encoded}?apiKey=${mediaPublicKey}`,
      ];
      let lastErr;
      for (const url of cdnPaths) {
        try {
          return await pool.submit(() =>
            withRetry(async () => {
              const res = await fetch(url);
              if (!res.ok) {
                throw new BcmsHttpError(`${res.status} ${res.statusText} ${url}`, res.status);
              }
              const arr = await res.arrayBuffer();
              return Buffer.from(arr);
            }, `GET-bin ${url}`),
          );
        } catch (err) {
          lastErr = err;
          if (err?.status === 404) continue;
          throw err;
        }
      }
      throw lastErr ?? new Error(`No binary endpoint resolved for media ${id}`);
    },
  };
}
