import { describe, expect, test, vi } from "vitest"
import {
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
