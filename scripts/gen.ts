/**
 * Regenerate the SDK's wire types from the committed OpenAPI contract.
 *
 *   pnpm gen
 *
 * Reads the committed openapi.json (the snapshot of the public Goable API
 * contract) and emits TypeScript via openapi-typescript into
 * src/generated/api.ts. This script does NOT touch openapi.json — that
 * file is refreshed from the live API by `.github/workflows/refresh-openapi.yml`
 * (see CONTRIBUTING.md → "Keeping the contract in sync").
 *
 * A CI freshness check (test/generatedFresh.test.ts) runs the same
 * generation and fails on any diff, so the committed types can never
 * silently drift from openapi.json.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import openapiTS, { astToString } from "openapi-typescript"

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(here, "..")

async function main(): Promise<void> {
  const specPath = resolve(pkgRoot, "openapi.json")
  const spec = JSON.parse(readFileSync(specPath, "utf8"))

  const ast = await openapiTS(spec as Parameters<typeof openapiTS>[0])
  const header =
    "/**\n" +
    " * GENERATED FILE — do not edit by hand.\n" +
    " * Source: openapi.json (the committed Goable API contract).\n" +
    " * Regenerate: pnpm gen\n" +
    " */\n\n"
  writeFileSync(
    resolve(pkgRoot, "src/generated/api.ts"),
    header + astToString(ast),
  )
  console.log("[sdk gen] wrote src/generated/api.ts from openapi.json")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
