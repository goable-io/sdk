# Changelog

All notable changes to `@goable-io/sdk` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.4.0]: https://github.com/goable-io/sdk/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/goable-io/sdk/releases/tag/v0.3.0
