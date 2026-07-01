# Contributing to @goable-io/sdk

This is the standalone client for the public [Goable](https://goable.io) API.
The scoring/physics engine is proprietary and lives elsewhere — this repo only
contains the typed HTTP client and the public API contract it targets.

## Local development

```bash
pnpm install          # or npm install
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest (includes the freshness guard)
pnpm build            # tsc → dist/
```

## How the types are generated

The request/response types are **not hand-written**. They are generated from
`openapi.json` (the Goable API contract) into `src/generated/api.ts`:

```bash
pnpm gen              # reads openapi.json → writes src/generated/api.ts
```

`src/types.ts` then derives friendly named aliases (`ScoreRequest`,
`ScoreResponse`, …) over that generated surface, and `src/client.ts` maps each
alias to an endpoint. A change to the contract flows outward automatically;
the **only** manual step is adding a brand-new endpoint (a new method on
`GoableClient` plus its aliases in `types.ts`).

### Freshness guard

`test/generatedFresh.test.ts` regenerates from the committed `openapi.json` and
asserts it matches the committed `src/generated/api.ts`. If you edit
`openapi.json` without running `pnpm gen`, or hand-edit the generated file, CI
fails. This keeps the generated types locked to the contract snapshot.

## Keeping the contract in sync

`openapi.json` is a **snapshot** of the live public API contract, served at
`https://api.goable.io/docs/openapi.json`. It is the single source of truth for
this SDK — the SDK targets the *deployed* public API, not any internal source.

Two mechanisms keep the snapshot current:

1. **Automated (preferred).** The
   [`refresh-openapi`](.github/workflows/refresh-openapi.yml) workflow runs on a
   daily schedule (and on-demand via *Actions → Refresh OpenAPI → Run
   workflow*). It fetches the live contract, runs `pnpm gen`, and — if anything
   changed — opens a pull request titled `chore: sync OpenAPI from live API`. A
   maintainer reviews the diff and merges; the merge triggers a release.

2. **Manual.** If you need to sync immediately:

   ```bash
   curl -sSf https://api.goable.io/docs/openapi.json \
     | python3 -m json.tool > openapi.json      # pretty-print, 2-space indent
   pnpm gen
   pnpm test
   ```

   Open a PR with both `openapi.json` and the regenerated `src/generated/api.ts`.

> **Why not generate straight from the API?** Because this repo is public and the
> API's contract builder is not. Fetching the already-public live spec keeps the
> SDK decoupled from any private source — no cross-repo tokens, no server-side
> internals in this repo.

## Releasing (maintainers)

Releases are automated by [`release.yml`](.github/workflows/release.yml) on push
to `main`. It typechecks, tests, builds, then resolves the version:

- **`package.json` version > npm latest** → publishes that exact version
  (planned major/minor bumps — edit `package.json` in your PR).
- **`package.json` version == npm latest** → auto-bumps the patch component
  (routine merges).
- **`package.json` version < npm latest** → fails loudly (someone forgot to
  bump).

It then runs `npm publish --provenance --access public` and tags the release.

### Required secret

`NPM_TOKEN` — an npm **automation** token for the `@goable-io` org with publish
rights, stored as a repository secret. Provenance additionally requires the
workflow's `id-token: write` permission (already set) and that the package is
built by GitHub Actions from this public repo.
