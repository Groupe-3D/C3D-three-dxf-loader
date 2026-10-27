# Syncing this fork with upstream

This is a fork of [prolincur/three-dxf-loader](https://github.com/prolincur/three-dxf-loader).
Both this fork and upstream use **`main`** as their default branch.

## Last sync

| | |
|---|---|
| Upstream commit | `299d400d1b15e46bc8f506145c5daea30cb1431a` |
| Upstream version | `5.6.0` |
| Synced on | 2026-10-27 |

Since 5.6.0, upstream is part of this branch's history (the 5.5.0 sync reset
files instead of merging, so git could not tell what was already in). A sync is
now an ordinary merge, and git only replays what upstream did since the commit
above.

## What this fork actually changes

Everything else is upstream's, unmodified. Keep it that way — the smaller this
list, the fewer conflicts each sync.

- `src/loader/index.js`, ~45 lines:
  - **Tessellation by arc length** rather than a fixed segment count, via
    `BULGE_SEGMENT_LENGTH`, `ARC_SEGMENT_LENGTH` and `ELLIPSE_SEGMENT_LENGTH`.
  - **`$DIMLFAC` does not scale the model** (#19). Only `$INSUNITS` sizes the
    geometry when unit conversion is on.
  - **`$INSUNITS` 21, US survey feet**, in `DXF_UNITS` and `getUnitToMeter`.
    Upstream stops at 20, which reads such a drawing as metres. Worth sending
    upstream, like the polyline Z fix, to drop it from this list.
  - One line (`data.units = {...}`) that biome wraps differently from prettier.
- TypeScript declarations (`src/**/*.d.ts`), `tsconfig.json`, `types-test/`.
  Upstream ships no types.
- `package.json`: `main`/`module`/`types` point at `src/` so the declarations
  resolve, where upstream points at `dist/`. Our scripts (biome, typecheck)
  replace upstream's eslint/prettier/release scripts.
- biome in place of upstream's eslint/prettier, plus `.github/`.
- Not taken from upstream: `Makefile` and the `commit-and-tag-version` release
  scripts. They publish upstream's npm package from `main`; we do neither.

The 3D handling this fork used to carry (LWPOLYLINE elevation, polyface Z) was
merged upstream as prolincur#40 and is no longer ours to maintain.

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

# Anything new upstream?
git log --oneline origin/main..upstream/main

git checkout -b sync/upstream-<version> origin/main
git merge upstream/main
```

Conflicts, if any, land on the files listed above. Resolve them as:

- `src/loader/index.js` — keep upstream's code and re-apply our lines from the
  list above on top.
- `package.json` — upstream's version and dependencies; our `main`/`module`/
  `types` and scripts.
- `pnpm-lock.yaml` — don't hand-merge it. Take either side, then let
  `pnpm install` regenerate it.
- Files upstream changed that we deleted (eslint/prettier config, `Makefile`)
  — keep them deleted: `git rm <file>`.

Then:

```sh
corepack pnpm install --no-frozen-lockfile
corepack pnpm biome:ci && corepack pnpm typecheck && corepack pnpm build
```

Check the type declarations against any new upstream API, update the table at
the top of this file, commit, and open a PR into `main`. Merge it with a
**merge commit**, not squash or rebase. Squashing drops upstream's commits from
the history, and the next sync would conflict on everything again.

## Verifying a sync

CI covers lint, types and build. It does **not** cover rendering, so check by
hand against a real drawing:

- a **3D** DXF and an LWPOLYLINE with non-zero `elevation` — the upstream
  sample (`examples/web/data/api-cw750-details.dxf`) is flat, so it exercises
  none of the Z handling;
- a drawing with **arcs at the scale you care about**. The segment lengths are
  in drawing units, so a drawing in mm hits the 6-segment floor on every arc
  while one in metres does not;
- a drawing with a `$DIMLFAC` other than 1 and unit conversion on — it should
  come in at the size `$INSUNITS` says, not scaled by `$DIMLFAC`.
