"""Generate the reviewed public-safe carwyn.sec CV derivative."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "cv" / "nguyen-hoang-phuc-cv.pdf"

INK = colors.HexColor("#17201D")
MUTED = colors.HexColor("#4C5A55")
ACCENT = colors.HexColor("#0E6758")
RULE = colors.HexColor("#C8D0CC")


def link(label: str, url: str) -> str:
    return f'<link href="{url}" color="#0E6758"><u>{label}</u></link>'


def section_heading(label: str, styles: dict[str, ParagraphStyle]) -> Table:
    heading = Paragraph(label.upper(), styles["section"])
    heading_width = 155
    line_width = max(20, A4[0] - 32 * mm - heading_width)
    table = Table([[heading, ""]], colWidths=[heading_width, line_width], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LINEBELOW", (1, 0), (1, 0), 0.6, RULE),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 8),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return table


def build() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=13 * mm,
        bottomMargin=12 * mm,
        title="Nguyen Hoang Phuc - Information Security CV",
        author="Nguyen Hoang Phuc",
        subject="Public-safe cybersecurity portfolio CV",
        creator="carwyn.sec",
    )

    base = getSampleStyleSheet()
    styles = {
        "name": ParagraphStyle(
            "Name", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=28,
            leading=30, textColor=INK, spaceAfter=3,
        ),
        "headline": ParagraphStyle(
            "Headline", parent=base["Normal"], fontName="Helvetica", fontSize=11.5,
            leading=14, textColor=ACCENT, spaceAfter=6,
        ),
        "contact": ParagraphStyle(
            "Contact", parent=base["Normal"], fontName="Helvetica", fontSize=8.5,
            leading=11.5, textColor=MUTED, spaceAfter=8,
        ),
        "summary": ParagraphStyle(
            "Summary", parent=base["Normal"], fontName="Helvetica", fontSize=9.4,
            leading=13.5, textColor=INK, spaceAfter=9,
        ),
        "section": ParagraphStyle(
            "Section", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=9,
            leading=11, tracking=0.8, textColor=ACCENT, spaceBefore=0, spaceAfter=0,
        ),
        "row": ParagraphStyle(
            "Row", parent=base["Normal"], fontName="Helvetica", fontSize=8.8,
            leading=11.8, textColor=INK,
        ),
        "row_compact": ParagraphStyle(
            "RowCompact", parent=base["Normal"], fontName="Helvetica", fontSize=8.35,
            leading=11.1, textColor=INK,
        ),
        "item_title": ParagraphStyle(
            "ItemTitle", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=9.8,
            leading=12.2, textColor=INK, spaceAfter=2,
        ),
        "item_body": ParagraphStyle(
            "ItemBody", parent=base["Normal"], fontName="Helvetica", fontSize=8.45,
            leading=11.5, textColor=MUTED, spaceAfter=1.5,
        ),
        "footer": ParagraphStyle(
            "Footer", parent=base["Normal"], fontName="Helvetica", fontSize=7,
            leading=9, alignment=TA_LEFT, textColor=MUTED,
        ),
    }

    story = [
        Paragraph("NGUYEN HOANG PHUC", styles["name"]),
        Paragraph("INFORMATION SECURITY / CYBER SECURITY", styles["headline"]),
        Paragraph(
            "Vietnam &nbsp;&nbsp;|&nbsp;&nbsp; "
            + link("nhpntd@gmail.com", "mailto:nhpntd@gmail.com")
            + " &nbsp;&nbsp;|&nbsp;&nbsp; "
            + link("github.com/hphuc032", "https://github.com/hphuc032")
            + "<br/>"
            + link("linkedin.com/in/nguyen-phuc-71217332a", "https://www.linkedin.com/in/nguyen-phuc-71217332a/"),
            styles["contact"],
        ),
        Paragraph(
            "Hands-on work across network analysis, vulnerability assessment, application and API security, "
            "backend development, and infrastructure labs. I document security projects, technical learning, "
            "and the systems I study through carwyn.sec.",
            styles["summary"],
        ),
        section_heading("Technical Capabilities", styles),
        Spacer(1, 5),
        Paragraph("<b>Network Security</b> &nbsp; Wireshark, Nmap, TCP/IP analysis, DNS, HTTP / HTTPS traffic analysis, network enumeration", styles["row_compact"]),
        Paragraph("<b>Vulnerability Assessment / Security Testing</b> &nbsp; Kali Linux, Metasploit, OWASP ZAP, service enumeration, vulnerability identification and assessment", styles["row_compact"]),
        Paragraph("<b>Application / API Security</b> &nbsp; FastAPI, Keycloak, Kong, JWT, OAuth2, OpenID Connect (OIDC), RBAC, Docker, PostgreSQL, authentication / authorization testing", styles["row_compact"]),
        Paragraph("<b>Backend / Infrastructure</b> &nbsp; Java, Spring Boot, Servlet, JSP / JSTL, JPA, JDBC, MySQL, Python, SQL, Ubuntu, FortiGate, Docker", styles["row_compact"]),
        Spacer(1, 8),
        section_heading("Selected Projects", styles),
        Spacer(1, 5),
        KeepTogether([
            Paragraph("SECURE API GATEWAY", styles["item_title"]),
            Paragraph("A project focused on API authentication and authorization. Used FastAPI, PostgreSQL, Keycloak, Kong, Docker, JWT, OAuth2, OpenID Connect, and RBAC.", styles["item_body"]),
        ]),
        KeepTogether([
            Paragraph("VULNERABILITY ASSESSMENT", styles["item_title"]),
            Paragraph("Security assessment practice in controlled educational labs, including service enumeration and vulnerability identification and assessment with Kali Linux, Nmap, Metasploit, and OWASP ZAP.", styles["item_body"]),
        ]),
        KeepTogether([
            Paragraph("NETWORK TRAFFIC ANALYSIS", styles["item_title"]),
            Paragraph("Hands-on packet and protocol analysis with Wireshark, covering TCP/IP, DNS, and HTTP / HTTPS traffic behavior.", styles["item_body"]),
        ]),
        Spacer(1, 7),
        section_heading("Experience", styles),
        Spacer(1, 5),
        KeepTogether([
            Paragraph("UAT TESTER - WEB &amp; MOBILE APPLICATIONS &nbsp; <font color='#4C5A55'>AUG 2026 - PRESENT</font>", styles["item_title"]),
            Paragraph("Conduct UAT and regression testing, create and execute test scenarios from business requirements, report and track defects, and verify bug fixes.", styles["item_body"]),
        ]),
        KeepTogether([
            Paragraph("FLOWER ARRANGEMENT - MEMORY FLOWER &nbsp; <font color='#4C5A55'>PHU NHUAN</font>", styles["item_title"]),
            Paragraph("Flower-arrangement work at Memory Flower in Phu Nhuan.", styles["item_body"]),
        ]),
        Spacer(1, 7),
        section_heading("Achievements & Learning", styles),
        Spacer(1, 5),
        Paragraph("<b>Core Team</b> - AWS Student Builder Group HCMUTE", styles["row"]),
        Paragraph("<b>Top 4</b> - HCMUTE CTF 2025", styles["row"]),
        Paragraph("<b>Cybersecurity Student Competition 2025</b> - Qualifying Round Participant", styles["row"]),
        Paragraph("<b>CEH - In Progress</b> &nbsp; Currently studying Certified Ethical Hacker material.", styles["row"]),
        Spacer(1, 5),
        Paragraph("Portfolio: carwyn.sec &nbsp; | &nbsp; Public CV generated from reviewed portfolio records", styles["footer"]),
    ]

    def page(canvas, _document):
        canvas.saveState()
        canvas.setTitle("Nguyen Hoang Phuc - Information Security CV")
        canvas.setAuthor("Nguyen Hoang Phuc")
        canvas.setSubject("Public-safe cybersecurity portfolio CV")
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.5)
        canvas.line(16 * mm, 9 * mm, A4[0] - 16 * mm, 9 * mm)
        canvas.restoreState()

    document.build(story, onFirstPage=page, onLaterPages=page)
    print(OUTPUT)


if __name__ == "__main__":
    build()
