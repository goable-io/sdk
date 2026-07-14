# @goable-io/sdk

[![npm](https://img.shields.io/npm/v/@goable-io/sdk.svg)](https://www.npmjs.com/package/@goable-io/sdk)
[![CI](https://github.com/goable-io/sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/goable-io/sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

TypeScript client for the [Goable](https://goable.io) API — 0-100 suitability
scoring for outdoor activities (water, snow, air, land) from real-time weather
and multi-domain physics.

Thin, typed transport over the public tenant-facing REST surface. **Zero runtime
dependencies.** Works in Node ≥18 and modern browser/edge runtimes (uses the
global `fetch`). Published to npm with [provenance](https://docs.npmjs.com/generating-provenance-statements).

## Install

```bash
npm install @goable-io/sdk
# or: pnpm add @goable-io/sdk
```

## Quickstart

```ts
import { GoableClient } from "@goable-io/sdk"

const goable = new GoableClient({ apiKey: process.env.GOABLE_API_KEY! })

// Score a single activity at a location + time window
const result = await goable.score({
  activity: "kitesurfing",
  location: { lat: 43.7, lng: 7.27 },
  window: { from: "2026-06-01T06:00:00Z", to: "2026-06-01T18:00:00Z" },
})

result.score    // 0-100
result.verdict  // "unsafe" | "poor" | "marginal" | "fair" | "favorable" | "excellent"
result.confidence
```

Inverse query — "where should I go?" — ranks sub-spots for an activity within
a region:

```ts
const spots = await goable.recommendSpot({
  activity: "kitesurfing",
  region: { center: { lat: 43.7, lng: 7.27 }, radiusKm: 50 },
  window: { from: "2026-06-01T06:00:00Z", to: "2026-06-01T18:00:00Z" },
  topK: 5,
})
```

## Authentication

Every request carries your tenant API key. The canonical production header is
**`X-Goable-Key`**, which the client sends automatically:

```ts
new GoableClient({ apiKey: "gk_…" })   // → sends "X-Goable-Key: gk_…"
```

> The API also accepts `Authorization: Bearer <key>` as a legacy fallback for
> direct testing, but new integrations should use the default `X-Goable-Key`
> path. (Production traffic sits behind CloudFront, which reserves the
> `Authorization` header for its own signature — the custom header sidesteps
> that.)

Mint a key from the tenant portal at
[console.goable.io/portal/keys](https://console.goable.io/portal/keys).

## Configuration

```ts
new GoableClient({
  apiKey: "…",                      // required — sent as X-Goable-Key
  baseUrl: "https://api.goable.io", // default
  timeoutMs: 30_000,                // default; 0 disables
  fetch: customFetch,               // default globalThis.fetch (inject for Node <18 / tests)
})
```

## Methods

The client mirrors the full public tenant-facing surface — one method per
OpenAPI path. Grouped by area:

### Score

| Method | Endpoint | Notes |
|---|---|---|
| `score(input)` | `POST /v1/score` | `ensemble: true` → probabilistic (Pro+); `rider_skill_level` skill-conditioned (Pro+) |
| `scoreSeries(input)` | `POST /v1/score/series` | per-step over a window |
| `scoreMulti(input)` | `POST /v1/score/multi` | many activities, one location |
| `scoreHistorical(input)` | `POST /v1/score/historical` | climatology percentiles (Pro+) |
| `scorePortfolio(input)` | `POST /v1/score/portfolio` | multi-spot joint variance |
| `scoreDifficulty(input)` | `POST /v1/score/difficulty` | L15 skill-conditioned difficulty grids (Pro+) |
| `explainCounterfactual(input)` | `POST /v1/score/explain-counterfactual` | binding constraint, sensitivities, best window/spot |
| `reportOutcome(sessionId, input, opts?)` | `POST /v1/score/{sessionId}/outcome` | close the calibration loop; `opts.idempotencyKey` |

### Recommend

| Method | Endpoint | Notes |
|---|---|---|
| `recommendSpot(input)` | `POST /v1/recommend-spot` | inverse query: top-K ranked sub-spots |

### Decision

| Method | Endpoint | Notes |
|---|---|---|
| `decision(input)` | `POST /v1/decision` | personalized go/no-go (Pro+) |
| `deleteUserData(pseudonym)` | `DELETE /v1/decision/user-data/{pseudonym}` | GDPR erasure; returns receipt headers |

### Intelligence

| Method | Endpoint | Notes |
|---|---|---|
| `explain(input)` | `POST /v1/intelligence/explain` | LLM narrative (Pro+) |
| `briefing(input)` | `POST /v1/intelligence/briefing` | LLM briefing (Pro+) |
| `edgeCase(input)` | `POST /v1/intelligence/edge-case` | LLM edge-case narrative for a marginal score |

### Projections (Scale)

| Method | Endpoint | Notes |
|---|---|---|
| `projections(input)` | `POST /v1/projections` | single-spot climate-decadal |
| `projectionsPortfolio(input)` | `POST /v1/projections/portfolio` | multi-spot |
| `adaptationReport(input)` | `POST /v1/projections/adaptation-report` | months × scenarios × decades |

### Underwriting (Scale)

| Method | Endpoint | Notes |
|---|---|---|
| `quote(input)` | `POST /v1/underwriting/quote` | parametric premium |
| `getQuote(id)` | `GET /v1/underwriting/quote/{id}` | fetch a stored quote |
| `bindPolicy(input, opts?)` | `POST /v1/underwriting/policy/bind` | bind a quote; `opts.idempotencyKey`; 422 `DRIFT_ACTIVE` → `DriftActiveError` |
| `listPolicies(query?)` | `GET /v1/underwriting/policy` | paginated, `boundAt` DESC |
| `getPolicy(policyId)` | `GET /v1/underwriting/policy/{policyId}` | policy + payout events |
| `evaluatePolicy(policyId)` | `POST /v1/underwriting/policy/{policyId}/evaluate` | re-evaluate; bodyless |
| `settlePolicy(policyId, input)` | `POST /v1/underwriting/policy/{policyId}/settle` | platform-ops only |

### Observations / nowcasting (L5.3)

| Method | Endpoint | Notes |
|---|---|---|
| `createStation(input)` | `POST /v1/observations/stations` | register a station |
| `listStations()` | `GET /v1/observations/stations` | the tenant's stations |
| `updateStation(stationId, input)` | `PATCH /v1/observations/stations/{stationId}` | partial update |
| `recentObservations(stationId, query?)` | `GET /v1/observations/stations/{stationId}/recent` | most-recent observations |
| `submitObservations(input)` | `POST /v1/observations` | push into the 0-6h window (Pro+) |
| `submitOutcome(input)` | `POST /v1/outcomes` | standalone outcome (not tied to a scored session) |

### Audit & compliance

| Method | Endpoint | Notes |
|---|---|---|
| `auditExport(query)` | `GET /v1/audit/export` | `format: "csv"` → `string`, else parsed JSON |

### LLM BYOK (bring-your-own Anthropic key)

| Method | Endpoint | Notes |
|---|---|---|
| `setLlmKey(input)` | `PUT /v1/tenant/llm-key` | validate + store; resolves `void` (204) |
| `getLlmKey()` | `GET /v1/tenant/llm-key` | masked status (never the key) |
| `deleteLlmKey()` | `DELETE /v1/tenant/llm-key` | remove; resolves `void` (204) |

### Health, legal & public (no auth)

| Method | Endpoint | Notes |
|---|---|---|
| `health()` | `GET /v1/health` | liveness |
| `healthReady()` | `GET /v1/health/ready` | readiness (503 → `GoableApiError`) |
| `legalDocument(kind)` | `GET /v1/legal/{kind}/current` | current published legal doc |
| `catalogStats()` | `GET /v1/public/catalog-stats` | open catalogue coverage stats |
| `sustainabilityIndex(query)` | `GET /v1/public/sustainability-index` | Goable Sustainability Index (JSON-LD) |
| `publicSignup(input)` | `POST /v1/public/signup` | self-service tenant signup |

### Research (open data, CC BY — NDJSON streams returned as `string`)

| Method | Endpoint | Notes |
|---|---|---|
| `difficultyAtlasExport()` | `GET /v1/research/difficulty-atlas/export.jsonl` | L15 Difficulty Atlas |
| `verificationExport(query?)` | `GET /v1/research/verification/export` | Stream F forecast verification |

Full endpoint reference: [goable.io/docs](https://goable.io/docs).

## Errors

```ts
import { GoableApiError, GoableNetworkError } from "@goable-io/sdk"

try {
  await goable.score({ activity: "kitesurfing", location: { lat: 43.7, lng: 7.27 }, ensemble: true })
} catch (err) {
  if (err instanceof GoableApiError) {
    err.status            // e.g. 402
    err.code              // e.g. "PAYMENT_REQUIRED"
    err.issues            // Zod issues on 422 VALIDATION_ERROR
    err.detail            // free-form context (e.g. plan info)
    err.retryAfterSeconds // seconds from `Retry-After` on a 429 (else null)
    err.rateLimit         // { limit, remaining, reset } when the response carried X-RateLimit-* headers
  } else if (err instanceof GoableNetworkError) {
    err.kind    // "timeout" | "network" | "parse"
  }
}
```

On a `429`, back off using the server's hint:

```ts
if (err instanceof GoableApiError && err.status === 429 && err.retryAfterSeconds != null) {
  await new Promise((r) => setTimeout(r, err.retryAfterSeconds! * 1000))
  // …then retry
}
```

`DriftActiveError` (a `GoableApiError` subclass) is thrown on `422 DRIFT_ACTIVE`
from `bindPolicy()` and exposes `openDriftEvents`.

## Browser use

The client runs in the browser, but **API keys are secrets** — prefer
server-side use. For direct browser calls the API's CORS allowlist must include
your origin (contact Goable to allowlist it).

## Types are generated from the API contract

The request/response types are **generated** from the Goable API's OpenAPI
document (`openapi.json`) via
[`openapi-typescript`](https://github.com/openapi-ts/openapi-typescript) — they
are never hand-authored, so they can't drift from the contract. The committed
`openapi.json` tracks the live public API; see
[CONTRIBUTING.md](./CONTRIBUTING.md) for how it stays in sync.

## Contributing & releases

See [CONTRIBUTING.md](./CONTRIBUTING.md). Releases are automated: merging to
`main` publishes to npm with provenance.

## License

MIT © Fabio Carucci
