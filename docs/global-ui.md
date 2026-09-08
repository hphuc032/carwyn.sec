# Phase 7 — Global UI

The server PageShell composes isolated interactive islands around server-rendered
page content. Pages retain their own single main landmark and main-content skip
target. The shell exposes an optional footer slot; no footer content or portfolio
sections are introduced. Homepages still show the two-line foundation message.

## Navigation and language

A compact fixed header supplies the brand, EN/VI links and Index trigger. The
shared full-screen index uses editorial rows on desktop and comfortable, wrapping
touch rows on mobile. A native dialog makes the background inert; explicit Tab
wrapping handles browser edge cases. Escape/Close restore focus to the trigger.
The previous body overflow style is restored on close and unmount.

The navigation order is distinct from future editorial section numbering:
01 identity, 02 expertise, 03 operations, 04 experience, 05 achievements,
06 log, 07 contact. These are stable IDs. Missing nodes leave their links visibly
and semantically unavailable with an explanatory note; activating them does not
change the URL. No filler sections exist. When available, section navigation closes
the menu, updates the hash, scrolls and focuses the destination. Future sections
should use their stable ID and tabindex=-1 on the semantic section container.

IntersectionObserver tracks sections in a reading band. A batched MutationObserver
discovers added/removed ID nodes without frame-by-frame scroll polling. Both
observers and scheduled callbacks disconnect on unmount. The status falls back to
00 / SYSTEM when no registered section occupies the reading band.

The URL is the locale source of truth. Shared UI strings live in i18n/global-ui.ts.
The publication registry currently recognizes only the homepage and development
specimen in both languages. Extend localizedPath with approved route equivalents
when publishing future content, including differing slugs where necessary.
Unknown equivalents display an unavailable state; no silent English fallback.
Normal language clicks use client navigation and preserve query parameters and
recognized section/DOM hashes. Browser modifier-click behavior remains native.
Brand, EN/VI codes, UTC+7 and optional decorative cursor words VIEW/OPEN/SCAN
intentionally stay unchanged; navigation, initialization and status copy are bilingual.

## Initialization and status

The first visit in a tab's browsing session receives a 1.2-second decorative panel:
INITIALIZING CARWYN.SEC, then INTERFACE READY (localized in Vietnamese). It is an
interface greeting, not a security check, simulated network request or progress bar.
It never blocks clicks, locks scroll, receives focus or hides main content from
assistive technology. A CSS deadline hides it even if timer cleanup fails.

The panel is hidden in server markup and without JavaScript. Session storage marks
the greeting as seen; a module-memory guard covers storage failures and client
navigation. Refresh and locale changes skip it. Reduced motion skips it entirely.
Strict Mode cleanup cancels the scheduled start before recording a session visit.

The static status bar means the interface is available, not that an external uptime
or security service has been checked. Desktop shows location and active index;
mobile shortens the online label and removes location. It is not a live region and
does not announce every section transition or pulse continuously.

## Cursor, motion and layers

The cursor is an optional decorative ring alongside the native pointer. Eligible
devices must report hover + fine pointer, and events must be mouse events. Touch,
reduced motion and forced colors hide it. Pointer movement uses a ref and one
requestAnimationFrame writer, never React state updates per movement. Generic
controls enlarge the ring. Future elements can opt into data-cursor="view",
"open" or "scan" without importing cursor logic. All labels are aria-hidden and
the overlay has pointer-events:none. Keyboard input and pointer exit hide it.

useReducedMotion uses a shared media-query subscription pattern with conservative
server defaults. OS reduced motion always wins; no additional user control was
needed for this phase. Menu entry uses the existing 350ms editorial CSS timing,
closes immediately, and becomes effectively static under reduced motion. There
are no GSAP timelines or GSAP imports: these simple transitions need only CSS.

Named layers: base 0, future WebGL 1, status 10, header 20, menu 30, cursor 40,
initialization 50, skip link 60, emergency 70. The native modal uses the browser
top layer above ordinary stacking contexts. No arbitrary high z-index overrides.

## Validation and reproduction

Run npm run lint, npm run type-check, npm run build. With development running,
npm run check:routes covers locales, private-asset URLs and the preview. Start the
production server with npm run start -- --port 3001, then run:

    npm run check:routes -- http://127.0.0.1:3001 --production

scripts/check-global-ui.mjs is a browser regression script using an existing
Playwright QA runtime and installed Microsoft Edge. No dependency was added to the
application. Set PLAYWRIGHT_MODULE_PATH to an existing Playwright package directory
if it is not resolvable locally, then run:

    node scripts/check-global-ui.mjs
    node scripts/check-global-ui.mjs http://127.0.0.1:3001 --production

Coverage: initial greeting/completion, refresh skip, locale changes without document
reload, query/hash preservation, locale changes from the modal, 375/430/768/1024/
1440/1920px in EN and VI, missing destinations, Escape, Tab wrapping, focus return,
skip link, live section discovery/removal, cursor contexts, reduced motion changes,
touch navigation, storage failures, console and hydration. The future-section
fixture exists only inside the test browser DOM and is removed during the test.
Development tests also verify the bilingual Design System preview route.

No Three.js, R3F, project media, portraits, CVs or MDX article content enters the
shell. Original assets remain unchanged, ignored and outside public/. The only
new public asset is a tiny monochrome SVG favicon. Phase 7 changes are uncommitted.

Phase 8 — Hero remains blocked on explicit approval, not on a technical issue.
