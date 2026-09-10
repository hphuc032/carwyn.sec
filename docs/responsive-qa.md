# Phase 19 — Responsive QA

## Scope

This pass reviews the approved site without changing its content, routes, visual direction, motion language, project data, Security Log claims, or public CV. The browser matrix covers every published English and Vietnamese route at 375, 430, 768, 1024, 1440, and 1920 CSS pixels.

## Corrections

- The Hero display-size floor now yields to the viewport on narrow screens when the user increases the root text size. The normal 375/430 composition is unchanged.
- The Identity name keeps `HOANG PHUC` readable as two words without expanding the mobile grid under increased text sizing.
- Operations grid content can shrink below its min-content width; exceptionally long titles wrap instead of widening the document. Touch-only pointers do not receive a hover-dependent preview.
- The fixed mobile header uses a tighter control gap and menu padding so brand, locale control, and Index remain available under increased text sizing.
- The Terminal input preserves a minimum 44px input target on coarse pointers at tablet widths as well as phone widths.
- The Contact statement scales against the usable mobile gutter. Contact actions move below their values on mobile, leaving email, LinkedIn, and CV labels a readable measure.

## Automated matrix

`scripts/check-responsive.mjs` verifies:

- 12 published route/locale combinations across six target widths (72 route/viewport combinations)
- document and clipped-text overflow
- 44px interactive targets
- Hero height, portrait aspect ratio, project-preview/title overlap, and touch canvas gates
- locally scrollable article tables and code blocks without page overflow
- 375×667, 430×740, and 1440×800 constrained-height navigation
- 768×1024, 1024×768, 430×932, and 932×430 resize/orientation transitions
- 125% and 150% root text-size stress at 375, 768, and 1024
- touch Terminal focus and inert decorative canvases
- server-rendered/no-JavaScript reading at phone and tablet widths
- browser console and hydration output

Focused visual captures are written to `test-results/responsive/` and stay outside the repository.

## Regression result

The existing section, localization, route, motion, creative-interaction, and water-wake suites remain authoritative for behavior outside responsive geometry. Phase 19 adds no dependency and no new runtime JavaScript.

