# carwyn.sec — Phase 5 foundation

This is the technical foundation, not the final portfolio. No visual sections,
case studies, Security Log articles, animations, or WebGL scene are implemented.

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
from the build. No Git commit has been requested.

## Boundaries

- App Router pages and locale dictionaries render on the server.
- `src/proxy.ts` rewrites public English URLs to the shared internal locale tree.
  URL normalization is disabled so loopback host rewriting remains internal.
- `src/styles/tokens.css` centralizes the dark palette, spacing, typography,
  containers, motion references, and stacking layers.
- `src/types/content.ts` establishes content contracts without invented records.
- MDX compilation is configured, but no article or conceptual slug folder exists.
- GSAP and React Three Fiber are installed for later phases, not loaded on the page.
- Foundation metadata is intentionally `noindex`; canonical URLs and release SEO
  require the real production origin and approved public content.

## Compatibility decisions

Next.js 16.3.4 and React DOM 19.2.8 accept React 19.2.8. Fiber 9.7.0 requires
React/React DOM >=19 <19.3 and Three >=0.156; Three 0.185.1 satisfies this.
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

No licensed font binaries were present locally. The site uses temporary Arial
and Consolas system stacks. Be Vietnam Pro and IBM Plex Mono remain the approved
final families; configure `next/font/local` only after obtaining verified licensed
WOFF2 assets with Vietnamese coverage. Builds do not fetch fonts from the network.

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

Phase 6 and all portfolio sections await explicit approval. Do not interpret
the two-line foundation page as the final Hero or the minimal UI translation
as approved Vietnamese portfolio copy.

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
