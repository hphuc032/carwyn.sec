# Phase 14 — Security Log

## Published content

v1 contains exactly one published, bilingual field note:

- `LOG_001`
- **Analyzing HTTP and HTTPS Traffic with Wireshark**
- Stable slug: `analyzing-http-and-https-traffic-with-wireshark`
- Category: Network / Lab
- Publication date: 2026-09-08
- Reading time: derived from each locale's reviewed MDX source at build/render time

The article is a methodology note. It records the verified protocol-analysis
practice and clearly separates visible data from interpretation. It contains no
invented capture details, results or screenshots. See
`security-log-evidence-audit.md` for the publication boundary.

## Interface and routes

The homepage `#log` section uses one large editorial record and links to a quiet,
reading-oriented archive. The index supports future published records without
rendering placeholders or fake counts. Article pages share a narrow prose measure,
restrained technical metadata, accessible callouts, a horizontally scrollable
comparison table, and focused code treatment.

Published routes:

- `/log`
- `/vi/log`
- `/log/analyzing-http-and-https-traffic-with-wireshark`
- `/vi/log/analyzing-http-and-https-traffic-with-wireshark`

Unknown and unpublished slugs return 404. Locale routes share one template and
use an explicit server registry; route input is never converted into an arbitrary
filesystem import. The sitemap includes these URLs only when a valid public HTTPS
`SITE_URL` is configured.

## Content architecture

`src/data/security-log.ts` is the server-only catalog and content registry.
`src/data/security-log-publication.ts` is the small client-safe publication
manifest used for route-aware language switching. English and Vietnamese MDX live
under the real article slug. Build-time assertions require published locale copy,
category metadata, an exact publication date and a registered MDX component.

The MDX vocabulary contains one article-specific component, `LogCallout`. Tables,
headings, paragraphs and code blocks remain semantic HTML. There is no CMS,
database, remote content source, runtime-generated MDX or user-uploaded content.

## Runtime and accessibility

Homepage, index and article prose are server-rendered. The Security Log adds no
client component, dependency, image, WebGL, React Three Fiber or GSAP timeline.
Article content remains readable without JavaScript. Status, headings, captions
and evidence boundaries are text rather than color-only cues. Code and tables
scroll horizontally on narrow screens without forcing page overflow.

The global Index links to `#log`, the status reads navigation index `06 / LOG`,
and EN/VI switching preserves the equivalent index or article route. The
editorial section label remains `07 / SECURITY LOG`.

Production browser measurement at 1440 records 147,513 encoded script bytes and
115,137 encoded stylesheet/link bytes on the article route, compared with 407,088
and 135,651 on the WebGL homepage. The article loads no image and renders no
canvas. Its measured layout shift is 0. These figures are local production-build
measurements and can vary with hosting compression and cache state.

## Withheld pending evidence

Packet-capture figures, annotated screenshots, endpoints, domains, packet or
stream identifiers, capture-specific HTTP fields, decryption claims and technical
findings remain unpublished until primary evidence can be reviewed and sanitized.
