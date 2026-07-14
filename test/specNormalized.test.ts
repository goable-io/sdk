import { execFileSync } from "node:child_process"
import { copyFileSync, mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, test } from "vitest"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")

/**
 * Guard: the committed openapi.json must already be in canonical normalised
 * form (scripts/normalizeSpec.mjs is idempotent on it). The refresh-openapi
 * workflow runs the SAME normaliser on the freshly-fetched live contract, so if
 * the committed file were NOT normalised, the daily drift check would open a
 * cosmetic PR every run (version string / array formatting) even with no real
 * contract change. This test fails loudly if someone commits a non-normalised
 * spec, keeping the auto-sync quiet unless the contract truly moved.
 */
describe("committed openapi.json is normalised", () => {
  test("normalizeSpec is a no-op on the committed file", () => {
    const committed = readFileSync(resolve(root, "openapi.json"), "utf8")
    // Run the normaliser against a throwaway copy so the working tree is untouched.
    const dir = mkdtempSync(join(tmpdir(), "goable-spec-"))
    const copy = join(dir, "openapi.json")
    copyFileSync(resolve(root, "openapi.json"), copy)
    execFileSync("node", [resolve(root, "scripts/normalizeSpec.mjs"), copy], {
      stdio: "pipe",
    })
    const normalised = readFileSync(copy, "utf8")
    expect(normalised).toBe(committed)
  })
})
