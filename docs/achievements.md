# Phase 13 Achievements - factual update

## Published records

| Category | Record | Status | Published facts | Withheld |
| --- | --- | --- | --- | --- |
| Community | AWS Student Builder Group HCMUTE | Core Team | Organization and community role | Date, responsibilities, leadership level, outcomes, employment and AWS credentials |
| Competitions | Cybersecurity Student Competition 2025 | Qualifying Round Participant | Participation level, 2025 event identity, NCA organizer and public event URL | Finalist, winner, award, placement and qualification for a final |
| Recognition | HCMUTE CTF 2025 | Top 4 | Result and official event wording | Individual/team attribution, champion/finalist language and award category |
| Certifications | CEH / Certified Ethical Hacker | In Progress | CEH material is currently being studied | Completion, date, credential, score, certificate and expected completion |

All four records and all four approved categories are now published in English
and Vietnamese. The prior review states for the competition and Top 4 records
were superseded by the user's explicit factual confirmation.

## Composition

The existing editorial register is unchanged: category rules, global indices,
large text identities and explicit status columns remain the visual language.
The supplied CSCV URL appears as one restrained event link. There are no cards,
trophies, badges, certificate thumbnails or celebratory animation.

Desktop distributes index, identity and status over the editorial grid. Tablet
moves status beneath the identity; mobile stacks each record while retaining
category separation and readable organization/event names.

## Data and publication architecture

`src/data/achievements.ts` remains the sole factual catalog and is server-only.
`publishedAchievements` filters publication state and requires approved locale
copy. Published competitions additionally require an organizer, verified year
and public evidence link; published recognition requires a year and event
identity. Category-specific status types prevent Top 4 from being categorized as
competition participation.

One server component renders both locales. Proper names remain unchanged while
descriptions, organizer wording and participation status are localized without
stronger claims.

## Accessibility and performance

The section retains semantic category headings and ordered record lists. Status
is visible text and does not depend on color. The CSCV link is a normal keyboard
accessible anchor with safe new-tab semantics. All facts remain available without
hover, JavaScript or motion.

The update adds no client island, image, WebGL, dependency or animation. Browser
validation covers EN/VI at 375, 430, 768, 1024, 1440 and 1920, plus keyboard
navigation, focus, locale/hash switching, touch, reduced motion, no-JavaScript
output, console/hydration and layout shift.
