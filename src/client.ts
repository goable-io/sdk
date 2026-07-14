/**
 * GoableClient — thin typed transport over the public Goable REST API.
 * No caching, no business logic; one `request<T>` powers every method.
 */

import { GoableNetworkError, toApiError } from "./errors.ts"
import type {
  AdaptationReportRequest,
  AdaptationReportResponse,
  AuditExportQuery,
  AuditExportResponse,
  BindPolicyRequest,
  BindPolicyResponse,
  BriefingRequest,
  BriefingResponse,
  CatalogStatsResponse,
  CounterfactualRequest,
  CounterfactualResponse,
  CreateStationRequest,
  CreateStationResponse,
  DecisionRequest,
  DecisionResponse,
  DeleteUserDataResult,
  EdgeCaseRequest,
  EdgeCaseResponse,
  EvaluatePolicyResponse,
  ExplainRequest,
  ExplainResponse,
  HealthReadyResponse,
  HealthResponse,
  IdempotencyOptions,
  LegalDocumentKind,
  LegalDocumentResponse,
  ListPoliciesQuery,
  ListPoliciesResponse,
  ListStationsResponse,
  LlmKeyStatus,
  PolicyResponse,
  ProjectionsPortfolioRequest,
  ProjectionsPortfolioResponse,
  ProjectionsRequest,
  ProjectionsResponse,
  PublicSignupRequest,
  PublicSignupResponse,
  QuoteByIdResponse,
  QuoteRequest,
  QuoteResponse,
  RecentObservationsQuery,
  RecentObservationsResponse,
  RecommendSpotRequest,
  RecommendSpotResponse,
  ReportOutcomeRequest,
  ReportOutcomeResponse,
  ScoreDifficultyRequest,
  ScoreDifficultyResponse,
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
  SetLlmKeyRequest,
  SettlePolicyRequest,
  SettlePolicyResponse,
  SubmitObservationsRequest,
  SubmitObservationsResponse,
  SubmitOutcomeRequest,
  SubmitOutcomeResponse,
  SustainabilityIndexQuery,
  SustainabilityIndexResponse,
  UpdateStationRequest,
  UpdateStationResponse,
  VerificationExportQuery,
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

  /** Readiness probe (DB + skill lookup + LLM config). Note: a degraded/critical
   *  deployment answers `503`, which surfaces here as a {@link GoableApiError}. */
  healthReady(): Promise<HealthReadyResponse> {
    return this.request<HealthReadyResponse>("GET", "/v1/health/ready")
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

  /** L15 — skill-conditioned difficulty grids per scoring dimension (Pro+). */
  scoreDifficulty(input: ScoreDifficultyRequest): Promise<ScoreDifficultyResponse> {
    return this.request<ScoreDifficultyResponse>("POST", "/v1/score/difficulty", input)
  }

  /** Close the calibration loop: report the observed outcome of a scored
   *  session. Requires the `outcomes:write` scope. Pass `idempotencyKey` so a
   *  retry after a network timeout can't record the same outcome twice. */
  reportOutcome(
    sessionId: string,
    input: ReportOutcomeRequest,
    options?: IdempotencyOptions,
  ): Promise<ReportOutcomeResponse> {
    return this.request<ReportOutcomeResponse>(
      "POST",
      `/v1/score/${encodeURIComponent(sessionId)}/outcome`,
      input,
      idempotencyHeader(options),
    )
  }

  /** Report a standalone activity outcome not tied to a scored session — the
   *  operator-reported behavioural signal behind the calibration + research
   *  datasets. Responds 202. Requires the `outcomes:write` scope. For an
   *  outcome linked to a specific score, use {@link reportOutcome} instead. */
  submitOutcome(input: SubmitOutcomeRequest): Promise<SubmitOutcomeResponse> {
    return this.request<SubmitOutcomeResponse>("POST", "/v1/outcomes", input)
  }

  /** LLM edge-case narrative for a marginal score. */
  edgeCase(input: EdgeCaseRequest): Promise<EdgeCaseResponse> {
    return this.request<EdgeCaseResponse>("POST", "/v1/intelligence/edge-case", input)
  }

  /** T3 — multi-spot climate-decadal projections (Scale). */
  projectionsPortfolio(input: ProjectionsPortfolioRequest): Promise<ProjectionsPortfolioResponse> {
    return this.request<ProjectionsPortfolioResponse>("POST", "/v1/projections/portfolio", input)
  }

  /** T3 — adaptation report across months × scenarios × decades (Scale). */
  adaptationReport(input: AdaptationReportRequest): Promise<AdaptationReportResponse> {
    return this.request<AdaptationReportResponse>("POST", "/v1/projections/adaptation-report", input)
  }

  // ── underwriting policy lifecycle (Scale) ─────────────────────────────────
  /** Fetch a stored quote by id. */
  getQuote(id: string): Promise<QuoteByIdResponse> {
    return this.request<QuoteByIdResponse>("GET", `/v1/underwriting/quote/${encodeURIComponent(id)}`)
  }

  /**
   * Bind a recent quote into a policy. Responds 201. A watch-level drift event
   * on the resolved cell surfaces as `driftAdvisories` on success; a
   * warning/critical event refuses the bind with `422 DRIFT_ACTIVE`, thrown as
   * a {@link DriftActiveError}.
   */
  bindPolicy(input: BindPolicyRequest, options?: IdempotencyOptions): Promise<BindPolicyResponse> {
    return this.request<BindPolicyResponse>(
      "POST",
      "/v1/underwriting/policy/bind",
      input,
      idempotencyHeader(options),
    )
  }

  /** List the calling tenant's bound policies (paginated, boundAt DESC). */
  listPolicies(query?: ListPoliciesQuery): Promise<ListPoliciesResponse> {
    return this.request<ListPoliciesResponse>("GET", `/v1/underwriting/policy${toQuery(query)}`)
  }

  /** Fetch a single policy + its payout events. */
  getPolicy(policyId: string): Promise<PolicyResponse> {
    return this.request<PolicyResponse>("GET", `/v1/underwriting/policy/${encodeURIComponent(policyId)}`)
  }

  /** Re-evaluate a bound policy against the historical archive; inserts any
   *  newly detected payout events. No request body. */
  evaluatePolicy(policyId: string): Promise<EvaluatePolicyResponse> {
    return this.request<EvaluatePolicyResponse>(
      "POST",
      `/v1/underwriting/policy/${encodeURIComponent(policyId)}/evaluate`,
    )
  }

  /**
   * Settle a bound policy. PLATFORM-OPS ONLY — requires the `platform_admin`
   * scope (a cross-tenant underwriter operation, normally run by the daily
   * settlement cron). Not a policyholder self-service action; tenant
   * integrations should not call this.
   */
  settlePolicy(policyId: string, input: SettlePolicyRequest): Promise<SettlePolicyResponse> {
    return this.request<SettlePolicyResponse>(
      "POST",
      `/v1/underwriting/policy/${encodeURIComponent(policyId)}/settle`,
      input,
    )
  }

  // ── observations / nowcasting (L5.3) ──────────────────────────────────────
  /** Register a tenant observation station. Responds 201. */
  createStation(input: CreateStationRequest): Promise<CreateStationResponse> {
    return this.request<CreateStationResponse>("POST", "/v1/observations/stations", input)
  }

  /** List the calling tenant's observation stations. */
  listStations(): Promise<ListStationsResponse> {
    return this.request<ListStationsResponse>("GET", "/v1/observations/stations")
  }

  /** Patch a station (partial update). */
  updateStation(stationId: string, input: UpdateStationRequest): Promise<UpdateStationResponse> {
    return this.request<UpdateStationResponse>(
      "PATCH",
      `/v1/observations/stations/${encodeURIComponent(stationId)}`,
      input,
    )
  }

  /** Push station observations into the 0-6h assimilation window (Pro+).
   *  Responds 202. */
  submitObservations(input: SubmitObservationsRequest): Promise<SubmitObservationsResponse> {
    return this.request<SubmitObservationsResponse>("POST", "/v1/observations", input)
  }

  /** Most-recent observations for one of the tenant's stations. */
  recentObservations(
    stationId: string,
    query?: RecentObservationsQuery,
  ): Promise<RecentObservationsResponse> {
    return this.request<RecentObservationsResponse>(
      "GET",
      `/v1/observations/stations/${encodeURIComponent(stationId)}/recent${toQuery(query)}`,
    )
  }

  // ── public / research (no-auth surfaces) ──────────────────────────────────
  /** Public Goable Sustainability Index (JSON-LD, CC BY 4.0). */
  sustainabilityIndex(query: SustainabilityIndexQuery): Promise<SustainabilityIndexResponse> {
    return this.request<SustainabilityIndexResponse>(
      "GET",
      `/v1/public/sustainability-index${toQuery(query)}`,
    )
  }

  /** Public Stream F forecast-verification export. Returns the raw NDJSON
   *  stream as a string (one cell per line + a trailing meta line). */
  verificationExport(query?: VerificationExportQuery): Promise<string> {
    return this.requestText("GET", `/v1/research/verification/export${toQuery(query)}`)
  }

  /** Public L15 Difficulty Atlas export. Returns the raw NDJSON stream. */
  difficultyAtlasExport(): Promise<string> {
    return this.requestText("GET", "/v1/research/difficulty-atlas/export.jsonl")
  }

  /** Self-service tenant signup (no auth). Always 202 on success. */
  publicSignup(input: PublicSignupRequest): Promise<PublicSignupResponse> {
    return this.request<PublicSignupResponse>("POST", "/v1/public/signup", input)
  }

  /** Open catalogue coverage stats (no auth). */
  catalogStats(): Promise<CatalogStatsResponse> {
    return this.request<CatalogStatsResponse>("GET", "/v1/public/catalog-stats")
  }

  /** Fetch the current published legal document of a kind (no auth). */
  legalDocument(kind: LegalDocumentKind): Promise<LegalDocumentResponse> {
    return this.request<LegalDocumentResponse>(
      "GET",
      `/v1/legal/${encodeURIComponent(kind)}/current`,
    )
  }

  // ── audit / compliance ────────────────────────────────────────────────────
  /**
   * Export the calling tenant's own score + outcome audit history for a date
   * range. `format: "csv"` returns the raw CSV as a `string`; the default
   * (`"json"`) returns the parsed {@link AuditExportResponse}. Offset-paginated
   * via `limit` / `offset`.
   */
  auditExport(query: AuditExportQuery & { format: "csv" }): Promise<string>
  auditExport(query: AuditExportQuery & { format?: "json" }): Promise<AuditExportResponse>
  auditExport(query: AuditExportQuery): Promise<AuditExportResponse | string> {
    const path = `/v1/audit/export${toQuery(query)}`
    if (query.format === "csv") return this.requestText("GET", path)
    return this.request<AuditExportResponse>("GET", path)
  }

  // ── LLM BYOK (bring-your-own Anthropic key) ───────────────────────────────
  /** Set/rotate the tenant's Anthropic API key. The server validates it with
   *  one cheap Anthropic call, encrypts it at rest, and never echoes it back.
   *  Resolves `void` on the 204. */
  async setLlmKey(input: SetLlmKeyRequest): Promise<void> {
    await this.request<void>("PUT", "/v1/tenant/llm-key", input)
  }

  /** Get the tenant's Anthropic key status (masked — never the key itself). */
  getLlmKey(): Promise<LlmKeyStatus> {
    return this.request<LlmKeyStatus>("GET", "/v1/tenant/llm-key")
  }

  /** Remove the tenant's Anthropic key. Resolves `void` on the 204. */
  async deleteLlmKey(): Promise<void> {
    await this.request<void>("DELETE", "/v1/tenant/llm-key")
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
  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>,
  ): Promise<T> {
    const res = await this.rawRequest(method, path, body, extraHeaders)
    const parsed = await safeJson(res)
    if (!res.ok) throw toApiError(res.status, parsed, res.headers)
    return parsed as T
  }

  /** Like {@link request} but returns the raw response body as text — used for
   *  the NDJSON research streams and the `format=csv` audit export, which are
   *  not a single JSON document. */
  private async requestText(method: string, path: string): Promise<string> {
    const res = await this.rawRequest(method, path)
    let text: string
    try {
      text = await res.text()
    } catch (err) {
      throw new GoableNetworkError("Failed to read response body", "parse", err)
    }
    if (!res.ok) {
      let parsed: unknown = text
      try {
        parsed = JSON.parse(text)
      } catch {
        // non-JSON error body — pass the raw text through to toApiError
      }
      throw toApiError(res.status, parsed, res.headers)
    }
    return text
  }

  private async rawRequest(
    method: string,
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>,
  ): ReturnType<FetchLike> {
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
    if (extraHeaders) {
      for (const [k, v] of Object.entries(extraHeaders)) {
        if (v !== undefined) headers[k] = v
      }
    }

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

/** Serialise a query object into a leading-`?` string (or "" when empty).
 *  Skips undefined/null; isomorphic (URLSearchParams is a Node 18+/browser global). */
function toQuery(params?: Record<string, unknown>): string {
  if (!params) return ""
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) usp.append(k, String(v))
  }
  const s = usp.toString()
  return s ? `?${s}` : ""
}

/** Build the optional `Idempotency-Key` header bag from per-call options. */
function idempotencyHeader(options?: IdempotencyOptions): Record<string, string> | undefined {
  return options?.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : undefined
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
