/**
 * Public request/response types — DERIVED from the generated OpenAPI
 * contract (src/generated/api.ts), never hand-authored. A change to the
 * API's OpenAPI document + `pnpm gen` updates these automatically; only a
 * genuinely new endpoint (new client method) is a manual change.
 *
 * These are thin, named aliases over `paths[...]` so call sites read
 * nicely (`ScoreRequest`, `ScoreResponse`) instead of deep index chains.
 */

import type { components, paths } from "./generated/api.ts"

// ── helpers ────────────────────────────────────────────────────────────
/** The sole media body of a request/response, whatever the media type
 *  (application/json, application/ld+json, or application/x-ndjson → string). */
type ContentOf<T> = T extends { content: infer C } ? C[keyof C] : never
/** Request body of an operation. */
type ReqOf<O> = O extends { requestBody?: infer RB } ? ContentOf<NonNullable<RB>> : never
/** Response body for a specific status code. */
type ResOf<O, C extends number> = O extends { responses: infer R }
  ? C extends keyof R
    ? ContentOf<R[C]>
    : never
  : never
/** The 2xx success body — the first of 200 / 201 / 202 the operation declares. */
type OkOf<O> = O extends { responses: infer R }
  ? 200 extends keyof R
    ? ContentOf<R[200]>
    : 201 extends keyof R
      ? ContentOf<R[201]>
      : 202 extends keyof R
        ? ContentOf<R[202]>
        : never
  : never
/** The query-parameter object of an operation. */
type QueryOf<O> = O extends { parameters: { query?: infer Q } } ? NonNullable<Q> : never
/** The path-parameter object of an operation. */
type PathOf<O> = O extends { parameters: { path?: infer P } } ? NonNullable<P> : never
/** The `application/json` body for a specific response status — used when an
 *  operation declares several media types (e.g. JSON + text/csv) and we want
 *  only the JSON branch, not the `object | string` union `ResOf` would give. */
type JsonResOf<O, C extends number> = O extends { responses: infer R }
  ? C extends keyof R
    ? R[C] extends { content: { "application/json": infer J } }
      ? J
      : never
    : never
  : never

type Get<P extends keyof paths> = paths[P] extends { get: infer O } ? O : never
type Post<P extends keyof paths> = paths[P] extends { post: infer O } ? O : never
type Put<P extends keyof paths> = paths[P] extends { put: infer O } ? O : never
type Patch<P extends keyof paths> = paths[P] extends { patch: infer O } ? O : never

// ── shared primitives (from components) ───────────────────────────────────
export type GeoPoint = components["schemas"]["GeoPoint"]
export type TimeWindowInput = components["schemas"]["TimeWindow"]
export type Verdict = components["schemas"]["Verdict"]

// ── per-endpoint request + response aliases ───────────────────────────────
export type ScoreRequest = ReqOf<Post<"/v1/score">>
export type ScoreResponse = ResOf<Post<"/v1/score">, 200>

export type ScoreSeriesRequest = ReqOf<Post<"/v1/score/series">>
export type ScoreSeriesResponse = ResOf<Post<"/v1/score/series">, 200>

export type ScoreMultiRequest = ReqOf<Post<"/v1/score/multi">>
export type ScoreMultiResponse = ResOf<Post<"/v1/score/multi">, 200>

export type ScoreHistoricalRequest = ReqOf<Post<"/v1/score/historical">>
export type ScoreHistoricalResponse = ResOf<Post<"/v1/score/historical">, 200>

export type ScorePortfolioRequest = ReqOf<Post<"/v1/score/portfolio">>
export type ScorePortfolioResponse = ResOf<Post<"/v1/score/portfolio">, 200>

export type CounterfactualRequest = ReqOf<Post<"/v1/score/explain-counterfactual">>
export type CounterfactualResponse = ResOf<Post<"/v1/score/explain-counterfactual">, 200>

export type DecisionRequest = ReqOf<Post<"/v1/decision">>
export type DecisionResponse = ResOf<Post<"/v1/decision">, 200>

export type ExplainRequest = ReqOf<Post<"/v1/intelligence/explain">>
export type ExplainResponse = ResOf<Post<"/v1/intelligence/explain">, 200>

export type BriefingRequest = ReqOf<Post<"/v1/intelligence/briefing">>
export type BriefingResponse = ResOf<Post<"/v1/intelligence/briefing">, 200>

export type ProjectionsRequest = ReqOf<Post<"/v1/projections">>
export type ProjectionsResponse = ResOf<Post<"/v1/projections">, 200>

export type QuoteRequest = ReqOf<Post<"/v1/underwriting/quote">>
export type QuoteResponse = ResOf<Post<"/v1/underwriting/quote">, 200>

export type RecommendSpotRequest = ReqOf<Post<"/v1/recommend-spot">>
export type RecommendSpotResponse = ResOf<Post<"/v1/recommend-spot">, 200>

export type ScoreDifficultyRequest = ReqOf<Post<"/v1/score/difficulty">>
export type ScoreDifficultyResponse = OkOf<Post<"/v1/score/difficulty">>

export type ReportOutcomeRequest = ReqOf<Post<"/v1/score/{sessionId}/outcome">>
export type ReportOutcomeResponse = OkOf<Post<"/v1/score/{sessionId}/outcome">>

/** Standalone activity outcome, not tied to a scored session (`POST /v1/outcomes`). */
export type SubmitOutcomeRequest = ReqOf<Post<"/v1/outcomes">>
export type SubmitOutcomeResponse = OkOf<Post<"/v1/outcomes">>

export type EdgeCaseRequest = ReqOf<Post<"/v1/intelligence/edge-case">>
export type EdgeCaseResponse = OkOf<Post<"/v1/intelligence/edge-case">>

export type ProjectionsPortfolioRequest = ReqOf<Post<"/v1/projections/portfolio">>
export type ProjectionsPortfolioResponse = OkOf<Post<"/v1/projections/portfolio">>

export type AdaptationReportRequest = ReqOf<Post<"/v1/projections/adaptation-report">>
export type AdaptationReportResponse = OkOf<Post<"/v1/projections/adaptation-report">>

// ── underwriting policy lifecycle ─────────────────────────────────────────
export type QuoteByIdResponse = OkOf<Get<"/v1/underwriting/quote/{id}">>

export type BindPolicyRequest = ReqOf<Post<"/v1/underwriting/policy/bind">>
export type BindPolicyResponse = OkOf<Post<"/v1/underwriting/policy/bind">>

export type ListPoliciesQuery = QueryOf<Get<"/v1/underwriting/policy">>
export type ListPoliciesResponse = OkOf<Get<"/v1/underwriting/policy">>

export type PolicyResponse = OkOf<Get<"/v1/underwriting/policy/{policyId}">>

export type EvaluatePolicyResponse = OkOf<Post<"/v1/underwriting/policy/{policyId}/evaluate">>

export type SettlePolicyRequest = ReqOf<Post<"/v1/underwriting/policy/{policyId}/settle">>
export type SettlePolicyResponse = OkOf<Post<"/v1/underwriting/policy/{policyId}/settle">>

/** Serialised parametric policy record + payout event, reused across the lifecycle. */
export type SerialisedPolicy = components["schemas"]["SerialisedPolicy"]
export type SerialisedPayoutEvent = components["schemas"]["SerialisedPayoutEvent"]

// ── observations (L5.3) ───────────────────────────────────────────────────
export type CreateStationRequest = ReqOf<Post<"/v1/observations/stations">>
export type CreateStationResponse = OkOf<Post<"/v1/observations/stations">>

export type ListStationsResponse = OkOf<Get<"/v1/observations/stations">>

export type UpdateStationRequest = ReqOf<Patch<"/v1/observations/stations/{stationId}">>
export type UpdateStationResponse = OkOf<Patch<"/v1/observations/stations/{stationId}">>

export type SubmitObservationsRequest = ReqOf<Post<"/v1/observations">>
export type SubmitObservationsResponse = OkOf<Post<"/v1/observations">>

export type RecentObservationsQuery = QueryOf<Get<"/v1/observations/stations/{stationId}/recent">>
export type RecentObservationsResponse = OkOf<Get<"/v1/observations/stations/{stationId}/recent">>

// ── public / research (no-auth) ───────────────────────────────────────────
export type SustainabilityIndexQuery = QueryOf<Get<"/v1/public/sustainability-index">>
export type SustainabilityIndexResponse = OkOf<Get<"/v1/public/sustainability-index">>

export type VerificationExportQuery = QueryOf<Get<"/v1/research/verification/export">>

export type PublicSignupRequest = ReqOf<Post<"/v1/public/signup">>
export type PublicSignupResponse = OkOf<Post<"/v1/public/signup">>

export type CatalogStatsResponse = OkOf<Get<"/v1/public/catalog-stats">>

/** Legal document kinds (from the OpenAPI path-param enum). */
export type LegalDocumentKind = PathOf<Get<"/v1/legal/{kind}/current">>["kind"]
export type LegalDocumentResponse = OkOf<Get<"/v1/legal/{kind}/current">>

// ── health / audit / BYOK (tenant surfaces) ───────────────────────────────
export type HealthReadyResponse = OkOf<Get<"/v1/health/ready">>

export type AuditExportQuery = QueryOf<Get<"/v1/audit/export">>
/** The JSON body of an audit export (`format=json`, the default). The `csv`
 *  variant is returned as a raw `string` by the client, not this type. */
export type AuditExportResponse = JsonResOf<Get<"/v1/audit/export">, 200>

export type SetLlmKeyRequest = ReqOf<Put<"/v1/tenant/llm-key">>
export type LlmKeyStatus = OkOf<Get<"/v1/tenant/llm-key">>

// ── request options ───────────────────────────────────────────────────────
/** Per-call options for endpoints that accept an `Idempotency-Key` header
 *  (`bindPolicy`, `reportOutcome`) — a client-generated key so a retry after a
 *  network timeout can't double-apply the write. */
export interface IdempotencyOptions {
  idempotencyKey?: string
}

// ── webhooks ──────────────────────────────────────────────────────────────
/** Every webhook event the platform can deliver (from the OpenAPI enum). */
export type WebhookEventType = components["schemas"]["WebhookEvent"]

/**
 * A webhook delivery body, POSTed to a tenant's registered endpoint. The
 * envelope shape is stable; `data` is per-event and best-effort — narrow it
 * with `if (delivery.type === "underwriting.policy.bound") { ... }`. Field
 * names mirror the deliverer exactly (`id` / `type` / `created`).
 */
export interface WebhookDelivery<T = Record<string, unknown>> {
  id: string
  type: WebhookEventType
  created: string
  data: T
}

export type HealthResponse = ResOf<paths["/v1/health"] extends { get: infer O } ? O : never, 200>

// ── SDK-specific result types (not wire schemas) ─────────────────────────
/** GDPR erasure surfaces receipt headers from the 204 response. */
export interface DeleteUserDataResult {
  status: number
  /** Total rows anonymised across audit-log / behavioural model /
   *  decision_runs / recommendation_runs (the X-Anonymized-Rows
   *  header). The kind-specific counts below let callers attribute
   *  the deletion to each store for their own DSAR audit file. */
  anonymizedRows: number | null
  anonymizedDecisionRuns: number | null
  /** L10 — count of recommendation_runs rows anonymised. Wired with
   *  migration 0030; older API deploys may return null. */
  anonymizedRecommendationRuns: number | null
  receipt: string | null
}

// Re-export the raw generated surface for advanced consumers.
export type { components, paths } from "./generated/api.ts"
