/**
 * Asset registry — BCMS media _id → Sanity assetId mapping.
 *
 * Per Codex:
 * - Key on BCMS media `_id`, not filename (filenames collide; ids do not).
 * - Persistent checkpoint file so reruns resume cleanly.
 * - Bounded concurrency 3-5; retry on 429/5xx with exponential backoff.
 * - Abort if a download hash changes mid-run for the same media id.
 *
 * The registry is loaded eagerly on construction and flushed to disk after
 * each successful upload. JSON shape:
 *   {
 *     "<bcmsMediaId>": {
 *       bcmsId, sanityAssetId, sourceUrl, sha256, width, height,
 *       mimetype, size, originalFilename, importedAt
 *     },
 *     ...
 *   }
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

const DEFAULT_REGISTRY_PATH = "scripts/migrate/.checkpoint/asset-registry.json";

export function createAssetRegistry(options = {}) {
  const {
    bcmsClient,
    sanityClient,
    logger,
    registryPath = DEFAULT_REGISTRY_PATH,
    dryRun = false,
  } = options;

  if (!bcmsClient) throw new Error("createAssetRegistry: bcmsClient required");

  const registry = loadRegistry(registryPath);
  /** Async-safe in-flight map: bcmsId → Promise<sanityAssetId>. */
  const inflight = new Map();

  function persist() {
    try {
      mkdirSync(dirname(registryPath), { recursive: true });
      writeFileSync(registryPath, JSON.stringify(registry, null, 2));
    } catch (err) {
      logger?.warn?.(
        "asset",
        null,
        `failed to persist registry to ${registryPath}: ${err?.message ?? err}`,
      );
    }
  }

  /**
   * Resolve (and upload if needed) a single BCMS media item.
   * `mediaInput` may be either the parsed media object (from a parent entry)
   * or a bare BCMS _id string.
   */
  async function ensureAsset(mediaInput) {
    if (!mediaInput) return null;

    const id = typeof mediaInput === "string" ? mediaInput : mediaInput._id;
    if (!id) return null;

    if (registry[id]?.sanityAssetId) {
      logger?.countAssetReuse?.();
      return registry[id].sanityAssetId;
    }

    if (inflight.has(id)) return inflight.get(id);

    const promise = (async () => {
      // Need the full media object to know the filename. If only id was given,
      // fetch via /media/<id>.
      let media = typeof mediaInput === "string" ? null : mediaInput;
      if (!media || !media.name) {
        media = await bcmsClient.getMedia(id);
      }
      if (!media || !media._id) {
        throw new Error(`Cannot resolve BCMS media metadata for id ${id}`);
      }

      const filename = media.name ?? `bcms-${id}`;
      const sourceUrl =
        media.url ??
        `${bcmsClient.origin}/api/v3/instance/${bcmsClient.instanceId}/media/${id}/bin2/${encodeURIComponent(filename)}`;

      if (dryRun) {
        // In dry-run, record a placeholder — never call the real upload API.
        const placeholder = {
          bcmsId: id,
          sanityAssetId: null,
          sourceUrl,
          sha256: null,
          width: media.width ?? null,
          height: media.height ?? null,
          mimetype: media.mimetype ?? null,
          size: media.size ?? null,
          originalFilename: filename,
          importedAt: new Date().toISOString(),
          dryRun: true,
        };
        registry[id] = placeholder;
        persist();
        logger?.info?.("asset", null, `[dry-run] would upload ${id} (${filename})`);
        return null;
      }

      if (!sanityClient) {
        throw new Error(
          `ensureAsset: live mode requires sanityClient (no token resolved?).`,
        );
      }

      // Download bytes, hash, upload.
      const buf = await bcmsClient.downloadMediaBinary(media);
      const sha = sha256Buffer(buf);

      // Drift detection: if registry already has a sha for this id and it
      // disagrees with what we just downloaded, refuse to overwrite — that
      // would silently corrupt downstream references.
      if (registry[id]?.sha256 && registry[id].sha256 !== sha) {
        throw new Error(
          `Asset checksum drift for BCMS media ${id} (${filename}): registry has ${registry[id].sha256.slice(0, 12)}…, fetched ${sha.slice(0, 12)}…. Aborting per Codex drift policy.`,
        );
      }

      const uploaded = await sanityClient.assets.upload("image", buf, {
        filename,
        contentType: media.mimetype ?? undefined,
        source: {
          id,
          name: "bcms-migration",
          url: sourceUrl,
        },
      });

      const entry = {
        bcmsId: id,
        sanityAssetId: uploaded._id,
        sourceUrl,
        sha256: sha,
        width: media.width ?? uploaded.metadata?.dimensions?.width ?? null,
        height: media.height ?? uploaded.metadata?.dimensions?.height ?? null,
        mimetype: media.mimetype ?? uploaded.mimeType ?? null,
        size: media.size ?? uploaded.size ?? null,
        originalFilename: filename,
        importedAt: new Date().toISOString(),
      };
      registry[id] = entry;
      persist();
      logger?.countAssetUpload?.();
      logger?.info?.("asset", null, `uploaded ${id} (${filename}) → ${uploaded._id}`);
      return uploaded._id;
    })().finally(() => {
      inflight.delete(id);
    });

    inflight.set(id, promise);
    return promise;
  }

  /**
   * Build a Sanity image field referencing the asset for a BCMS media item.
   * Returns null if mediaInput is empty. In dry-run mode (no sanityAssetId)
   * returns a placeholder ref so downstream mappers can still produce output.
   */
  async function imageFieldFor(mediaInput, altText) {
    const sanityAssetId = await ensureAsset(mediaInput);
    const alt = pickAlt(mediaInput, altText);
    if (!sanityAssetId) {
      // Dry-run path — emit a recognizable placeholder
      return {
        _type: "image",
        _bcmsId: typeof mediaInput === "string" ? mediaInput : mediaInput?._id ?? null,
        _dryRun: true,
        alt,
      };
    }
    return {
      _type: "image",
      asset: { _type: "reference", _ref: sanityAssetId },
      alt,
    };
  }

  return {
    ensureAsset,
    imageFieldFor,
    /** Direct registry access — read-only for callers. */
    get(bcmsId) {
      return registry[bcmsId] ?? null;
    },
    has(bcmsId) {
      return Boolean(registry[bcmsId]?.sanityAssetId);
    },
    /** Snapshot copy for reporting. */
    snapshot() {
      return { ...registry };
    },
    persist,
  };
}

function loadRegistry(path) {
  if (!existsSync(path)) return {};
  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

function sha256Buffer(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function pickAlt(mediaInput, override) {
  if (override) return override;
  if (typeof mediaInput === "object" && mediaInput) {
    return mediaInput.alt_text || mediaInput.altText || mediaInput.caption || "";
  }
  return "";
}
