# CLAUDE.md — `@goable-io/sdk`

Public TypeScript client for the Goable API. Types are **generated** from the
committed `openapi.json` (the API contract); only a handful of wrappers are
hand-written.

## Release / branch convention (IMPORTANT)

Each change gets its OWN new branch, named for the WORK it does — **never for a
release version** (the version is decided at merge/publish time and is unknown
when the branch opens). Use a Conventional-Commits-style type prefix + a short
topic:

**`<type>/<topic>`** — `type` ∈ `feature` | `fix` | `chore` (| `docs` | `refactor`),
e.g. `feature/contract-v0.6-sync`, `fix/rate-limit-headers`, `chore/deps-bump`.

- Do **NOT** put a presumed release version (`v0.13`) in the branch name. A topic
  MAY reference the CONTRACT version being synced (known at branch time), e.g.
  `contract-v0.6-sync`.
- Do **NOT** reuse a generic or session-assigned branch name.
- One PR per change, base `main`; delete the branch after merge.
- Bump `package.json` `version` + add a dated `CHANGELOG.md` section in the SAME PR.

## Contract-sync workflow

The SDK mirrors the live API contract. To sync to a new contract version:

1. Refresh `openapi.json` from the API (the `.github/workflows/refresh-openapi.yml`
   job does this daily; to do it by hand, copy the API's generated
   `apps/api/openapi.json`), then normalize: `node scripts/normalizeSpec.mjs openapi.json`.
2. Regenerate wire types: `pnpm gen` (writes `src/generated/api.ts` — never edit by hand).
3. `src/types.ts` is **fully derived** from the generated types (thin `paths[...]`
   aliases) — new response fields flow through automatically; touch it only for a
   genuinely new endpoint (a new client method in `src/client.ts`).
4. Hand-written first-class surface lives in `src/` (`client.ts`, `errors.ts`,
   `safety.ts`, `index.ts`). Add exports here only when the contract promises a
   named SDK symbol (e.g. `SAFETY_HAZARD_SUBJECTS`).
5. Bump version + CHANGELOG; run `pnpm typecheck && pnpm test && pnpm build`.
   Tests include freshness guards (`generatedFresh`, `specNormalized`) that fail
   if the committed types or spec drift.
