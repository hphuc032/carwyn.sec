# Phase 8 — Hero

Current motion behavior is superseded by [Phase 18 motion polish](motion-polish.md):
HeroMotion was removed; typography stays resolved and the static-to-live sphere
handoff now follows initialization. The original Phase 8 record below is historical.

Global UI checkpoint: f672c67, feat: establish carwyn.sec global interface.
Hero changes are uncommitted. Original portraits/CVs and unrelated root PNGs are
untouched. No Identity or later portfolio section was added.

## Composition and content

The server-rendered Hero is 01 / HERO. Its semantic heading is exactly
UNDERSTAND SYSTEMS. DEFEND THEM. on both locales, marked lang=en. Visual line
spans preserve the same order and are hidden from assistive technology in favor
of the heading's complete accessible name. The real name stays small; the only
supporting field is Information Security / An toàn thông tin, plus 2026.

The upper statement starts on the left; the lower statement is indented. A network
object occupies the intervening/right negative space, behind the typography.
Mobile places the smaller static object between the statements. Fluid sizing
accounts for screen height and the persistent header/status; no fixed text heights.
The scroll cue is explicitly unavailable until Identity exists, and does not
navigate to a missing target.

## Enhancement boundaries

Hero.tsx remains a Server Component. Its SVG is complete before client execution.
HeroMotion, HeroScrollCue and NetworkSphere are small isolated client boundaries.
No canvas or Three.js payload is server-rendered. next/dynamic with ssr:false
loads NetworkCanvas only after eligibility and visibility checks.

The shared initialization-state module hands the greeting's completion/skip state
to HeroMotion. The GSAP reveal never hides text completely, is scoped to the Hero,
and reverts on cleanup or reduced-motion change. Session and memory guards avoid
replaying the intro during locale changes and refreshes. A late/failed GSAP import
leaves the already-readable server design intact.

## Network model and rendering

- Seed 2026; 112 nodes and 156 local-neighbor edges, generated deterministically.
- Identical point positions and initial projection for SVG and live rendering.
- Neutral depth-weighted lines/nodes, with six green/blue accent nodes.
- Two short packets, at most two simultaneously, separated by long idle periods.
- Orthographic camera, no globe data, OrbitControls, textures, lights, bloom or assets.
- Two base draw calls (points and edges), plus up to two packet meshes.
- Desktop DPR capped at 1.5; existing typed buffers/geometries reused per frame.

The camera supplies explicit frustum dimensions. R3F sets its manual flag and
updates the projection matrix itself; pre-setting manual=true would skip that
initial update in this installed R3F version. Pixel-level tests guard against a
canvas that reports readiness but draws nothing.

Pointer influence is limited to small rotations. Demand rendering wakes at up to
30fps during pointer settling and short packet windows, then sleeps. Pause,
offscreen and hidden-document states use frameloop=never and cancel wake timers.
There are no per-frame React state updates or geometry allocations.

Desktop eligibility requires >=900px, fine pointer, hover, no reduced motion and
no save-data request. WebGL2 availability is checked before loading the bundle.
Mobile/touch uses the full-quality static SVG intentionally; mobile WebGL is not
needed for this composition. Reduced motion never loads GSAP or WebGL. A pause
control is available only for the enhanced visual and remains above text hit areas.

Context loss selects the static representation. Renderer disposal guards the
optional lose-context operation so an already-lost context is not lost twice.
Chunk failures also leave SVG visible. Static/live occupy the same reserved area.

## Dependency adjustment

No new direct dependency. Three.js and @types/three were aligned to 0.182.0, within
Fiber 9.7.0's >=0.156 peer range. Fiber still uses Clock; Three r183+ warns when it
is constructed. This pin removes that verified warning without masking console
output or patching vendor code. npm installation audit reported zero vulnerabilities.
Re-evaluate when Fiber adopts Timer. Relevant upstream sources:

- [R3F store and Clock use](https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/store.ts)
- [Three r182 Clock](https://github.com/mrdoob/three.js/blob/r182/src/core/Clock.js)
- [R3F demand rendering](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx)
- [GSAP context cleanup](https://gsap.com/docs/v3/GSAP/gsap.context()/)

## Measurements

Local production build, headless Microsoft Edge, 1440x1000, DPR 1. Gzip numbers
are computed from decoded bundle bodies and are estimates of compressed transfer.

| Payload | Raw | Gzip |
| --- | ---: | ---: |
| Hero client entry | 8,250 B | 3,308 B |
| Shared entry used by Hero | 18,609 B | 7,088 B |
| Deferred Three/R3F scene bundle | 875,257 B | 232,419 B |
| Deferred GSAP | 70,234 B | 27,156 B |

The shared entry is not solely Hero code. Reduced-motion requests contain neither
deferred bundle. Network readiness was about 896ms locally. The 636px CSS area
used a 635px drawing buffer due to rounding at DPR 1. Recorded load shift: 0.
Steady-idle renderer main-thread task time was about 1.4ms over one second; paused,
hidden and offscreen tests recorded no new draw calls after settling. Demand-mode
idle checks allow one pending two-draw frame after a state/resize change, not a
continuous loop. These are local CPU/draw-call observations, not physical GPU power
measurements or guarantees for every device/network.

## Verification and review

Required commands: npm run lint, npm run type-check, npm run build and
npm run check:routes. Production route check accepts the server URL followed by
--production and verifies that both Design System preview routes return 404.

Additional scripts use an existing Playwright runtime and installed Edge. Set
PLAYWRIGHT_MODULE_PATH to that package directory when needed; no Playwright package
was added to application dependencies.

    node scripts/check-hero.mjs http://127.0.0.1:3002
    node scripts/check-hero-fallbacks.mjs http://127.0.0.1:3002
    node scripts/measure-hero.mjs http://127.0.0.1:3002
    node scripts/check-global-ui.mjs http://127.0.0.1:3002 --production

Checks cover EN/VI at 375, 430, 768, 1024, 1440, 1920px, intact heading lines,
header clearance, actual network pixels, locale/canvas persistence, pause/idle,
offscreen and hidden-document events, context loss, reduced motion, touch,
no-WebGL, save-data, blocked GSAP/WebGL chunks, no JavaScript, console and hydration.
The visibility test simulates the document visibility event in headless Chromium.
Fault-injected network failures intentionally abort requests; normal runs require
a clean warning/error console. Sharp, already transitive through Next, only reads
test screenshot pixels; no portrait or web-asset preprocessing was performed.

Screenshots and performance.json are under ignored test-results/hero/. Desktop
1440 is the live network; mobile 430 is the intended static composition. A separate
desktop static screenshot is retained for fallback comparison.

Phase 9 — Identity requires explicit approval.
