# CLAUDE.md — `@goable-io/sdk`

Public TypeScript client for the Goable API. Types are **generated** from the
committed `openapi.json` (the API contract); only a handful of wrappers are
hand-written.

## Release / branch convention (IMPORTANT)

**Every new release gets its OWN new branch, named for what it does** —
`claude/sdk-v<version>-<short-topic>`, e.g. `claude/sdk-v0.13-contract-v0.6-sync`,
`claude/sdk-v0.12-alert-subject`, `claude/sdk-v0.11-contract-sync`.

- Do **NOT** reuse a session-assigned or generic branch name (e.g.
  `claude/goable-sdk-v0.5-complete-*`) — the name must match the release.
- One PR per release, base `main`. Delete the branch after merge.
- Bump `package.json` `version` + add a dated `CHANGELOG.md` section for the
  same version in the SAME PR.

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

## Sibling repo

The **Python SDK** (`goable-io/python-sdk`, PyPI `goable-sdk`) mirrors this client
1:1 (snake_case). Keep the two in lockstep — a contract sync here usually needs
the same sync there.
