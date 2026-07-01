import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import openapiTS, { astToString } from "openapi-typescript"
import { describe, expect, test } from "vitest"

const here = dirname(fileURLToPath(import.meta.url))

/**
 * Freshness guard: the committed generated types MUST match what
 * openapi-typescript produces from the committed openapi.json. If someone
 * edited src/generated/api.ts by hand, or bumped openapi.json without
 * running `pnpm gen`, this fails — so the generated types can never
 * silently drift from the contract snapshot.
 *
 * Drift between openapi.json and the *live* API is a separate concern,
 * handled by .github/workflows/refresh-openapi.yml (which opens a PR when
 * the live contract moves). This test is offline and deterministic.
 */
describe("generated SDK types are fresh", () => {
  test("src/generated/api.ts matches openapi-typescript(openapi.json)", async () => {
    const spec = JSON.parse(
      readFileSync(resolve(here, "../openapi.json"), "utf8"),
    )
    const ast = await openapiTS(spec as Parameters<typeof openapiTS>[0])
    const expected = astToString(ast).trim()

    const committed = readFileSync(
      resolve(here, "../src/generated/api.ts"),
      "utf8",
    )
    // Strip the generated-file header comment block gen.ts prepends.
    const body = committed.replace(/^\/\*\*[\s\S]*?\*\/\n\n/, "").trim()

    expect(body).toBe(expected)
  })
})
