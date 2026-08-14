/**
 * Universal safety-hazard subject slugs.
 *
 * `alerts[].subject` is an OPEN string, but the two UNIVERSAL safety gates
 * (lightning + air quality) carry STABLE, documentable subject slugs on both
 * their gate-trip alerts and their `SAFETY_DATA_UNAVAILABLE` advisories. The
 * OpenAPI `alerts[].subject` description points consumers at this exported set
 * as the known safety-subject vocabulary, so you can localise the universal
 * hazards from a fixed table.
 *
 * This is NOT an exhaustive `subject` enum: a PROFILE gate-trip alert's subject
 * is the tripped gate's metric (e.g. `"wind_speed_kn"`, drawn from the same
 * vocabulary as `dimensions[].metric` in `GET /v1/activities`). Treat these two
 * as the KNOWN safety subjects and keep a generic fallback for the rest.
 *
 * Mirrors the server's `SAFETY_HAZARD_SUBJECTS` (single source of truth),
 * including its order.
 */
export const SAFETY_HAZARD_SUBJECTS = ["air_quality", "lightning"] as const

/** A universal safety-hazard subject slug — see {@link SAFETY_HAZARD_SUBJECTS}. */
export type SafetyHazardSubject = (typeof SAFETY_HAZARD_SUBJECTS)[number]

/**
 * Narrow an `alerts[].subject` (an open string, possibly `undefined`) to one of
 * the known universal safety subjects. Returns `false` for profile-gate metric
 * subjects and for a missing subject.
 */
export function isSafetyHazardSubject(subject: string | undefined | null): subject is SafetyHazardSubject {
  return subject != null && (SAFETY_HAZARD_SUBJECTS as readonly string[]).includes(subject)
}
