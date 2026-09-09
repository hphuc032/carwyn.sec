# Phase 15 — Terminal

## Git checkpoint

`87c3070` — `feat: build carwyn.sec security log`. The checkpoint contains the
approved Phase 14 implementation. Two unrelated root PNGs were removed from Git
tracking during the checkpoint safety review and remain available locally.

## Command surface

The Terminal accepts exactly nine command tokens: `help`, `whoami`, `skills`,
`projects`, `experience`, `achievements`, `logs`, `contact`, and `clear`.
Command names remain English in both locales while output and interface labels are
localized. Unsupported input receives a concise command-not-found response.

`whoami`, `skills`, `projects`, `experience`, `achievements`, and `logs` are built
on the server from the existing profile and publication catalogs. The client
component receives only a small serializable command map; it does not maintain a
second factual catalog. Draft/review achievements cannot reach Terminal output.
The `contact` command derives its concise Email, GitHub, LinkedIn and CV output
from the same approved server-side catalog as Contact. Its action navigates to
the published `#contact` section without duplicating contact values in the client.

## Interaction and safety

The client island performs exact, case-insensitive token matching after trimming
input to 64 characters. It uses React text rendering, contains no HTML injection,
dynamic evaluation, shell, process, filesystem, or network API, and does not call
an external service. History and recall are session-local React state capped at
50 records. `clear` and input-focused `Ctrl+L` clear only that state.

Enter executes a command. ArrowUp and ArrowDown navigate submitted command
history. Paste uses the native input path. No global shortcut is registered. The
input is never focused automatically, retains focus after execution, and does not
trap keyboard users.

Project, section and Security Log links use established locale-aware routes.
Navigation is always user-initiated; printing a command does not pull the visitor
away from Terminal. The primary site Index remains unchanged because Terminal was
not part of its approved seven-item navigation.

## Visual and accessibility system

08 / TERMINAL follows the light Security Log with a near-black editorial field.
The bordered console occupies part of the wide grid instead of taking over the
whole page. Green is limited to the prompt, while blue marks actionable links.
There are no fake scans, glitches, delayed output, typing effects or decorative
cursor blinking.

The output history has a keyboard focus state, the command input has a labelled
focus rail, and a short polite live region announces only the latest result. The
decorative global cursor defers throughout the console so the native text cursor
remains available. Reduced motion removes the only link-color transition.

Without JavaScript, the inert console is hidden and a server-rendered fallback
shows the command inventory and availability message. Published portfolio content
above Terminal remains unaffected.

## Validation scope

`scripts/check-terminal.mjs` covers EN/VI at 375, 430, 768, 1024, 1440 and 1920;
all supported and unsupported commands; input focus; history recall and bounds;
paste; `Ctrl+L`; touch; reduced motion; no-JavaScript output; locale/hash and route
navigation; contextual-cursor deferral; console/hydration; layout shift; and a
static source-safety assertion.

The local 1440 production measurement reports 408,223 encoded homepage script
bytes and 136,491 encoded stylesheet/link bytes. Relative to the approved Phase
14 measurement, Terminal adds approximately 1,135 encoded script bytes and 840
encoded style bytes. Measured Terminal layout shift is 0. Hosting compression and
cache state may change transfer figures.

The complete Phase 7–14 browser regression suite remains clean. Phase 15 is left
uncommitted for visual and functional approval.
