# Phase 17 localization parity

English remains the canonical factual baseline. Vietnamese publishes the same records, routes, and evidence boundaries without adding claims.

## Shared terminology

| Concept | English | Vietnamese | Decision |
| --- | --- | --- | --- |
| Identity | Identity | Giới thiệu | Use `Giới thiệu` in navigation, the section label, and accessibility copy. |
| Expertise | Expertise | Chuyên môn | Localized. |
| Selected Operations | Selected Operations | Dự án tiêu biểu | Localized in section, case navigation, and Terminal output; the compact menu remains `Dự án`. |
| Experience | Experience | Kinh nghiệm | Localized. |
| Achievements | Achievements | Thành tựu | Localized. |
| Security Log | Security Log | Security Log | Retained as the name of the technical journal; explanatory prose is localized. |
| Terminal | Terminal | Terminal | Retained as a familiar technical interface name; controls and output are localized. |
| Contact | Contact | Liên hệ | Localized. |
| In progress | In progress | Đang học | Used for the CEH learning state; never rendered as completed certification. |
| Qualifying round participant | Qualifying round participant | Tham dự vòng sơ khảo | Participation only. |
| Core Team | Core Team | Core Team | Approved public role wording remains unchanged. |
| Top 4 | Top 4 | Top 4 | Result only; no team, individual, finalist, or award category is inferred. |

Brand statements, personal names, proper names, technology names, command tokens, `UNDERSTAND SYSTEMS. DEFEND THEM.`, and `LET'S CONNECT.` remain unchanged in both locales.

## Surface parity checklist

- [x] Global navigation, initialization, status text, menu controls, skip link, and language controls
- [x] Hero brand statement and localized supporting field/cue
- [x] Identity biography, metadata, portrait alternative text, and CEH learning state
- [x] Expertise disciplines, descriptions, and invariant technology names
- [x] Three Selected Operations records and their three equivalent case-study routes
- [x] Experience roles, chronology precision, responsibilities, Memory Flower, and location wording
- [x] Four published Achievement categories and factual status boundaries
- [x] Homepage Security Log preview, archive index, and one bilingual article
- [x] HTTP plaintext versus HTTPS/TLS encrypted-content limitation
- [x] Terminal command tokens, localized descriptions/output, and shared content catalogs
- [x] Contact labels, approved public links, CV link, and End System controls
- [x] Locale-aware page titles, descriptions, Open Graph locale/content, and deployment-gated canonical/alternate URLs
- [x] Sitemap model for the two home routes, six case-study routes, two log indexes, and two article routes
- [x] `/en` canonical redirect, stable shared slugs, 404 behavior, and hash-preserving EN/VI switching

## Publication boundaries

- Case studies remain concise because no local evidence supports architecture diagrams, outcomes, metrics, detailed responsibilities, per-project repository links, or security findings.
- The Security Log article does not reconstruct a missing capture. It does not publish packet numbers, endpoints, domains, or stream identifiers.
- `TLS Application Data` is described as encrypted content in both locales and never converted into a specific visible HTTP request.
- Memory Flower remains neutral flower-arrangement work with no inferred title, dates, employment type, or technical framing.
- The sanitized public CV remains English and unchanged in Phase 17.

## URL and metadata policy

`SITE_URL` remains intentionally unset for local review. Canonical URLs, language alternates, indexable robots metadata, and sitemap URLs are emitted only when a valid public HTTPS `SITE_URL` is configured. This prevents localhost or an invented deployment domain from becoming public metadata. Local and preview builds remain `noindex, nofollow`.
