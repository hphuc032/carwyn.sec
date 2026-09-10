# Phase 20 — Accessibility QA

Date: 2026-09-10  
Target: WCAG 2.2 AA engineering review  
Status: web-interface findings corrected; no formal accessibility certification claimed

## Scope

The audit covered the English and Vietnamese homepage, all three localized case studies, the Security Log index and article, global navigation, language controls, Hero, Identity, Expertise, Operations, Experience, Achievements, Terminal, Contact, CV link, footer, and 404/unpublished routes.

## Method

- Source review of landmarks, headings, native controls, ARIA, focus handling, reduced-motion branches, and decorative visual layers.
- Chromium/Edge accessibility-tree inspection through the browser UI and Playwright `ariaSnapshot()` captures.
- Automated browser checks across all 12 published routes for one H1, heading order, names, duplicate IDs, image alternatives, decorative canvases, table caption/header scope, and page overflow.
- Keyboard-only flows using Tab, Shift+Tab, Enter, Space, Escape, Terminal history arrows, and Ctrl+L.
- Programmatic contrast calculation against rendered backgrounds using WCAG relative luminance thresholds.
- Reflow checks at 320 CSS pixels and a 200%-zoom-equivalent 320 CSS pixel viewport at device scale factor 2.
- Reduced-motion, touch, no-JavaScript, localized 404, and unpublished-route checks.

No native screen reader application was used. This report does not claim testing with NVDA, JAWS, VoiceOver, or TalkBack. The public PDF link was checked, but the PDF document itself was not audited for PDF/UA or tagged-PDF accessibility.

## Corrected findings

### Moderate

1. Small metadata contrast on light sections was below 4.5:1.
   - Experience changed from `#59635d` (4.33:1) to `#535c56` (4.81:1) on `#d5d8d2`.
   - Security Log changed from `#62706b` (4.08:1) to `#586660` (4.74:1) on `#e2e5e0`.
   - Contact changed from `#65716c` (3.72:1) to `#56615c` (4.72:1) on `#d9ded8`.
2. Operations links used `aria-label`, which replaced the visible category and summary in the accessible name. The links now expose purpose, case identity, category, and summary through their real text content.
3. Unmatched and unpublished routes used the framework fallback without document language or a recovery link. Localized EN/VI 404 documents now return HTTP 404, use the correct `lang`, provide unique not-found metadata, and include a route back to the localized homepage.

### Minor

1. Back to Top scrolled visually but left keyboard focus on the footer link. It now moves focus to the main content while retaining a native `#hero` fallback and respecting reduced motion.
2. Portrait alternative text included clothing details that did not help identify the image's purpose. It now gives a concise, localized portrait description.

## Verified behavior

- The skip link is the first useful focus target and moves focus to `main-content` in both locales.
- The navigation dialog exposes its name, expanded state, native modal state, bounded focus order, Escape behavior, and focus return.
- Language links expose English and Vietnamese names, with the current locale marked using `aria-current="page"`.
- Active navigation uses `aria-current="location"`; the fixed system-status display remains non-interactive text.
- The Network Sphere, water-wake canvas, static network artwork, project artwork, and contextual cursor do not add accessibility-tree noise or intercept input.
- Identity portrait alt text is localized. Capability, experience, and achievement records retain meaningful linear reading order.
- Achievement states, including CEH In Progress, are present as text and do not rely on color.
- Security Log tables use a caption and scoped column headers. Code blocks and tables retain local horizontal scrolling without page overflow.
- Terminal uses a real labeled input, bounded history, a concise polite announcement region, focus retention after commands, and an ordinary path out of the input.
- Contact and CV use native anchors with visible text; new-tab destinations include localized assistive text.
- Reduced motion yields static readable content, the static Sphere, an inert wake canvas, immediate navigation, and no contextual cursor.
- Core portfolio content remains readable without JavaScript.

## Severity at completion

- Critical: none found.
- Major: none found.
- Moderate: three corrected; none open in the audited web interface.
- Minor: two corrected; none open in the audited web interface.

## Coverage limits and remaining risk

- The public CV PDF is **not audited** for document tagging, reading order, bookmarks, or PDF/UA conformance.
- Browser accessibility trees and automated keyboard checks supplement, but do not replace, validation with native assistive-technology users.
- `global-not-found` is an experimental Next.js 16 feature. It is used because the app has a top-level dynamic locale layout, which is the documented use case; route and build tests cover the current version.
