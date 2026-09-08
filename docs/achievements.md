# Phase 13 — Achievements

## Git checkpoint

`5dda061` — `feat: build carwyn.sec experience section`. The checkpoint contains
only the approved Phase 12 Experience implementation, data, evidence audit,
documentation, navigation integration, and validation. The two unrelated root
PNGs remain untracked.

## Published records

| Category | Record | Status | Published facts | Withheld |
| --- | --- | --- | --- | --- |
| Community | AWS Student Builder Group HCMUTE | Core Team | Organization and community role | Date, responsibilities, leadership level, outcomes, employment and AWS credentials |
| Certifications | CEH / Certified Ethical Hacker | In Progress | CEH material is currently being studied | Completion, date, credential, score, certificate and expected completion |

Top 4 at HCMUTE and CSCV qualifying-round participation remain in REVIEW state.
They are excluded from public output because their result/attribution evidence
does not meet the publication threshold. See `achievements-evidence-audit.md`.

## Composition

06 / ACHIEVEMENTS returns from the light Experience field to a deep mineral
surface. The shift marks a new chapter without matching the visual intensity of
Operations. A wide editorial register uses category rules, global record indices,
large text identities and explicit human-readable status columns. There are no
trophies, medals, badges, certificate thumbnails, cards or celebratory motion.

Only Community and Certifications render. Desktop distributes index, identity
and status over the editorial grid. Tablet moves status beneath the identity;
mobile stacks each record while retaining category separation and generous
spacing. Long organization names remain prominent and wrap intentionally.

## Data and publication architecture

`src/data/achievements.ts` is the sole factual catalog. It contains two published
records and two review records. The module is server-only. `publishedAchievements`
filters on record publication state, requires approved locale copy, requires an
organization for published community records, and requires public evidence if a
certification is ever marked completed.

The `Achievement` union now expresses category-specific statuses: community,
competition, recognition and certification cannot silently share arbitrary
status strings. One server component renders both locales. Proper names and CEH
remain unchanged; category, introduction, detail and in-progress status copy are
localized without stronger Vietnamese claims.

## Accessibility and interaction

The section uses a labelled section, h2 introduction, nested category sections,
h3 category headings, ordered record lists and h4 record identities. Status is
visible text and never depends on color. All factual content is visible without
hover or JavaScript. The section adds no links because no verified safe public
credential/event link belongs to an individual record.

There is no cursor override, accordion, carousel, client state or animation.
Reduced-motion users receive the same static register. Existing keyboard focus
and Index navigation target `#achievements`; the global status reports navigation
index 05 while the editorial section label remains 06.

## Performance and validation

The implementation adds one server component and one 4,086-byte stylesheet
(1,185 bytes gzip). It loads no images, WebGL, GSAP timeline, client island,
dependency or public asset. Browser validation covers EN/VI at 375, 430, 768,
1024, 1440 and 1920; intentional
wrapping, overflow, status text, category filtering, keyboard navigation,
focus-visible, locale/hash switching, touch, reduced motion, no-JavaScript output,
console/hydration and CLS. Production browser measurement reports CLS
`0.00002311935424804687`.

Review: http://localhost:3009/#achievements and
http://localhost:3009/vi#achievements. Phase 13 remains uncommitted for approval.

## Phase 14 entry point

After explicit approval, audit available Security Log topics and MDX readiness,
then build the bilingual index/article foundation without turning unpublished
notes into public articles.
