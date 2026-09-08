# Phase 6 — reusable visual foundation

Scope: tokens and composable primitives only. No portfolio sections, navigation,
cursor, GSAP timelines, or WebGL visuals were included in Phase 6. The approved
Design System was checkpointed as `8007ce8` before Phase 7 began.

## Typography and layout

Be Vietnam Pro supplies editorial/body text at 400/500/600/700. IBM Plex Mono
supplies technical labels at 400/500. Both use next/font/google with Vietnamese
and Latin coverage. Font files are self-hosted in Next static assets. Builds need
network access to the official Google endpoints; no manually sourced binaries.

Fluid Tailwind sizes: display-xl, display-lg, heading-1/2/3, body-lg, body,
body-sm, metadata, mono-label. Editorial headings use 600 and generous line height
for diacritics. Select the heading tag for document hierarchy independently of size.
Never put long Vietnamese prose in uppercase or fixed-height text boxes.

Spacing tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96, 144 and 192px. Fluid page
gutters range from 24–72px. Section and transition spacing are separate fluid
tokens. Containers cap at 1280px (content), 1440px (wide), 704px (reading).
EditorialGrid uses 4 columns, 8 from 768px, and 12 from 1024px. Children own
their spans. FullBleed belongs outside Container; nest a Container to align text.

## Color and interaction

The approved near-black, off-white, green, blue and red remain unchanged.
Raised/hover surfaces are neutral. Muted text is #B6BDC3; subtle text #88939B.
Decorative borders use #30383F; control boundaries #74818B. Amber #E5BE76 is
reserved for warning states. Use color with a visible label, never alone.

Contrast measured against all four background/surface tokens: primary 14.75:1
minimum, muted 8.47:1, subtle 5.13:1, alert 4.62:1; control border 4.02:1.
Decorative dividers intentionally have lower contrast and must not identify controls.

Links use underlines and restrained color feedback; navigation/editorial variants
have 44px minimum height. Arrows are opt-in. External new-tab links require a
localized announcement and set noopener/noreferrer. Buttons are native actions,
outline or solid, with visible keyboard focus and native disabled behavior.
No gradients, glow, large shadows or default transforms.

## Primitives

- Container / FullBleed / EditorialGrid: reusable width, alignment and columns.
- EditorialHeading: semantic heading with independently chosen visual scale.
- SectionLabel: numbered monospace section title with wrapping.
- SystemLabel: compact technical label.
- Metadata / MetadataItem: semantic definition list, responsive columns.
- StatusIndicator: static active, neutral, warning or in-progress mark and text.
- TextLink: normal, navigation and editorial links with optional arrows.
- Button: actual actions, not navigation.
- Divider: restrained semantic separator.

Components accept native HTML props and className extension. Status labels are
supplied by localized content; the component does not infer factual status.

## Motion vocabulary

Fast 160ms, medium 350ms, slow 700ms. Standard easing cubic-bezier(.2,0,0,1),
editorial (.22,1,.36,1), exit (.4,0,1,1). Phase 6 uses only brief color/border
transitions. Reduced motion suppresses animation/transition duration and smooth
scroll. Status marks never pulse. Future GSAP work should consume this vocabulary.

## Review preview and production boundary

`/dev/design-system` and `/vi/dev/design-system` demonstrate bilingual typography,
long titles, diacritics, metadata wrapping, colors, spacing and keyboard controls.
All displayed records are specimens, not approved portfolio facts.

`page.preview.tsx` is recognized only by the development-server pageExtensions
configuration. Production builds omit that extension. The production route manifest
and HTTP route checks confirm both preview URLs return 404. Preview metadata also
uses noindex/nofollow. No request header, cookie or environment switch enables it
in a production server. Re-run production route checks after Next.js upgrades.

The preview's font/load-shift diagnostic and action counter are isolated client
components; normal content and reusable primitives stay server-compatible.

## Verification

Lint, strict type checking, production build and route checks passed. Route checks
cover both locales, canonical English redirects, unknown routes, non-public source
assets and the preview's development/production boundary. No dependencies added.
Original portrait/PDF hashes remain unchanged and originals stay ignored by Git.

Browser checks covered English and Vietnamese at 375, 430, 768, 1024, 1440 and
1920px: no horizontal overflow, with the wide container capped at 1440px.
Vietnamese diacritics and long uppercase titles wrap without fixed-height clipping.
Both font families loaded; the preview recorded 0.0000 load shift in this local
session (not a guarantee for every network/device). Console checks on both
production homepages and the preview showed no warnings or hydration errors.
All preview links and enabled buttons expose visible keyboard focus; Space/Enter
activate the specimen action, reset works, and Tab skips the disabled control.
