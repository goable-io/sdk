# Changelog

All notable changes to `@goable-io/sdk` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed (tooling only — no API surface change)

- **`refresh-openapi` drift check hardened.** The daily sync compared the
  committed `openapi.json` against the live `/docs/openapi.json`, which reports
  the deployment's real `info.version` (e.g. `1.0.0`) and expands JSON arrays
  differently — so it flagged a cosmetic "drift" (and opened a PR) every day even
  with no contract change. Both sides now run through `scripts/normalizeSpec.mjs`
  (`pnpm normalize`): `info.version` pinned to `0.0.0` and canonical 2-space
  serialisation. The committed spec is kept normalised (guarded by
  `test/specNormalized.test.ts`), so a sync PR only opens on a real contract
  change. The committed `openapi.json` is reformatted to the canonical form
  (array formatting only — the generated types are byte-identical).

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
