import { describe, expect, test, vi } from "vitest"
import {
  DriftActiveError,
  type FetchLike,
  GoableApiError,
  GoableClient,
  GoableNetworkError,
} from "../src/index.js"

interface Call {
  url: string
  method?: string
  headers?: Record<string, string>
  body?: string
}

function mockFetch(
  responder: (call: Call) => {
    ok?: boolean
    status?: number
    body?: unknown
    headers?: Record<string, string>
    throws?: unknown
  },
): { fetch: FetchLike; calls: Call[] } {
  const calls: Call[] = []
  const fetch: FetchLike = async (url, init) => {
    const call: Call = { url, ...init } as Call
    calls.push(call)
    const r = responder(call)
    if (r.throws) throw r.throws
    const headers = r.headers ?? {}
    const bodyText = r.body === undefined ? "" : JSON.stringify(r.body)
    return {
      ok: r.ok ?? true,
      status: r.status ?? 200,
      headers: {
        get: (n: string) => headers[n] ?? headers[n.toLowerCase()] ?? null,
      },
      text: async () => (typeof r.body === "string" ? r.body : bodyText),
    }
  }
  return { fetch, calls }
}

const KEY = "test-api-key-0000000000000000000000000000"

describe("GoableClient construction", () => {
  test("requires an apiKey", () => {
    expect(() => new GoableClient({ apiKey: "" })).toThrow()
  })
  test("requires a fetch when no global fetch + none injected", () => {
    // global fetch exists in this runtime; assert the explicit-inject path works.
    const { fetch } = mockFetch(() => ({ body: { status: "ok" } }))
    expect(() => new GoableClient({ apiKey: KEY, fetch })).not.toThrow()
  })
})

describe("request building", () => {
  test("score sends POST with X-Goable-Key + JSON body to the right URL", async () => {
    const { fetch, calls } = mockFetch(() => ({
      body: {
        score: 82,
        verdict: "favorable",
        confidence: 0.7,
        breakdown: [],
        physics: {},
        alerts: [],
        eco: {},
      },
    }))
    const client = new GoableClient({
      apiKey: KEY,
      fetch,
      baseUrl: "https://api.example.com/",
    })
    const res = await client.score({
      activity: "kitesurfing",
      location: { lat: 43.7, lng: 7.27 },
    })

    expect(calls[0]!.url).toBe("https://api.example.com/v1/score")
    expect(calls[0]!.method).toBe("POST")
    expect(calls[0]!.headers!["X-Goable-Key"]).toBe(KEY)
    expect(calls[0]!.headers!.Authorization).toBeUndefined()
    expect(calls[0]!.headers!["Content-Type"]).toBe("application/json")
    expect(JSON.parse(calls[0]!.body!)).toEqual({
      activity: "kitesurfing",
      location: { lat: 43.7, lng: 7.27 },
    })
    expect(res.score).toBe(82)
    expect(res.verdict).toBe("favorable")
  })

  test("trailing slash on baseUrl is normalised", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: { status: "ok" } }))
    const client = new GoableClient({
      apiKey: KEY,
      fetch,
      baseUrl: "https://api.example.com///",
    })
    await client.health()
    expect(calls[0]!.url).toBe("https://api.example.com/v1/health")
  })

  test("GET (health) sends no Content-Type / body", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: { status: "ok" } }))
    await new GoableClient({ apiKey: KEY, fetch }).health()
    expect(calls[0]!.method).toBe("GET")
    expect(calls[0]!.body).toBeUndefined()
    expect(calls[0]!.headers!["Content-Type"]).toBeUndefined()
  })

  test("each method hits its documented path", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: {} }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    await c.scoreSeries({
      activity: "a",
      location: { lat: 0, lng: 0 },
      window: { from: "2026-01-01T00:00:00Z", to: "2026-01-01T06:00:00Z" },
    })
    await c.scoreMulti({ activities: ["a"], location: { lat: 0, lng: 0 } })
    await c.explainCounterfactual({
      activity: "a",
      spot: { lat: 0, lng: 0 },
      window: { from: "2026-01-01T00:00:00Z", to: "2026-01-01T06:00:00Z" },
    })
    await c.decision({
      user_pseudonym: "a".repeat(32),
      activity: "a",
      spot: { lat: 0, lng: 0 },
      window: { from: "2026-01-01T00:00:00Z", to: "2026-01-01T06:00:00Z" },
    })
    await c.quote({
      spot: { location: { lat: 0, lng: 0 }, activity: "a" },
      coverageWindow: { monthFrom: 6, dayFrom: 1, monthTo: 6, dayTo: 30 },
    })
    const paths = calls.map((c) => c.url.replace("https://x", ""))
    expect(paths).toEqual([
      "/v1/score/series",
      "/v1/score/multi",
      "/v1/score/explain-counterfactual",
      "/v1/decision",
      "/v1/underwriting/quote",
    ])
  })
})

describe("v0.4.0 surface — routing", () => {
  test("every new method hits its documented path + verb", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: {} }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })

    await c.scoreDifficulty({ activity: "a", location: { lat: 0, lng: 0 } })
    await c.reportOutcome("sess-1", { outcome_type: "ran" })
    await c.edgeCase({ activity: "a", location: { lat: 0, lng: 0 } })
    await c.projectionsPortfolio({
      spots: [{ location: { lat: 0, lng: 0 }, activity: "a" }],
      scenarios: ["SSP2-4.5"],
    })
    await c.adaptationReport({
      spots: [{ location: { lat: 0, lng: 0 }, activity: "a" }],
      scenarios: ["SSP2-4.5"],
    })
    await c.getQuote("q-1")
    await c.bindPolicy({ quoteId: "q-1", coverageYear: 2027, premiumCollection: "external" })
    await c.listPolicies()
    await c.getPolicy("pol-1")
    await c.evaluatePolicy("pol-1")
    await c.settlePolicy("pol-1", { settlementReference: "wire-9" })
    await c.createStation({ name: "n", point: { lat: 0, lng: 0 }, variables: ["wind_speed_kn"] })
    await c.listStations()
    await c.updateStation("st-1", { active: false })
    await c.submitObservations({
      stationId: "st-1",
      observations: [{ observedAt: "2026-07-01T00:00:00Z", variable: "wind_speed_kn", value: 12 }],
    })
    await c.recentObservations("st-1")
    await c.sustainabilityIndex({ from: "2026-01-01T00:00:00Z", to: "2026-04-01T00:00:00Z" })
    await c.publicSignup({ displayName: "Acme", contactEmail: "a@b.co", acceptTerms: true })
    await c.catalogStats()

    const seen = calls.map((k) => `${k.method} ${k.url.replace("https://x", "")}`)
    expect(seen).toEqual([
      "POST /v1/score/difficulty",
      "POST /v1/score/sess-1/outcome",
      "POST /v1/intelligence/edge-case",
      "POST /v1/projections/portfolio",
      "POST /v1/projections/adaptation-report",
      "GET /v1/underwriting/quote/q-1",
      "POST /v1/underwriting/policy/bind",
      "GET /v1/underwriting/policy",
      "GET /v1/underwriting/policy/pol-1",
      "POST /v1/underwriting/policy/pol-1/evaluate",
      "POST /v1/underwriting/policy/pol-1/settle",
      "POST /v1/observations/stations",
      "GET /v1/observations/stations",
      "PATCH /v1/observations/stations/st-1",
      "POST /v1/observations",
      "GET /v1/observations/stations/st-1/recent",
      "GET /v1/public/sustainability-index?from=2026-01-01T00%3A00%3A00Z&to=2026-04-01T00%3A00%3A00Z",
      "POST /v1/public/signup",
      "GET /v1/public/catalog-stats",
    ])
  })

  test("evaluatePolicy sends no body (bodyless POST)", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: {} }))
    await new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" }).evaluatePolicy("pol-1")
    expect(calls[0]!.method).toBe("POST")
    expect(calls[0]!.body).toBeUndefined()
    expect(calls[0]!.headers!["Content-Type"]).toBeUndefined()
  })

  test("query params are serialised + url-encoded", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: {} }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    await c.listPolicies({ status: "bound", coverageYear: 2027, limit: 10 })
    await c.recentObservations("st-1", { limit: 5 })
    expect(calls[0]!.url).toBe("https://x/v1/underwriting/policy?status=bound&coverageYear=2027&limit=10")
    expect(calls[1]!.url).toBe("https://x/v1/observations/stations/st-1/recent?limit=5")
  })

  test("201 / 202 responses return the parsed body", async () => {
    const { fetch } = mockFetch(() => ({ status: 202, body: { accepted: true } }))
    const res = await new GoableClient({ apiKey: KEY, fetch }).submitObservations({
      stationId: "st-1",
      observations: [{ observedAt: "2026-07-01T00:00:00Z", variable: "wind_speed_kn", value: 9 }],
    })
    expect(res).toEqual({ accepted: true })
  })
})

describe("v0.5.0 surface — routing", () => {
  test("every new method hits its documented path + verb", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: {} }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })

    await c.healthReady()
    await c.submitOutcome({
      occurred_at: "2026-07-01T00:00:00Z",
      activity_slug: "kitesurfing",
      outcome_type: "ran",
    })
    await c.legalDocument("terms_of_service")
    await c.getLlmKey()
    await c.setLlmKey({ apiKey: "sk-ant-xxxxxxxxxxxxxxxxxxxx" })
    await c.deleteLlmKey()

    const seen = calls.map((k) => `${k.method} ${k.url.replace("https://x", "")}`)
    expect(seen).toEqual([
      "GET /v1/health/ready",
      "POST /v1/outcomes",
      "GET /v1/legal/terms_of_service/current",
      "GET /v1/tenant/llm-key",
      "PUT /v1/tenant/llm-key",
      "DELETE /v1/tenant/llm-key",
    ])
  })

  test("legalDocument url-encodes the kind path segment", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: { document: {} } }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    await c.legalDocument("privacy_policy")
    expect(calls[0]!.url).toBe("https://x/v1/legal/privacy_policy/current")
  })

  test("setLlmKey sends the JSON body and resolves void on 204", async () => {
    const { fetch, calls } = mockFetch(() => ({ status: 204 }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    const out = await c.setLlmKey({ apiKey: "sk-ant-xxxxxxxxxxxxxxxxxxxx" })
    expect(calls[0]!.method).toBe("PUT")
    expect(calls[0]!.headers!["Content-Type"]).toBe("application/json")
    expect(JSON.parse(calls[0]!.body!)).toEqual({ apiKey: "sk-ant-xxxxxxxxxxxxxxxxxxxx" })
    expect(out).toBeUndefined()
  })

  test("deleteLlmKey sends bodyless DELETE and resolves void on 204", async () => {
    const { fetch, calls } = mockFetch(() => ({ status: 204 }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    const out = await c.deleteLlmKey()
    expect(calls[0]!.method).toBe("DELETE")
    expect(calls[0]!.body).toBeUndefined()
    expect(calls[0]!.headers!["Content-Type"]).toBeUndefined()
    expect(out).toBeUndefined()
  })

  test("getLlmKey returns the masked status body", async () => {
    const { fetch } = mockFetch(() => ({ body: { set: true, last4: "1234" } }))
    const res = await new GoableClient({ apiKey: KEY, fetch }).getLlmKey()
    expect(res).toEqual({ set: true, last4: "1234" })
  })
})

describe("v0.5.0 surface — audit export (CSV or JSON)", () => {
  test("format=json (default) returns the parsed JSON body", async () => {
    const { fetch, calls } = mockFetch(() => ({
      body: { rows: [{ id: "a" }], meta: { total: 1, limit: 100, offset: 0, window: {} } },
    }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    const res = await c.auditExport({
      from: "2026-01-01T00:00:00Z",
      to: "2026-02-01T00:00:00Z",
    })
    expect(calls[0]!.method).toBe("GET")
    expect(calls[0]!.url).toBe(
      "https://x/v1/audit/export?from=2026-01-01T00%3A00%3A00Z&to=2026-02-01T00%3A00%3A00Z",
    )
    expect(res.rows).toHaveLength(1)
    expect(res.meta.total).toBe(1)
  })

  test("format=csv returns the raw CSV string, no JSON.parse", async () => {
    const csv = "id,activity,score\nabc,kitesurfing,82\n"
    const { fetch, calls } = mockFetch(() => ({ body: csv }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    const out = await c.auditExport({
      from: "2026-01-01T00:00:00Z",
      to: "2026-02-01T00:00:00Z",
      format: "csv",
    })
    expect(calls[0]!.url).toBe(
      "https://x/v1/audit/export?from=2026-01-01T00%3A00%3A00Z&to=2026-02-01T00%3A00%3A00Z&format=csv",
    )
    expect(typeof out).toBe("string")
    expect(out).toBe(csv)
  })
})

describe("v0.5.0 surface — idempotency keys", () => {
  test("bindPolicy sends the Idempotency-Key header when provided", async () => {
    const { fetch, calls } = mockFetch(() => ({ status: 201, body: {} }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    await c.bindPolicy(
      { quoteId: "q-1", coverageYear: 2027, premiumCollection: "external" },
      { idempotencyKey: "idem-abc" },
    )
    expect(calls[0]!.headers!["Idempotency-Key"]).toBe("idem-abc")
  })

  test("bindPolicy omits the header when no key is given", async () => {
    const { fetch, calls } = mockFetch(() => ({ status: 201, body: {} }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    await c.bindPolicy({ quoteId: "q-1", coverageYear: 2027, premiumCollection: "external" })
    expect(calls[0]!.headers!["Idempotency-Key"]).toBeUndefined()
  })

  test("reportOutcome forwards the Idempotency-Key header", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: {} }))
    const c = new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" })
    await c.reportOutcome("sess-1", { outcome_type: "ran" }, { idempotencyKey: "idem-xyz" })
    expect(calls[0]!.url).toBe("https://x/v1/score/sess-1/outcome")
    expect(calls[0]!.headers!["Idempotency-Key"]).toBe("idem-xyz")
  })
})

describe("v0.5.0 surface — rate-limit headers on errors", () => {
  test("429 surfaces retryAfterSeconds + rateLimit on GoableApiError", async () => {
    const { fetch } = mockFetch(() => ({
      ok: false,
      status: 429,
      headers: {
        "Retry-After": "42",
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": "1799999999",
      },
      body: { error: "RATE_LIMITED", message: "Slow down" },
    }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .score({ activity: "a", location: { lat: 0, lng: 0 } })
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableApiError)
    expect(err.code).toBe("RATE_LIMITED")
    expect(err.retryAfterSeconds).toBe(42)
    expect(err.rateLimit).toEqual({ limit: 100, remaining: 0, reset: 1799999999 })
  })

  test("non-429 error without rate-limit headers leaves the fields null/undefined", async () => {
    const { fetch } = mockFetch(() => ({
      ok: false,
      status: 402,
      body: { error: "PAYMENT_REQUIRED" },
    }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .score({ activity: "a", location: { lat: 0, lng: 0 } })
      .catch((e) => e)
    expect(err.retryAfterSeconds).toBeNull()
    expect(err.rateLimit).toBeUndefined()
  })
})

describe("v0.4.0 surface — NDJSON research exports", () => {
  test("verificationExport returns the raw NDJSON string, no JSON.parse", async () => {
    const ndjson = '{"key":"a","brier":0.1}\n{"key":"b","brier":0.2}\n{"_type":"meta"}\n'
    const { fetch, calls } = mockFetch(() => ({ body: ndjson }))
    const out = await new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" }).verificationExport({
      from: "2026-01-01T00:00:00Z",
    })
    expect(calls[0]!.method).toBe("GET")
    expect(calls[0]!.url).toBe("https://x/v1/research/verification/export?from=2026-01-01T00%3A00%3A00Z")
    expect(typeof out).toBe("string")
    expect(out).toBe(ndjson)
  })

  test("difficultyAtlasExport streams from the .jsonl path", async () => {
    const { fetch, calls } = mockFetch(() => ({ body: '{"row":1}\n' }))
    const out = await new GoableClient({ apiKey: KEY, fetch, baseUrl: "https://x" }).difficultyAtlasExport()
    expect(calls[0]!.url).toBe("https://x/v1/research/difficulty-atlas/export.jsonl")
    expect(out).toBe('{"row":1}\n')
  })

  test("NDJSON export surfaces API errors as GoableApiError", async () => {
    const { fetch } = mockFetch(() => ({ ok: false, status: 503, body: { error: "SERVICE_UNAVAILABLE" } }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .difficultyAtlasExport()
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableApiError)
    expect(err.code).toBe("SERVICE_UNAVAILABLE")
  })
})

describe("bindPolicy drift handling", () => {
  test("422 DRIFT_ACTIVE → DriftActiveError with openDriftEvents", async () => {
    const { fetch } = mockFetch(() => ({
      ok: false,
      status: 422,
      body: {
        error: "DRIFT_ACTIVE",
        message: "Open drift event on resolved cell",
        detail: {
          openDriftEvents: [
            { activity: "kitesurfing", subSpotSlug: "tarifa-los-lances", severity: "warning" },
          ],
        },
      },
    }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .bindPolicy({ quoteId: "q-1", coverageYear: 2027, premiumCollection: "external" })
      .catch((e) => e)
    expect(err).toBeInstanceOf(DriftActiveError)
    expect(err).toBeInstanceOf(GoableApiError)
    expect(err.name).toBe("DriftActiveError")
    expect(err.code).toBe("DRIFT_ACTIVE")
    expect(err.openDriftEvents).toHaveLength(1)
    expect(err.openDriftEvents[0].subSpotSlug).toBe("tarifa-los-lances")
  })

  test("non-drift 422 stays a plain GoableApiError", async () => {
    const { fetch } = mockFetch(() => ({
      ok: false,
      status: 422,
      body: { error: "VALIDATION_ERROR", issues: [{ path: ["quoteId"], message: "Required" }] },
    }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .bindPolicy({ quoteId: "", coverageYear: 2027, premiumCollection: "external" })
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableApiError)
    expect(err).not.toBeInstanceOf(DriftActiveError)
    expect(err.code).toBe("VALIDATION_ERROR")
  })

  test("successful bind surfaces driftAdvisories when present", async () => {
    const { fetch } = mockFetch(() => ({
      status: 201,
      body: {
        policy: { id: "pol-1", status: "bound" },
        quoteId: "q-1",
        driftAdvisories: [
          { spotIndex: 0, activity: "kitesurfing", subSpotSlug: "x", severity: "watch", since: "2026-07-01T00:00:00Z" },
        ],
      },
    }))
    const res = await new GoableClient({ apiKey: KEY, fetch }).bindPolicy({
      quoteId: "q-1",
      coverageYear: 2027,
      premiumCollection: "external",
    })
    expect(res.driftAdvisories?.[0]?.severity).toBe("watch")
  })
})

describe("error mapping", () => {
  test("non-2xx → GoableApiError with code + detail", async () => {
    const { fetch } = mockFetch(() => ({
      ok: false,
      status: 402,
      body: {
        error: "PAYMENT_REQUIRED",
        message: "Upgrade plan",
        detail: { plan: "free" },
      },
    }))
    const client = new GoableClient({ apiKey: KEY, fetch })
    await expect(
      client.score({
        activity: "a",
        location: { lat: 0, lng: 0 },
        ensemble: true,
      }),
    ).rejects.toMatchObject({
      name: "GoableApiError",
      status: 402,
      code: "PAYMENT_REQUIRED",
    })
    const err = await client
      .score({ activity: "a", location: { lat: 0, lng: 0 }, ensemble: true })
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableApiError)
    expect(err.detail).toEqual({ plan: "free" })
  })

  test("422 surfaces issues", async () => {
    const { fetch } = mockFetch(() => ({
      ok: false,
      status: 422,
      body: {
        error: "VALIDATION_ERROR",
        issues: [{ path: ["activity"], message: "Required" }],
      },
    }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .score({ activity: "", location: { lat: 0, lng: 0 } })
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableApiError)
    expect(err.issues[0].message).toBe("Required")
  })

  test("malformed error body falls back to HTTP_<status> code", async () => {
    const { fetch } = mockFetch(() => ({
      ok: false,
      status: 500,
      body: "<html>oops</html>",
    }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .health()
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableApiError)
    expect(err.code).toBe("HTTP_500")
  })

  test("network failure → GoableNetworkError(network)", async () => {
    const { fetch } = mockFetch(() => ({ throws: new Error("ECONNREFUSED") }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .health()
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableNetworkError)
    expect(err.kind).toBe("network")
  })

  test("abort → GoableNetworkError(timeout)", async () => {
    const { fetch } = mockFetch(() => ({
      throws: Object.assign(new Error("aborted"), { name: "AbortError" }),
    }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .health()
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableNetworkError)
    expect(err.kind).toBe("timeout")
  })
})

describe("timeout", () => {
  test("aborts a slow request when timeoutMs elapses", async () => {
    vi.useFakeTimers()
    const fetch: FetchLike = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(Object.assign(new Error("aborted"), { name: "AbortError" }))
        })
      })
    const client = new GoableClient({ apiKey: KEY, fetch, timeoutMs: 1000 })
    const p = client.health().catch((e) => e)
    await vi.advanceTimersByTimeAsync(1000)
    const err = await p
    expect(err).toBeInstanceOf(GoableNetworkError)
    expect(err.kind).toBe("timeout")
    vi.useRealTimers()
  })
})

describe("deleteUserData", () => {
  test("returns parsed receipt headers from a 204", async () => {
    const { fetch, calls } = mockFetch(() => ({
      ok: true,
      status: 204,
      headers: {
        "X-Anonymized-Rows": "12",
        "X-Anonymized-Decision-Runs": "3",
        "X-Anonymized-Recommendation-Runs": "1",
        "X-Receipt": "rcpt_abc",
      },
    }))
    const result = await new GoableClient({
      apiKey: KEY,
      fetch,
    }).deleteUserData("pseudo/with space")
    expect(calls[0]!.method).toBe("DELETE")
    expect(calls[0]!.url).toContain(
      "/v1/decision/user-data/pseudo%2Fwith%20space",
    )
    expect(result).toEqual({
      status: 204,
      anonymizedRows: 12,
      anonymizedDecisionRuns: 3,
      anonymizedRecommendationRuns: 1,
      receipt: "rcpt_abc",
    })
  })

  test("missing headers → null fields", async () => {
    const { fetch } = mockFetch(() => ({ ok: true, status: 204 }))
    const result = await new GoableClient({
      apiKey: KEY,
      fetch,
    }).deleteUserData("p".repeat(32))
    expect(result.anonymizedRows).toBeNull()
    expect(result.receipt).toBeNull()
  })

  test("error status throws GoableApiError", async () => {
    const { fetch } = mockFetch(() => ({
      ok: false,
      status: 503,
      body: { error: "SERVICE_UNAVAILABLE" },
    }))
    const err = await new GoableClient({ apiKey: KEY, fetch })
      .deleteUserData("p".repeat(32))
      .catch((e) => e)
    expect(err).toBeInstanceOf(GoableApiError)
    expect(err.code).toBe("SERVICE_UNAVAILABLE")
  })
})
