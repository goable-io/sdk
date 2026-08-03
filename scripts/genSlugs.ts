/**
 * Refresh the committed activity-slug snapshot from the live catalog.
 *
 *   pnpm gen:slugs
 *
 * Fetches `GET {GOABLE_API_BASE}/v1/activities` (public, no auth) and
 * rewrites src/generated/activitySlugs.ts with the current sorted, deduped
 * slug list. NOT part of `pnpm gen` or the build — this talks to the live
 * network, unlike the offline `pnpm gen` (openapi.json → api.ts). Run from
 * `.github/workflows/refresh-openapi.yml`, which already has live-API
 * reachability for the OpenAPI contract sync.
 *
 * Never overwrites the committed file on failure or an empty result — the
 * seed stays offline-authoritative even if the live endpoint is briefly
 * unreachable or misbehaves.
 */

import { writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(here, "..")

const BASE_URL = process.env.GOABLE_API_BASE ?? "https://api.goable.io"

interface ActivitiesResponseBody {
  activities: Array<{ slug: string }>
}

function renderFile(slugs: string[]): string {
  const header =
    "/**\n" +
    " * SNAPSHOT of the base activity slugs the live catalog exposes at\n" +
    " * `GET /v1/activities` (public, no auth) — committed so the SDK builds and\n" +
    " * type-checks fully offline, with no network dependency at install/build\n" +
    " * time.\n" +
    " *\n" +
    " * REFRESHED from the live endpoint by `scripts/genSlugs.ts`, run as part of\n" +
    " * the `.github/workflows/refresh-openapi.yml` job (the same job that already\n" +
    " * has live-API reachability for the OpenAPI contract sync).\n" +
    " *\n" +
    " * This is intentionally an OPEN set — see `ActivitySlug` below: the catalog\n" +
    " * (discoverable at runtime via `client.activities()`) is the source of\n" +
    " * truth, and a newly-added catalog activity must never become a compile\n" +
    " * error just because this snapshot hasn't been refreshed yet.\n" +
    " *\n" +
    " * Do not hand-edit. To refresh, run `pnpm gen:slugs`.\n" +
    " */\n\n"

  const arrayLines: string[] = []
  for (let i = 0; i < slugs.length; i += 5) {
    const chunk = slugs.slice(i, i + 5).map((s) => JSON.stringify(s))
    arrayLines.push(`  ${chunk.join(", ")},`)
  }

  const body =
    `export const KNOWN_ACTIVITY_SLUGS = [\n${arrayLines.join("\n")}\n] as const\n\n` +
    "/** A base activity slug. The KNOWN_ACTIVITY_SLUGS give IDE autocomplete +\n" +
    " *  typo-catching for the activities in the shipped catalog snapshot, but the\n" +
    " *  type stays OPEN (`| (string & {})`) so a newly-added catalog activity is\n" +
    " *  never a compile error — the catalog is the runtime source of truth\n" +
    " *  (discover the current list at runtime with `client.activities()`). */\n" +
    "export type KnownActivitySlug = (typeof KNOWN_ACTIVITY_SLUGS)[number]\n" +
    "export type ActivitySlug = KnownActivitySlug | (string & {})\n"

  return header + body
}

async function main(): Promise<void> {
  const url = `${BASE_URL.replace(/\/+$/, "")}/v1/activities`

  let body: ActivitiesResponseBody
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`)
    }
    body = (await res.json()) as ActivitiesResponseBody
  } catch (err) {
    console.error(`[sdk gen:slugs] failed to fetch ${url}:`, err)
    console.error("[sdk gen:slugs] leaving the committed src/generated/activitySlugs.ts untouched.")
    process.exit(1)
    return
  }

  const slugs = Array.from(new Set((body.activities ?? []).map((a) => a.slug))).sort((a, b) =>
    a.localeCompare(b),
  )

  if (slugs.length === 0) {
    console.error(`[sdk gen:slugs] ${url} returned zero activities — refusing to overwrite the seed.`)
    process.exit(1)
    return
  }

  writeFileSync(resolve(pkgRoot, "src/generated/activitySlugs.ts"), renderFile(slugs))
  console.log(`[sdk gen:slugs] wrote src/generated/activitySlugs.ts with ${slugs.length} slugs from ${url}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
