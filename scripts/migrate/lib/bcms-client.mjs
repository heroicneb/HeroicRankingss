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
const DEFAULT_INSTANCE = "6710e3bdeeda0c4a2de4b330";
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
  const origin = options.origin ?? process.env.BCMS_API_ORIGIN ?? DEFAULT_ORIGIN;
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
     * Tries `/bin2/<filename>` first (matches parity data), then `/bin/<filename>`.
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
      const candidates = [
        `/api/v3/instance/${instanceId}/media/${id}/bin2/${encoded}`,
        `/api/v3/instance/${instanceId}/media/${id}/bin/${encoded}`,
      ];
      let lastErr;
      for (const path of candidates) {
        try {
          return await bcmsFetchBinary(path);
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
