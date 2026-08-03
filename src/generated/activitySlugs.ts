/**
 * SNAPSHOT of the base activity slugs the live catalog exposes at
 * `GET /v1/activities` (public, no auth) — committed so the SDK builds and
 * type-checks fully offline, with no network dependency at install/build
 * time.
 *
 * REFRESHED from the live endpoint by `scripts/genSlugs.ts`, run as part of
 * the `.github/workflows/refresh-openapi.yml` job (the same job that already
 * has live-API reachability for the OpenAPI contract sync).
 *
 * This is intentionally an OPEN set — see `ActivitySlug` below: the catalog
 * (discoverable at runtime via `client.activities()`) is the source of
 * truth, and a newly-added catalog activity must never become a compile
 * error just because this snapshot hasn't been refreshed yet.
 *
 * Do not hand-edit. To refresh, run `pnpm gen:slugs`.
 */

export const KNOWN_ACTIVITY_SLUGS = [
  "alpine-skiing", "boat-excursion", "bodyboarding", "bouldering", "canyoning",
  "climbing", "freeride", "hang-gliding", "hot-air-ballooning", "jet-ski",
  "kayak", "kitesurfing", "mountain-biking", "open-water-swimming", "paragliding",
  "road-cycling", "sailing", "scuba", "ski-touring", "snorkeling",
  "snowboarding", "sup", "surfing", "trail-running", "trekking",
  "wakeboarding", "windsurfing", "wing-foiling",
] as const

/** A base activity slug. The KNOWN_ACTIVITY_SLUGS give IDE autocomplete +
 *  typo-catching for the activities in the shipped catalog snapshot, but the
 *  type stays OPEN (`| (string & {})`) so a newly-added catalog activity is
 *  never a compile error — the catalog is the runtime source of truth
 *  (discover the current list at runtime with `client.activities()`). */
export type KnownActivitySlug = (typeof KNOWN_ACTIVITY_SLUGS)[number]
export type ActivitySlug = KnownActivitySlug | (string & {})
