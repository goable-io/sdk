/**
 * GoableClient — thin typed transport over the public Goable REST API.
 * No caching, no business logic; one `request<T>` powers every method.
 */

import { GoableNetworkError, toApiError } from "./errors.ts"
import type {
  BriefingRequest,
  BriefingResponse,
  CounterfactualRequest,
  CounterfactualResponse,
  DecisionRequest,
  DecisionResponse,
  DeleteUserDataResult,
  ExplainRequest,
  ExplainResponse,
  HealthResponse,
  ProjectionsRequest,
  ProjectionsResponse,
  QuoteRequest,
  QuoteResponse,
  RecommendSpotRequest,
  RecommendSpotResponse,
  ScoreHistoricalRequest,
  ScoreHistoricalResponse,
  ScoreMultiRequest,
  ScoreMultiResponse,
  ScorePortfolioRequest,
  ScorePortfolioResponse,
  ScoreRequest,
  ScoreResponse,
  ScoreSeriesRequest,
  ScoreSeriesResponse,
} from "./types.ts"

export type FetchLike = (
  input: string,
  init?: {
    method?: string
    headers?: Record<string, string>
    body?: string
    signal?: AbortSignal
  },
) => Promise<{
  ok: boolean
  status: number
  headers: { get(name: string): string | null }
  text(): Promise<string>
}>

export interface GoableClientOptions {
  /** Tenant API key — sent as `X-Goable-Key: <apiKey>`. */
  apiKey: string
  /** Base URL. Default https://api.goable.io */
  baseUrl?: string
  /** Injected fetch (tests, non-global-fetch runtimes). Default globalThis.fetch. */
  fetch?: FetchLike
  /** Per-request timeout in ms. Default 30000. 0 disables. */
  timeoutMs?: number
}

const DEFAULT_BASE_URL = "https://api.goable.io"
const DEFAULT_TIMEOUT_MS = 30_000

export class GoableClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly fetchImpl: FetchLike
  private readonly timeoutMs: number

  constructor(options: GoableClientOptions) {
    if (!options.apiKey) throw new Error("GoableClient requires an apiKey")
    this.apiKey = options.apiKey
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "")
    const f = options.fetch ?? (globalThis.fetch as unknown as FetchLike | undefined)
    if (!f) {
      throw new Error("No fetch available — pass options.fetch (Node < 18 or non-fetch runtime)")
    }
    this.fetchImpl = f
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  }

  // ── public methods ──────────────────────────────────────────────────────
  health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("GET", "/v1/health")
  }

  score(input: ScoreRequest): Promise<ScoreResponse> {
    return this.request<ScoreResponse>("POST", "/v1/score", input)
  }

  scoreSeries(input: ScoreSeriesRequest): Promise<ScoreSeriesResponse> {
    return this.request<ScoreSeriesResponse>("POST", "/v1/score/series", input)
  }

  scoreMulti(input: ScoreMultiRequest): Promise<ScoreMultiResponse> {
    return this.request<ScoreMultiResponse>("POST", "/v1/score/multi", input)
  }

  scoreHistorical(input: ScoreHistoricalRequest): Promise<ScoreHistoricalResponse> {
    return this.request<ScoreHistoricalResponse>("POST", "/v1/score/historical", input)
  }

  scorePortfolio(input: ScorePortfolioRequest): Promise<ScorePortfolioResponse> {
    return this.request<ScorePortfolioResponse>("POST", "/v1/score/portfolio", input)
  }

  explainCounterfactual(input: CounterfactualRequest): Promise<CounterfactualResponse> {
    return this.request<CounterfactualResponse>("POST", "/v1/score/explain-counterfactual", input)
  }

  decision(input: DecisionRequest): Promise<DecisionResponse> {
    return this.request<DecisionResponse>("POST", "/v1/decision", input)
  }

  explain(input: ExplainRequest): Promise<ExplainResponse> {
    return this.request<ExplainResponse>("POST", "/v1/intelligence/explain", input)
  }

  briefing(input: BriefingRequest): Promise<BriefingResponse> {
    return this.request<BriefingResponse>("POST", "/v1/intelligence/briefing", input)
  }

  projections(input: ProjectionsRequest): Promise<ProjectionsResponse> {
    return this.request<ProjectionsResponse>("POST", "/v1/projections", input)
  }

  quote(input: QuoteRequest): Promise<QuoteResponse> {
    return this.request<QuoteResponse>("POST", "/v1/underwriting/quote", input)
  }

  /**
   * L10 — inverse query: given `(activity, region, radius, window)`,
   * returns top-K ranked sub-spots. Per-plan caps apply (radius
   * 25/50/200/1000 km, topK 5/10/20/50 across Free / Starter / Pro
   * / Scale); requests above the cap return 402 PLAN_LIMIT_EXCEEDED.
   * Pass `userPseudonym` on Pro+ to get personalization via the L6
   * cold-start blend.
   */
  recommendSpot(input: RecommendSpotRequest): Promise<RecommendSpotResponse> {
    return this.request<RecommendSpotResponse>("POST", "/v1/recommend-spot", input)
  }

  /** GDPR Art. 17 erasure. Surfaces the receipt headers from a 204. */
  async deleteUserData(pseudonym: string): Promise<DeleteUserDataResult> {
    const res = await this.rawRequest("DELETE", `/v1/decision/user-data/${encodeURIComponent(pseudonym)}`)
    if (!res.ok) {
      throw toApiError(res.status, await safeJson(res))
    }
    const intHeader = (name: string): number | null => {
      const v = res.headers.get(name)
      const n = v === null ? Number.NaN : Number(v)
      return Number.isFinite(n) ? n : null
    }
    return {
      status: res.status,
      anonymizedRows: intHeader("X-Anonymized-Rows"),
      anonymizedDecisionRuns: intHeader("X-Anonymized-Decision-Runs"),
      anonymizedRecommendationRuns: intHeader("X-Anonymized-Recommendation-Runs"),
      receipt: res.headers.get("X-Receipt"),
    }
  }

  // ── transport ─────────────────────────────────────────────────────────────
  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await this.rawRequest(method, path, body)
    const parsed = await safeJson(res)
    if (!res.ok) throw toApiError(res.status, parsed)
    return parsed as T
  }

  private async rawRequest(method: string, path: string, body?: unknown): ReturnType<FetchLike> {
    // `X-Goable-Key` rather than `Authorization: Bearer` — the API
    // sits behind CloudFront with OAC, which hijacks the standard
    // Authorization header for its own SigV4 signature. Custom header
    // sidesteps the conflict and stays untouched end-to-end.
    // Server-side middleware also accepts `Authorization: Bearer` as
    // a fallback for direct testing without CloudFront in the path.
    const headers: Record<string, string> = {
      "X-Goable-Key": this.apiKey,
      Accept: "application/json",
    }
    if (body !== undefined) headers["Content-Type"] = "application/json"

    const controller = this.timeoutMs > 0 ? new AbortController() : undefined
    const timer = controller && this.timeoutMs > 0 ? setTimeout(() => controller.abort(), this.timeoutMs) : undefined

    try {
      return await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers,
        ...(body !== undefined && { body: JSON.stringify(body) }),
        ...(controller && { signal: controller.signal }),
      })
    } catch (err) {
      const aborted = (err as { name?: string })?.name === "AbortError"
      throw new GoableNetworkError(
        aborted ? `Request timed out after ${this.timeoutMs}ms` : `Network request failed: ${path}`,
        aborted ? "timeout" : "network",
        err,
      )
    } finally {
      if (timer) clearTimeout(timer)
    }
  }
}

async function safeJson(res: { text(): Promise<string> }): Promise<unknown> {
  let text: string
  try {
    text = await res.text()
  } catch (err) {
    throw new GoableNetworkError("Failed to read response body", "parse", err)
  }
  if (text === "") return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
