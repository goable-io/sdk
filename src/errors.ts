/**
 * SDK error model. Two distinct failure modes:
 *   - GoableApiError    : the API returned a non-2xx response. Maps the
 *                         canonical flat error envelope
 *                         ({ error, message?, issues?, detail? }).
 *   - GoableNetworkError: the request never produced an HTTP response
 *                         (DNS, connection, abort/timeout, JSON parse).
 */

export interface ZodIssueLike {
  code?: string
  path?: Array<string | number>
  message?: string
  [k: string]: unknown
}

export class GoableApiError extends Error {
  override readonly name = "GoableApiError"
  /** HTTP status code. */
  readonly status: number
  /** Machine-readable code from the `error` field (e.g. "PAYMENT_REQUIRED"). */
  readonly code: string
  /** Zod validation issues, present on 422 VALIDATION_ERROR responses. */
  readonly issues?: ZodIssueLike[]
  /** Free-form extra context (e.g. plan info, quote id). */
  readonly detail?: Record<string, unknown>

  constructor(
    status: number,
    code: string,
    message?: string,
    extra?: { issues?: ZodIssueLike[]; detail?: Record<string, unknown> },
  ) {
    super(message ?? code)
    this.status = status
    this.code = code
    if (extra?.issues) this.issues = extra.issues
    if (extra?.detail) this.detail = extra.detail
    // Restore prototype chain for `instanceof` across transpilation targets.
    Object.setPrototypeOf(this, GoableApiError.prototype)
  }
}

export class GoableNetworkError extends Error {
  override readonly name = "GoableNetworkError"
  /** "timeout" when the request was aborted by the configured timeout. */
  readonly kind: "timeout" | "network" | "parse"
  override readonly cause?: unknown

  constructor(message: string, kind: "timeout" | "network" | "parse", cause?: unknown) {
    super(message)
    this.kind = kind
    if (cause !== undefined) this.cause = cause
    Object.setPrototypeOf(this, GoableNetworkError.prototype)
  }
}

interface RawErrorBody {
  error?: unknown
  message?: unknown
  issues?: unknown
  detail?: unknown
}

/** Map a parsed error body + status into a GoableApiError. Tolerant of a
 *  non-conforming body (falls back to the status code as the error code). */
export function toApiError(status: number, body: unknown): GoableApiError {
  const b = (body ?? {}) as RawErrorBody
  const code = typeof b.error === "string" ? b.error : `HTTP_${status}`
  const message = typeof b.message === "string" ? b.message : undefined
  const extra: { issues?: ZodIssueLike[]; detail?: Record<string, unknown> } = {}
  if (Array.isArray(b.issues)) extra.issues = b.issues as ZodIssueLike[]
  if (b.detail && typeof b.detail === "object") extra.detail = b.detail as Record<string, unknown>
  return new GoableApiError(status, code, message, extra)
}
