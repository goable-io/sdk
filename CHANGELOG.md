# Changelog

All notable changes to `@goable-io/sdk` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.10.0] — 2026-08-11

### Added

- `ScoreResponse.session_id` is now a typed, required field — the scored-session
  id, returned on every `/v1/score` response. Pass it back as `audit_log_id` on
  `POST /v1/outcomes` (or as the `:id` on `POST /v1/score/:id/outcome`) to link
  an observed outcome to the exact forecast that produced it.

### Changed

- Synced `openapi.json` to the current contract. Non-breaking: `alerts[].code`
  is now documented as the stable, machine-readable identifier to key UI and
  localization off (the `description` is English debug prose, not localized),
  and `breakdown[].value` / `.suitability` carry native-unit documentation
  (wind in knots, wave in metres, etc.).

## [0.9.0] — 2026-08-04

**Breaking:** `/v1/score/series` bucket shape changed to match the current
API contract.

### Changed

- **score-series bucket:** `at` → `timestamp`, add `confidence` + `alerts`
  (breaking). Each `ScoreSeriesResponse["series"]` entry is now
  `{ timestamp, score, verdict, confidence, alerts }` instead of
  `{ at, score, verdict }`. `alerts` mirrors the per-bucket alerts shape
  already used by `/v1/score/multi`. Update any code reading
  `bucket.at` to `bucket.timestamp`.

## [0.8.0] — 2026-08-03

Contract re-sync adding a dedicated feasibility-gate verdict + score-basis
discriminator, plus activity discovery: a new `GET /v1/activities` endpoint
and a typed (but open) `activity` slug union across the SDK's activity-taking
requests. Additive only — existing methods and types are unchanged.

### Added

- **`client.activities()`.** New `GET /v1/activities` (public, no API key
  required): the canonical, catalog-derived list of base activity slugs
  (`slug` / `display_name` / `family`) a caller can pass as `activity`.
  `GET /v1/profiles` is a server-side alias for the same response.
- **Typed `activity` slugs.** `ActivitySlug` is a new exported type — an
  **open union** of `KnownActivitySlug` (autocomplete over
  `KNOWN_ACTIVITY_SLUGS`, a committed snapshot of the catalog's current base
  activities) plus `| (string & {})`. Applied to the `activity` field on
  `score`, `scoreSeries`, `scoreHistorical`, `explainCounterfactual`,
  `decision`, `briefing`, `scoreDifficulty`, and `recommendSpot` requests. It
  stays open by design: a brand-new catalog activity is never a compile
  error just because the shipped snapshot hasn't caught up — call
  `client.activities()` for the live, authoritative list. `KNOWN_ACTIVITY_SLUGS`
  is refreshed from the live catalog by `scripts/genSlugs.ts` (run in the
  `refresh-openapi` workflow), independent of the OpenAPI contract sync.
- **`not_feasible` verdict.** A score of 0 from a FEASIBILITY gate (e.g. no
  navigable route, no lift service) — not dangerous, just not doable — now
  reads `verdict: "not_feasible"` instead of `"unsafe"`. `"unsafe"` is now
  reserved for a genuine safety gate (lightning, AQI, etc.).
- **`scoreBasis` discriminator.** `ScoreResponse` (and the equivalent series /
  historical / difficulty responses) now carries
  `scoreBasis: "forecast" | "gated" | "no_data"`, exported as the `ScoreBasis`
  type. `"gated"` distinguishes a hard-gate 0 from a genuine low forecast
  score, and now carries a full `breakdown` + `physics` so a no-go response
  shows *why* rather than coming back empty.
- **`did_you_mean` / `valid_slugs` on `ACTIVITY_NOT_FOUND`.** The error
  `detail` for an unrecognised activity now includes the full list of valid
  slugs plus a fuzzy `did_you_mean` suggestion when one catalog slug is a
  close match.

## [0.7.0] — 2026-08-02

Contract re-sync adding the outcomes recall + reason-attribution surface, plus
the enriched drift-flag response that came with the full-spec sync. Additive
only — existing methods and types are unchanged. Ships the same API contract as
the Python SDK's 0.3.0 release (the two SDKs track the same contract but carry
independent version numbers).

### Added

- **`client.voidOutcomes(input)` — "lot recall".** New `POST /v1/outcomes/void`:
  non-destructively retract a batch of previously-reported outcomes (rows are
  stamped voided and kept for audit) so they stop influencing calibration +
  verification on the next MV refresh. At least one narrowing selector
  (`batch_ref`, `audit_log_id`, `submitted_by_key_id`, `occurred_from`,
  `occurred_to`) is required so a recall can never blank a tenant's whole
  history; returns `{ voided }`, the number of rows retracted.
- **`reason_category` on outcome submissions.** The `submitOutcome` and
  `reportOutcome` request bodies now accept `reason_category`
  (`weather` / `operational` / `customer_demand` / `safety` / `mechanical` /
  `unknown`). Only `weather` and `safety` count as evidence against the forecast
  and feed weather-suitability calibration; the rest are recorded as business
  facts and excluded.
- **`batch_ref` on `submitOutcome`.** Tag a lot / ingestion run so a later
  `voidOutcomes` recall can pull back exactly that batch if it was mislabelled.
- **`submitOutcome` idempotency.** `submitOutcome(input, { idempotencyKey })` now
  forwards the `Idempotency-Key` header, matching `reportOutcome` — a retry after
  a network timeout can't double-record the outcome.
- **Enriched drift-flag response.** The drift-flag payload now carries `cell`,
  `metric`, `reference_type`, `days_in_decline`, and `recalibration_triggered`
  alongside the existing `severity` / `since_timestamp` (came with the full-spec
  re-sync).

## [0.6.0] — 2026-07-30

Contract re-sync to the live API after the monorepo's score-family coherence
release: the `/v1/score/multi` response is now fully modelled, feasibility-gate
prerequisites surface on each breakdown entry, and score alerts carry their
`kind`. Additive only — no breaking changes to existing methods or types.
Versioned in lockstep with `goable-sdk` (Python) 0.6.0.

### Added

- **`/v1/score/multi` response fully typed.** The multi-spot response `breakdown`
  is now modelled end-to-end (per-spot dimension breakdown) instead of a loose
  object.
- **`breakdown[].prerequisite`.** Each dimension breakdown entry now exposes the
  prerequisite (go/no-go feasibility) flag from the scoring engine.
- **`alert.kind`.** Score alerts now carry a `kind` discriminator
  (`safety` / `feasibility`), and the multi-alert shape is modelled.

### Changed (CI/tooling only — no API surface change)

- **`refresh-openapi` drift check hardened.** The daily sync compared the
  committed `openapi.json` against the live `/docs/openapi.json`, which reports
  the deployment's real `info.version` (e.g. `1.0.0`) and expands JSON arrays
  differently — so it flagged a cosmetic "drift" (and opened a PR) every day even
  with no contract change. Both sides now run through `scripts/normalizeSpec.mjs`:
  `info.version` pinned to `0.0.0` and canonical 2-space serialisation. The
  committed spec is kept normalised (guarded by `test/specNormalized.test.ts`),
  so a sync PR only opens on a real contract change. The committed `openapi.json`
  is reformatted to the canonical form (array formatting only — the generated
  types are byte-identical).
- **Releases scoped to code changes.** The `release` workflow triggered on every
  push to `main`, publishing a patch even for merges that only touched CI, docs,
  tests, or `openapi.json` formatting. It now runs only when `src/**`,
  `package.json`, or `tsconfig.json` change; force a release without a code
  change by bumping the version in `package.json`.

## [0.5.0] — 2026-07-14

Completeness sweep: the client now exposes a method for **every** path in the
public OpenAPI contract (39 paths / 42 operations — 100% coverage). The contract
snapshot (`openapi.json`) was re-synced from the canonical
`apps/api/openapi.json` and the wire types regenerated. Additive only — no
breaking changes to existing methods or types.

### Added

- **Health**: `healthReady()` (`GET /v1/health/ready`).
- **Outcomes**: `submitOutcome()` (`POST /v1/outcomes`) — a standalone activity
  outcome not tied to a scored session (complements the existing
  `reportOutcome(sessionId, …)`).
- **Audit / compliance**: `auditExport(query)` (`GET /v1/audit/export`) — returns
  the raw CSV `string` when `format: "csv"`, otherwise the parsed JSON export
  (overloaded return type).
- **LLM BYOK**: `setLlmKey()` / `getLlmKey()` / `deleteLlmKey()`
  (`PUT`/`GET`/`DELETE /v1/tenant/llm-key`) — set/rotate, read masked status, and
  remove the tenant's own Anthropic key. `set`/`delete` resolve `void` on 204.
- **Legal**: `legalDocument(kind)` (`GET /v1/legal/{kind}/current`, no auth) with
  the `LegalDocumentKind` enum type.
- **Idempotency**: `bindPolicy()` and `reportOutcome()` accept an optional
  `{ idempotencyKey }` — forwarded as the `Idempotency-Key` header so a retry
  after a network timeout can't double-apply the write.
- **Rate limits**: `GoableApiError` now carries `retryAfterSeconds` (from the
  `Retry-After` header on a `429`; `null` otherwise) and `rateLimit`
  (`{ limit, remaining, reset }` from the `X-RateLimit-*` headers when present).
  Exported the `RateLimit` and `ApiErrorExtra` types.

### Changed

- `openapi.json` re-synced to the canonical `apps/api/openapi.json`, adding the
  `/v1/health/ready`, `/v1/outcomes`, `/v1/audit/export`, `/v1/legal/*` and
  `/v1/tenant/llm-key` paths, plus the `score` request `rider_skill_level` input
  and the documented `X-RateLimit-*` / `Retry-After` / `Idempotency-Key` headers.
  Types regenerated via `pnpm gen`.

### Notes

- `score().eco` remains an **open record** (`{ [key: string]: unknown }`) in the
  contract by design, so provenance blocks such as `eco.lightning_observation`
  (and any website-layer enrichments like `eco.sstValidation`) are reachable
  without the SDK hard-coding — and therefore lying about — a shape the API
  doesn't guarantee.

## [0.4.0] — 2026-07-04

Coverage sweep: the contract now describes the full public API surface, and the
client exposes a method for every tenant-facing and public endpoint. Additive
only — no breaking changes to existing methods or types.

### Added

- **Underwriting policy lifecycle** (Scale): `getQuote(id)`, `bindPolicy()`,
  `listPolicies(query?)`, `getPolicy(policyId)`, `evaluatePolicy(policyId)`,
  `settlePolicy(policyId, input)`. Quote and policy responses now carry the
  serialised policy echo with per-spot `tier` + `tierSource`
  (`"catalog" | "classifier" | null`) on `policy.spot` and each
  `policy.portfolio[i]`.
- **`DriftActiveError`** — a `GoableApiError` subclass thrown on
  `422 DRIFT_ACTIVE` from `bindPolicy()` (an open warning/critical L9 drift
  event on the resolved cell refuses the bind). Exposes `openDriftEvents`. A
  watch-level event instead surfaces as `driftAdvisories` on a successful bind.
- **Skill / calibration**: `scoreDifficulty()` (L15 skill-conditioned grids).
  `score()` requests accept the optional `rider_skill_level` input, and the
  `ScoreResponse` type now includes `calibration_provenance.tier_source` (L11)
  and the `confidenceDetail` discriminated union (`mode: "forecast"`; historical
  on `scoreHistorical()`, climate on `projections()`).
- **Observations / nowcasting** (L5.3): `createStation()`, `listStations()`,
  `updateStation()`, `submitObservations()`, `recentObservations()`.
- **Projections**: `projectionsPortfolio()` and `adaptationReport()` (T3).
- **Calibration loop**: `reportOutcome(sessionId, input)`.
- **Intelligence**: `edgeCase()`.
- **Public / research (no-auth)**: `sustainabilityIndex()` (JSON-LD),
  `verificationExport()` and `difficultyAtlasExport()` (raw NDJSON streams
  returned as `string`), `publicSignup()`, `catalogStats()`.
- **Webhooks**: `WebhookEventType` (the 9-event union, incl. the new
  `underwriting.policy.{bound,triggered,settled}`) and a `WebhookDelivery<T>`
  envelope type (`{ id, type, created, data }`).

### Changed

- OpenAPI contract re-synced to the live routes. The stale underwriting paths
  `POST /v1/underwriting/bind` and `POST /v1/underwriting/evaluate` are replaced
  by the real `POST /v1/underwriting/policy/bind` and
  `POST /v1/underwriting/policy/{policyId}/evaluate`.
- Transport gained a raw-text path (for NDJSON research streams) and query-string
  serialisation for `GET` endpoints. Isomorphic (Node + browser) as before.

## [0.3.0]

Initial standalone release of `@goable-io/sdk`.

[0.5.0]: https://github.com/goable-io/sdk/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/goable-io/sdk/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/goable-io/sdk/releases/tag/v0.3.0
