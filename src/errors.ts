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
  // Typed `string` (not the literal) so subclasses like DriftActiveError can
  // override it with their own name.
  override readonly name: string = "GoableApiError"
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

/**
 * Raised on a `422 DRIFT_ACTIVE` from `POST /v1/underwriting/policy/bind`:
 * the resolved cell has an open warning/critical L9 drift event, so the bind
 * is refused (a watch-level event is a soft `driftAdvisories` on success, not
 * an error). Subclasses `GoableApiError`, so existing `instanceof
 * GoableApiError` / `.code === "DRIFT_ACTIVE"` checks keep working.
 */
export class DriftActiveError extends GoableApiError {
  override readonly name = "DriftActiveError"
  /** The blocking cells, from the server's `detail.openDriftEvents`. Shape is
   *  per-cell and best-effort (documented, not part of the typed contract). */
  readonly openDriftEvents: Array<Record<string, unknown>>

  constructor(
    status: number,
    code: string,
    message?: string,
    extra?: { issues?: ZodIssueLike[]; detail?: Record<string, unknown> },
  ) {
    super(status, code, message, extra)
    const raw = extra?.detail?.openDriftEvents
    this.openDriftEvents = Array.isArray(raw) ? (raw as Array<Record<string, unknown>>) : []
    Object.setPrototypeOf(this, DriftActiveError.prototype)
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
  // Specialise the one error the SDK models with its own class. Stays a
  // GoableApiError subclass, so generic catch sites are unaffected.
  if (code === "DRIFT_ACTIVE") return new DriftActiveError(status, code, message, extra)
  return new GoableApiError(status, code, message, extra)
}
