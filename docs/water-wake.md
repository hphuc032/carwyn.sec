# Phase 18.5B — Water wake pointer revision

Review build: **http://127.0.0.1:3019/** and **http://127.0.0.1:3019/vi**.
Uncommitted; awaiting visual approval. Phase 19 has not started.

## Previous effect versus revised effect

The former two CSS radial fields followed one interpolated point. They have been
removed. The replacement retains the pointer's recent path and draws two soft,
uneven banks of disturbed light along it. The cursor leads; the recent curved
path remains behind, spreading and fading where it was disturbed. A stationary
cursor has no halo. A re-entry starts a new stroke instead of connecting across
an unobserved path through the header or a reading surface.

The effect is a **refraction/light-separation illusion**, not a fluid solver or
actual sampling/displacement of page pixels. It never distorts typography or
the Sphere. Canvas 2D produced path memory without a second WebGL scene, shader,
particle system, image asset or dependency.

## Rendering and trail model

- One preallocated ring buffer, maximum **30** samples: local x/y, monotonic time,
  normalized velocity. At most one sample per 25ms; movement below 2px is ignored.
- Piecewise quadratic interpolation preserves previous turns. At most 90 working
  vertices are kept in reusable typed arrays; no DOM nodes represent samples.
- Two asymmetrical ribbons separate slightly across the path normal. Older water
  widens and bends gently; both ends taper. Four low-alpha feather layers soften
  each bank, with adjacent same-color geometry batched into fewer drawing calls.
- Existing cyan/green are muted. Age desaturates the light and reduces opacity;
  there is no rainbow, glowing head, particle emission or uniform solid centerline.
- Coordinate geometry is cached when acquiring a surface/preview. RAF reads no
  layout, creates no DOM, and performs no React state updates.

Velocity is clamped at 1 after normalization around 1.1 CSS px/ms. It controls
width, energy and per-sample lifetime (roughly **600–1100ms**). The initial 20ms
remain invisible and the following 90ms introduce the disturbance behind the
leading point. At 150–300ms the banks spread visibly; older light becomes softer
and desaturated, then fully disappears. Sample age continues advancing when the
mouse stops. The original finite Hero/preview depth decay shares the same RAF.
After sample expiry, an absolute 1200ms idle cutoff prevents clamped depth easing
from retaining an empty canvas if the browser was busy. Normal depth parameters
and visible motion are unchanged; only a subpixel residual is resolved early in
that exceptional case.

Only one canvas can be active. It covers the visible slice of the current
section, capped at **1024×640 backing pixels** and effective DPR **≤1** (with
normal integer pixel rounding), rather than a full-page/high-DPR buffer. At rest
it returns to **1×1**, releases temporary inline styles and stops rendering.
The maximum raw RGBA backing-store estimate is 2.5 MiB; this is not a measurement
of the browser's total GPU allocation. Trail/working typed storage totals 4,920
bytes, plus a bounded palette and ordinary object overhead.

## Enabled surfaces and cursor relationship

Hero strength 1; Selected Operations 0.7; Terminal surrounding surface 0.45.
Contact, Identity, Expertise, Experience, Achievements and reading routes receive
no wake. Entering Terminal input/output or any native-control region clears it
immediately. Paragraphs/section exit allow the existing path to dissipate.

The precise custom cursor is unchanged. No new cursor states were introduced.
Hero depth, Operations tilt/focus response and Contact perspective remain
approved behavior. `ChapterMotion.tsx` is byte-for-byte unchanged from the
approved 18.5 version; no text intro or content change accompanies this revision.

## Devices, failure handling and lifecycle

Fine pointer + hover and an actual mouse event are required. No touchmove
listener, finger trail, wake instance or active canvas buffer is created on
touch. Reduced motion completely skips the effect; forced colors also disables
it. No-JavaScript receives inert, transparent 1×1 decorative canvases with all
semantic content visible. Canvas 2D failure leaves the page readable.

One wake/depth RAF at most. Hidden tabs, offscreen sections, resize, scroll,
blur, locale changes and unmount clear/release the canvas. Returning from hidden
waits for new pointer input. Mouse exit fades naturally; re-entry breaks the
stroke. Selection/dragging and the Terminal console take priority immediately.
Buffers/palette remain bounded; nothing is stored across browser sessions or
sent over the network.

## Files and scope

Application changes for this revision only:

- `src/lib/water-wake.ts` — bounded Canvas 2D path renderer.
- `src/components/home/PointerAtmosphere.tsx` — wake lifecycle; approved depth
  calculations retained.
- `src/components/motion/LiquidLight.tsx` — inert canvas replaces gradient spans.
- `src/styles/creative-interaction.css` — removes radial-field styling.

QA: new `scripts/check-water-wake.mjs`; adapts
`check-creative-interaction.mjs`, `check-motion.mjs`,
`check-hero-fallbacks.mjs`, and `measure-hero.mjs` to distinguish inert water
canvases from live WebGL. Existing fallback guarantees are preserved. The test
uses the already-installed TypeScript compiler for its bounded-storage check.

No dependency, content, locale, route, catalog, metadata, sitemap or CV change.
No staging/commit. The two unrelated root PNGs remain untracked.

## Final measurements and validation

| Metric | Approved 18.5 typography/depth + former CSS atmosphere | 18.5B |
| --- | ---: | ---: |
| Initial homepage JavaScript, gzip bytes | 153,266 | 154,533 |
| Interaction stylesheet, gzip bytes | 585 | 401 |
| Lazy Three/R3F chunk, gzip bytes | 232,419 | 232,419 |
| Lazy GSAP chunk, gzip bytes | 27,156 | 27,156 |
| Sampled desktop idle task time, ms/second | 1.337 | 1.617 |
| Sampled reduced-motion idle task time, ms/second | 1.063 | 1.364 |
| Maximum EN/VI layout shift | 0.001306 | 0.001306 |

Initial JavaScript increases by **1,267 gzip bytes (+0.83%)**. Byte counts use
the same local response/gzip method; idle values are short samples subject to
host noise. No new dependency, additional WebGL context, large image or font
request is introduced. Network Sphere budgets are unchanged.

Final 1440/1920 tests at device DPR 2 allocated only **982×640** and **1024×615**
water buffers respectively (effective CSS pixel ratios 0.741 and 0.711). Canvas
draw/geometry work had per-gesture p95 **0.7–1.7ms**. There were zero React commits,
zero ongoing layouts and no DOM growth during warmed gestures. One of 512
deliberately scheduled input intervals exceeded 25ms; this is not a measurement
of physical-display dropped frames. Earlier lower-load samples measured
0.4–1.2ms drawing, illustrating the hardware/load sensitivity.

A separate same-page A/B run alternated the wake on/off while leaving the custom
cursor active and pausing the Sphere. Across 120 RAF-paced events per sample,
mean main-thread task time was **105.3ms without** and **227.1ms with** the wake:
about **1.0ms additional work per event/frame**. RAF p95 was 7.2ms without and
7.3–7.4ms with it. This measures the new wake plus preserved Hero depth compared
with no atmosphere/depth, not the removed CSS implementation. Activation layouts
were included in this A/B run and separated from the warmed zero-layout check.

After 12 activation/release cycles, collected JS heap differed by **4.5–5.0KB**,
with buffer allocation bounded and stable. A 10,000-sample storage test retained
only 30 points in the original typed arrays. Once calm/hidden, the instrumented
canvas draw counter stopped; returning to a visible tab did not restart it until
new mouse input.

Validation passed:

- `npm run lint`, `npm run type-check`, `npm run build`.
- `npm run check:routes -- http://127.0.0.1:3019 --production`.
- `npm run check:localization -- http://127.0.0.1:3019`.
- All existing Global UI, Hero/fallback, Identity, Expertise, Operations,
  Experience, Achievements, Security Log, Terminal, Contact and Motion suites.
- Final `check-water-wake.mjs`: S-curves, circles, rapid zigzags/reversals,
  retained path versus endpoint chord, leading-point separation, calm, exit,
  re-entry without bridging, buffer bounds, memory, hidden/offscreen, EN→VI,
  reduced motion, hybrid touch and Canvas 2D failure fallback.
- Final `check-creative-interaction.mjs`: all six widths in both languages,
  unchanged text masks/depth, slow/fast pointer response, native selection/input,
  keyboard preview parity, route/locale changes, resize, touch, CLS and cleanup.
- Development Strict Mode motion lifecycle: repeated locale/case navigation
  retains listener counts and no stale arrival styles.

Published-route browser console/hydration checks are clean. No-JavaScript and
blocked-enhancement tests preserve readable content and inert water canvases.
Original/public CV hashes, catalogs, translations, metadata and route files are
unchanged. The final edge taper/idle cutoff were followed by fresh production
build, wake checks, full creative matrix, measurements and development lifecycle.

An existing routing diagnostic remains outside this revision: probing the
unpublished English `/log/not-published` URL returns the required **404**, while
Next prints an internal `NoFallbackError` on the server. Published routes and
browser checks do not emit that diagnostic. No routing code was changed to
silence it during this pointer-only pass.

## Human review

Implementation review answers:

1. **Recent trajectory visible after the cursor passes? Yes.** Historical sample
   coordinates stay in place as their width/opacity ages.
2. **Clearly behind rather than surrounding the cursor? Yes.** A delayed,
   tapered leading end and visible trailing banks establish head-to-tail order.
3. **Curved motion produces a curved dissipating wake? Yes.** S-curve raster checks
   distinguish the stored curve from a straight line between its endpoints.
4. **Returns to calm after stopping? Yes.** All samples expire, the canvas returns
   to 1×1, and its draw counter stops.

Live visual judgment is still required. Try slow S-curves in the dark space
below SYSTEMS., larger circles, a fast zigzag/reversal, then stop. Compare Hero
with Operations, enter Terminal output/input, leave the surface and re-enter.
The capture sequence in `test-results/water-wake/01-begin.png` through
`05-calm.png` records beginning, curved wake, cursor away, diffusion and calm.
Screenshots cannot establish timing or the subjective water quality on another
monitor. Physical GPU power and device-specific frame pacing remain unmeasured.
