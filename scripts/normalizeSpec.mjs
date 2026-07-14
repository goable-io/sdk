#!/usr/bin/env node
/**
 * Canonical formatter for the committed openapi.json.
 *
 * The `refresh-openapi` workflow fetches the LIVE `/docs/openapi.json`, which
 * reports the deployment's real `info.version` (e.g. "1.0.0") and is not
 * serialised like our committed snapshot. Running BOTH the committed file and
 * the freshly-fetched one through this identical normaliser means the daily
 * drift check only opens a PR on a REAL contract change — not on the version
 * string or on JSON array formatting.
 *
 *   node scripts/normalizeSpec.mjs openapi.json   # rewrite in place
 *
 * Canonical form:
 *   - `info.version` pinned to "0.0.0" — matching the upstream generator, which
 *     pins ENGINE_VERSION for its committed artifact; the live route still
 *     reports the deployment's real version at runtime.
 *   - serialised with `JSON.stringify(spec, null, 2)` + a trailing newline.
 * Key insertion order is preserved (never re-sorted) so diffs stay readable
 * when a route is added or changed.
 */
import { readFileSync, writeFileSync } from "node:fs"

const path = process.argv[2]
if (!path) {
  console.error("usage: node scripts/normalizeSpec.mjs <openapi.json>")
  process.exit(1)
}

const spec = JSON.parse(readFileSync(path, "utf8"))
if (spec.info && typeof spec.info === "object") spec.info.version = "0.0.0"
writeFileSync(path, `${JSON.stringify(spec, null, 2)}\n`)
console.log(`[normalizeSpec] normalized ${path}`)
