import { describe, expect, test } from "vitest"
import {
  isSafetyHazardSubject,
  SAFETY_HAZARD_SUBJECTS,
  type SafetyHazardSubject,
} from "../src/index.js"
import type { ScoreResponse } from "../src/index.js"

describe("SAFETY_HAZARD_SUBJECTS", () => {
  test("mirrors the server's universal safety subjects, in order", () => {
    expect(SAFETY_HAZARD_SUBJECTS).toEqual(["air_quality", "lightning"])
  })

  test("isSafetyHazardSubject narrows known subjects and rejects the rest", () => {
    expect(isSafetyHazardSubject("lightning")).toBe(true)
    expect(isSafetyHazardSubject("air_quality")).toBe(true)
    // A profile gate-trip subject (a metric slug) is NOT a universal safety subject.
    expect(isSafetyHazardSubject("wind_speed_kn")).toBe(false)
    expect(isSafetyHazardSubject(undefined)).toBe(false)
    expect(isSafetyHazardSubject(null)).toBe(false)

    const s: string = "lightning"
    if (isSafetyHazardSubject(s)) {
      const narrowed: SafetyHazardSubject = s // compiles ⇒ narrowing works
      expect(narrowed).toBe("lightning")
    }
  })
})

describe("contract v0.6 sync — new response fields are surfaced on the types", () => {
  test("ScoreResponse carries the round 3-9 confidence/engine/coverage fields", () => {
    // Type-level assertions: these compile only if the regenerated types
    // expose the fields the contract sync added. `satisfies` keeps them
    // honest without needing a live call.
    const shape = {
      engine_version: "0.0.0",
      confidence_ceiling: 1,
      confidence_normalized: 1,
      dataCoverage: 1,
      scoreBasis: "gated",
      verdict: "unsafe",
    } satisfies Partial<ScoreResponse>
    expect(shape.scoreBasis).toBe("gated")
  })
})
