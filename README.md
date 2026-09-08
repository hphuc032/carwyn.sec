# carwyn.sec — Phase 8 Hero

The global interface and Hero are implemented. Identity and all later portfolio
sections, case studies and Security Log articles await later phases.

## Reproduce locally

Use Node **24.14.0** and npm **11.9.0**. The dependency versions are exact in
`package.json`; `package-lock.json` locks the full dependency graph.

```sh
npm ci
npm run lint
npm run type-check
npm run build
npm run dev
```

Open `http://127.0.0.1:3000/` for English and `/vi` for Vietnamese.
`/en` redirects to `/`; unsupported paths such as `/fr` return 404.
With the server running, `npm run check:routes` verifies both locales,
canonical redirection, unknown routes, and non-public original assets.
The type-check command generates Next.js route types before `tsc --noEmit`, so
it works on a clean checkout before a production build. Lint runs separately
from the build. The approved foundation baseline is commit `5f391ae`.

Development specimens: `/dev/design-system` and `/vi/dev/design-system`.
These routes are excluded from production route discovery, not merely hidden.
After `npm run build`, run `npm run start -- --port 3001` and
`npm run check:routes -- http://127.0.0.1:3001 --production` to verify this boundary.
See [Design system](docs/design-system.md) for the reusable visual vocabulary.
See [Global UI](docs/global-ui.md) for navigation, localization, initialization,
cursor and motion behavior. The approved Design System checkpoint is `8007ce8`.
The approved Global UI checkpoint is `f672c67`. See [Hero](docs/hero.md) for
progressive enhancement, performance measurements and browser verification.

## Boundaries

- App Router pages and locale dictionaries render on the server.
- `src/proxy.ts` rewrites public English URLs to the shared internal locale tree.
  URL normalization is disabled so loopback host rewriting remains internal.
- `src/styles/tokens.css` centralizes the dark palette, spacing, typography,
  containers, motion references, and stacking layers.
- `src/types/content.ts` establishes content contracts without invented records.
- MDX compilation is configured, but no article or conceptual slug folder exists.
- Hero text and its SVG network are server-rendered. GSAP and React Three Fiber
  load only as eligible client enhancements; reduced motion uses the static design.
- Foundation metadata is intentionally `noindex`; canonical URLs and release SEO
  require the real production origin and approved public content.

## Compatibility decisions

Next.js 16.3.4 and React DOM 19.2.8 accept React 19.2.8. Fiber 9.7.0 requires
React/React DOM >=19 <19.3 and Three >=0.156. Phase 8 pins Three and its types to
0.182.0: Fiber 9.7.0 still constructs Clock, which emits deprecation warnings in
Three r183 onward. This is a verified runtime adjustment within the peer range,
not a forced peer resolution or console-warning filter.
Tailwind 4.3.3 uses matching `@tailwindcss/postcss` plus PostCSS 8.5.28.

The registry's latest TypeScript was 7.0.2, but the current typescript-eslint
8.69.0 peer range is >=4.8.4 <6.1.0. TypeScript 6.0.3 is deliberately selected.
ESLint 10.10.0 is outside eslint-plugin-react's supported range, so ESLint
9.39.5 is selected. npm marks ESLint 9 as end-of-support; this maintenance
limitation is retained explicitly until Next.js's React lint plugin supports
ESLint 10. No forced or legacy peer resolution is used.

npm 11.9.0 also reports six optional WebAssembly fallback packages as extraneous
on Windows, including sharp's WASM fallback. A clean offline `npm ci` reproduces
this bookkeeping result; the selected native packages and runtime imports work.
There are no invalid/missing peer dependencies. Do not add these fallback
packages as direct application dependencies to silence npm's tree output.

## Fonts and private assets

No licensed font binaries were present locally. Phase 6 uses `next/font/google`
for Be Vietnam Pro (400/500/600/700) and IBM Plex Mono (400/500), normal style,
with Latin and Vietnamese subsets. Next.js fetches official Google font assets
at build time and self-hosts them; browsers do not request Google font services.
Clean builds require access to Google's font endpoints. Metric-adjusted fallbacks,
preloading and `display: swap` limit loading shifts.

All originals in `picture/` and `CV/` are preserved, ignored by Git, and outside
the public asset tree. Portraits are 6000 x 4000; CA1A3265.JPG and CA1A3276.JPG
have EXIF orientation 8, and CA1A3266.JPG has orientation 1. Future derivatives
must bake orientation and remove GPS metadata without altering originals.

`CV IT Resume.pdf` is the selected candidate, pending content reconciliation.
No PDF or portrait has been copied into a public location.

No direct `sharp` dependency was added. No preprocessing is required in this
phase; the available Python/Pillow workflow can produce future web derivatives.
Next.js declares sharp itself, so it may appear as a transitive dependency.

## Deferred work

Phase 9 — Identity and later sections await explicit approval. The approved
English Hero tagline remains brand language on both locales; surrounding UI is
localized. Basic UI translations do not imply approval of full Vietnamese copy.

## Phase 5 verification

- Clean `npm ci` from the lockfile completed successfully.
- `npm run lint`, `npm run type-check`, and `npm run build` passed.
- `npm run check:routes` passed against development and production servers.
- English and Vietnamese were inspected in a browser; no console warnings,
  runtime errors, or hydration errors were observed on either valid route.
- Keyboard skip-link activation moves focus to the main content.
- All seven original portrait/PDF SHA-256 hashes match the pre-install audit.
- Installation audit reported zero vulnerabilities.
- Next.js generated `AGENTS.md` and `CLAUDE.md` on first development startup;
  these are framework guidance files, not portfolio content.
