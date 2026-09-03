# Syncing this fork with upstream

This is a fork of [prolincur/three-dxf-loader](https://github.com/prolincur/three-dxf-loader).
Upstream's default branch is **`main`**, not `master`.

## Last sync

| | |
|---|---|
| Upstream commit | `e3a33095b189651542252400c487a9aba7a64e02` |
| Upstream version | `5.5.0` |
| Synced on | 2026-09-03 |

The sync was done by resetting `src/` to upstream and replaying our patch on
top, so there is **no merge ancestry** to upstream. `git merge upstream/main`
will therefore re-conflict on everything already synced. Use the procedure
below and the recorded commit above instead.

## What this fork actually changes

Everything else is upstream's, unmodified. Keep it that way — the smaller this
list, the cheaper every sync.

- `src/loader/index.js`, ~60 lines:
  - **3D handling.** LWPOLYLINE vertices and polyface mesh vertices keep their
    Z. LWPOLYLINE carries a single `elevation` rather than a Z per vertex, so
    `getBulgeCurvePoints` takes a `defaultZ` to thread it through.
  - **Tessellation by arc length** rather than a fixed segment count, via
    `BULGE_SEGMENT_LENGTH`, `ARC_SEGMENT_LENGTH` and `ELLIPSE_SEGMENT_LENGTH`.
- TypeScript declarations (`src/**/*.d.ts`), `tsconfig.json`, `types-test/`.
  Upstream ships no types.
- `package.json`: `main`/`module`/`types` point at `src/` so the declarations
  resolve, where upstream points at `dist/`.
- biome in place of upstream's eslint/prettier, plus `.github/`.

## Why formatting config is load-bearing

The 5.5.0 sync cost 44 merge conflicts in `src/loader/index.js` alone, roughly
30 of them pure formatting noise, because biome had been left on its defaults
and had restyled every line of a file upstream also edits.

`biome.json` now mirrors upstream's `.prettierrc` (`semicolons: asNeeded`,
`lineWidth: 100`, `trailingCommas: es5`, single quotes) and is scoped so it
only touches code we own:

- `examples/` and `webpack.config.js` are upstream's — excluded outright.
- `src/**/*.js` is upstream's with our patch on top — the formatter runs, since
  we edit these files, but the linter and import sorting are off. Those rules
  rewrite roughly 80 sites into styles upstream doesn't use.
- Our own files keep the full recommended ruleset.

**Do not "fix" upstream's style in `src/`.** Every rule re-enabled there is
paid for again at the next sync.

## Procedure

```sh
git remote add upstream https://github.com/prolincur/three-dxf-loader.git   # once
git fetch upstream

# What changed upstream since our last sync?
git log --oneline <last-synced-sha>..upstream/main
git diff --stat <last-synced-sha>..upstream/main -- src/

git checkout -b sync/upstream-<version>

# 1. Take upstream's tree for everything we don't own.
git checkout upstream/main -- src README.md LICENSE webpack.config.js \
    examples pnpm-lock.yaml pnpm-workspace.yaml .nvmrc .gitignore

# 2. Our .d.ts files survive step 1 (checkout only overwrites paths upstream
#    has). Replay the ~60 lines listed above onto upstream's src/loader/index.js
#    -- read them off the previous sync commit, don't cherry-pick.
# 3. Hand-merge package.json: upstream's version and dependencies, our
#    main/module/types and scripts.
# 4. Re-check the type declarations against any new upstream API.

corepack pnpm install --no-frozen-lockfile
corepack pnpm biome:ci && corepack pnpm typecheck && corepack pnpm build
```

Then update the table at the top of this file.

## Verifying a sync

CI covers lint, types and build. It does **not** cover rendering, so check by
hand against a real drawing:

- a **3D** DXF and an LWPOLYLINE with non-zero `elevation` — the upstream
  sample (`examples/web/data/api-cw750-details.dxf`) is flat, so it exercises
  none of our Z handling;
- a drawing with **arcs at the scale you care about**. The segment lengths are
  in drawing units, so a drawing in mm hits the 6-segment floor on every arc
  while one in metres does not.
