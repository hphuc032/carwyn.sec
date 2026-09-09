# Phase 16 Contact, public CV and End System

## Canonical public contact record

`src/data/contact.ts` is the sole source for the approved email, GitHub,
LinkedIn and public CV path. Contact and Terminal derive their output from this
server-only catalog. End System deliberately avoids repeating all four methods.

The English closing statement `LET'S CONNECT.` remains intentional brand copy
in both locales. Section labels, supporting copy, actions, status and Back to Top
are localized. Proper names, technical platforms, email and URLs are unchanged.

## Public-safe CV

`scripts/generate-public-cv.py` deterministically creates the one-page A4 PDF at
`public/cv/nguyen-hoang-phuc-cv.pdf`. It uses a single-column reading order,
standard PDF fonts, visible URLs and real link annotations for ATS and recruiter
usability.

Published content is limited to the approved public identity and contact data,
four capability groups, three featured project briefs, two published Experience
records, Core Team at AWS Student Builder Group HCMUTE, qualifying-round
participation in Cybersecurity Student Competition 2025, Top 4 at HCMUTE CTF
2025, and CEH - In Progress.

The derivative excludes the phone number, Ho Chi Minh City, portrait, the old
CTF encouragement-prize wording, AWS dates, AWS responsibilities, leadership
claims, project metrics, unverified findings and per-project repository URLs.
The ignored source PDF is never copied or altered.

## Composition and behavior

Contact changes the rhythm after Terminal through a pale editorial field,
oversized closing typography and four ruled text records. Every destination is a
real anchor; external profiles and the PDF use safe new-tab semantics, while
email remains a direct `mailto:` link. There is no form, clipboard-only action,
backend or contact-specific client island.

End System is a compact dark footer with the final section label, brand, static
operational status, 2026 copyright and a native `#hero` Back to Top link. Contact
automatically participates in the existing IntersectionObserver navigation and
locale-preserving hash infrastructure through its stable `id="contact"`.
