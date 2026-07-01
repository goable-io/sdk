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
type JsonOf<T> = T extends { content: { "application/json": infer B } } ? B : never
/** application/json request body of an operation. */
type ReqOf<O> = O extends { requestBody?: infer RB } ? JsonOf<NonNullable<RB>> : never
/** application/json body of a response status code. */
type ResOf<O, C extends number> = O extends { responses: infer R } ? (C extends keyof R ? JsonOf<R[C]> : never) : never

type Post<P extends keyof paths> = paths[P] extends { post: infer O } ? O : never

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
