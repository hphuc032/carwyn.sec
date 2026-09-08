# Phase 14 evidence audit — Security Log

Scope: the approved content catalog, project evidence audit, portfolio data, and
local CV documents relevant to Wireshark, TCP/IP, DNS, HTTP and HTTPS. No unrelated
private directories or external services were searched.

## LOG_001 — HTTP and HTTPS traffic analysis with Wireshark

### Confirmed

- Nguyen Hoang Phuc has used Wireshark in network-security labs.
- Confirmed practice includes TCP/IP analysis, DNS, HTTP and HTTPS traffic
  analysis, packet inspection and protocol analysis.
- The approved capability baseline supports a first-person field note about the
  analysis method and the distinction between observation and interpretation.

### Partially confirmed

- The work establishes hands-on protocol-analysis practice, but the available
  portfolio evidence does not identify a single capture session that can be
  reconstructed publicly.
- Plaintext HTTP visibility and HTTPS/TLS limitations can be explained as method
  and protocol boundaries. They are not presented as findings from a named capture.

### Missing / withheld

- Original packet capture or sanitized derivative.
- Packet numbers, timestamps, endpoint addresses, domains and stream identifiers.
- Session keys or evidence that HTTPS traffic was decrypted.
- Session-specific request methods, paths, headers, bodies, status codes or
  credentials.
- Findings, forensic conclusions, malicious-activity attribution and performance
  conclusions.
- A screenshot suitable for public release.

## Publication decision

Publish one concise, bilingual methodology field note titled **Analyzing HTTP and
HTTPS Traffic with Wireshark**. The article states its evidence boundary, uses only
general display filters relevant to the confirmed protocols, and separates direct
observations from interpretations. It explicitly says that TLS Application Data
does not expose the enclosed HTTP message without valid decryption.

No evidence image is published because no verifiable source image exists. No
private file was copied, redacted or modified. The publication date is 2026-09-08,
the date this repository-reviewed article was created for public release.
