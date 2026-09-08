import { Container, EditorialGrid, FullBleed } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { Metadata, MetadataItem } from "@/components/ui/Metadata";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { TextLink } from "@/components/ui/TextLink";
import { Divider } from "@/components/ui/Divider";
import { FontDiagnostics, PreviewActions } from "./PreviewActions";
import type { Locale } from "@/i18n/locales";
import "./preview.css";

const swatches = [
  ["Background", "--background", "#050505"], ["Surface", "--surface", "#0B0D0F"],
  ["Raised", "--surface-raised", "#12171B"], ["Hover", "--surface-hover", "#1B2228"],
  ["Primary", "--text-primary", "#F5F5F5"], ["Muted", "--text-muted", "#B6BDC3"],
  ["Subtle", "--text-subtle", "#88939B"], ["Border", "--border", "#30383F"],
  ["Active border", "--border-active", "#74818B"],
  ["Cyber", "--accent-cyber", "#00FFB2"], ["Digital", "--accent-digital", "#00C8FF"],
  ["Alert", "--alert", "#FF3B5C"], ["Warning", "--warning", "#E5BE76"],
] as const;
const scale = [
  ["display-xl", "text-display-xl", "Quiet precision.", "Chính xác."],
  ["display-lg", "text-display-lg", "Every detail matters.", "Từng chi tiết đều quan trọng."],
  ["heading-1", "text-heading-1", "Understanding complex systems", "Thấu hiểu những hệ thống phức tạp"],
  ["heading-2", "text-heading-2", "Clarity through careful observation", "Sự rõ ràng bắt đầu từ quan sát cẩn thận"],
  ["heading-3", "text-heading-3", "A considered approach to technical documentation", "Cách tiếp cận có chủ đích đối với tài liệu kỹ thuật"],
] as const;

export function DesignSystemPreview({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return <main id="main-content" tabIndex={-1} className="design-specimen">
    <Container width="wide">
      <header className="specimen-header">
        <div className="specimen-topline">
          <SystemLabel>carwyn.sec / Design laboratory</SystemLabel>
          <span className="specimen-locale-links">
            <TextLink href="/dev/design-system" variant="navigation" lang="en" aria-current={!vi ? "page" : undefined}>EN specimen</TextLink>
            <TextLink href="/vi/dev/design-system" variant="navigation" lang="vi" aria-current={vi ? "page" : undefined}>Mẫu VI</TextLink>
          </span>
        </div>
        <SectionLabel number="06">{vi ? "Hệ thống thiết kế" : "Design system"}</SectionLabel>
        <EditorialHeading as="h1" size="heading-1">{vi ? "Ngôn ngữ của sự rõ ràng." : "A language of clarity."}</EditorialHeading>
        <p className="text-body text-secondary specimen-intro">{vi
          ? "Trang mẫu chỉ dành cho phát triển. Nội dung minh họa dùng để kiểm tra kiểu chữ, bố cục và trạng thái tương tác; không phải thông tin hồ sơ đã công bố."
          : "Development specimen only. Sample content tests typography, layout, and interaction states; it is not published portfolio information."}</p>
        <FontDiagnostics />
        <nav aria-label={vi ? "Mục lục trang mẫu" : "Specimen contents"} className="specimen-contents">
          <TextLink href="#typography" variant="navigation">{vi ? "Kiểu chữ" : "Typography"}</TextLink>
          <TextLink href="#color" variant="navigation">{vi ? "Màu sắc" : "Color"}</TextLink>
          <TextLink href="#records" variant="navigation">{vi ? "Nhãn & thông tin" : "Labels & metadata"}</TextLink>
          <TextLink href="#interaction" variant="navigation">{vi ? "Tương tác" : "Interaction"}</TextLink>
          <TextLink href="#layout" variant="navigation">{vi ? "Bố cục" : "Layout"}</TextLink>
        </nav>
      </header>
      <Divider />

      <section id="typography" className="specimen-section" aria-labelledby="type-title">
        <SectionLabel number="01">{vi ? "Kiểu chữ" : "Typography"}</SectionLabel>
        <EditorialHeading id="type-title">Be Vietnam Pro <span className="text-muted">&</span> IBM Plex Mono</EditorialHeading>
        <p className="text-body-sm text-secondary">400 / 500 / 600 / 700 · Editorial &nbsp; — &nbsp; 400 / 500 · Mono</p>
        <div className="specimen-type-list">
          {scale.map(([name, className, en, vietnamese]) => <div className="specimen-type-row" key={name}>
            <SystemLabel>{name}</SystemLabel>
            <p className={`editorial-heading ${className}`} lang={locale}>{vi ? vietnamese : en}</p>
          </div>)}
          {(["text-body-lg", "text-body", "text-body-sm"] as const).map((className) => <div className="specimen-type-row" key={className}>
            <SystemLabel>{className.replace("text-", "")}</SystemLabel>
            <p className={`${className} specimen-prose`}>{vi
              ? "Thông tin rõ ràng giúp người đọc hiểu đúng bối cảnh, đánh giá bằng chứng và nhận biết những giới hạn. Mỗi đoạn văn cần có đủ khoảng thở để các dấu tiếng Việt được hiển thị tự nhiên."
              : "Clear information helps readers understand the context, evaluate the evidence, and recognize limitations. Each paragraph has room to breathe, making longer technical explanations comfortable to read."}</p>
          </div>)}
          <div className="specimen-type-row"><SystemLabel>metadata</SystemLabel><p className="text-metadata">EN / VI · 0123456789 · {vi ? "Thông tin bổ sung" : "Supporting information"}</p></div>
          <div className="specimen-type-row"><SystemLabel>mono-label</SystemLabel><SystemLabel>{vi ? "Đang thực hiện / Cần xem xét" : "In progress / Review required"}</SystemLabel></div>
        </div>
        <div className="specimen-language-proof" lang="vi">
          <SystemLabel>Vietnamese coverage / Long-string proof</SystemLabel>
          <EditorialHeading as="h3" size="heading-3">NGHIÊN CỨU VÀ ĐÁNH GIÁ AN TOÀN THÔNG TIN</EditorialHeading>
          <p className="text-body">Nguyễn Hoàng Phúc · Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh</p>
          <p className="text-body">Ă Â Đ Ê Ô Ơ Ư / Ắ Ằ Ẳ Ẵ Ặ / Ế Ề Ể Ễ Ệ / Ố Ồ Ổ Ỗ Ộ / Ớ Ờ Ở Ỡ Ợ / Ứ Ừ Ử Ữ Ự</p>
          <p className="font-mono text-metadata">ă â đ ê ô ơ ư / ắ ằ ẳ ẵ ặ / ế ề ể ễ ệ / ố ồ ổ ỗ ộ / ớ ờ ở ỡ ợ / ứ ừ ử ữ ự</p>
        </div>
      </section>
      <Divider />

      <section id="color" className="specimen-section" aria-labelledby="color-title">
        <SectionLabel number="02">{vi ? "Màu sắc" : "Color"}</SectionLabel>
        <EditorialHeading id="color-title">{vi ? "Trung tính trước. Điểm nhấn có chủ đích." : "Neutral first. Signal with purpose."}</EditorialHeading>
        <div className="specimen-swatches">{swatches.map(([name, token, hex]) => <div key={token} className="specimen-swatch">
          <span className="specimen-color" style={{ backgroundColor: `var(${token})` }} aria-hidden="true" />
          <span className="text-body-sm">{name}</span><span className="font-mono text-mono-label text-muted">{hex}</span>
        </div>)}</div>
        <p className="text-body-sm text-secondary">{vi ? "Đường phân cách là yếu tố trang trí. Điều khiển tương tác dùng đường viền rõ hơn; màu sắc luôn đi cùng nhãn." : "Dividers are decorative. Interactive controls use stronger boundaries; color is always paired with a label."}</p>
      </section>
      <Divider />

      <section id="records" className="specimen-section" aria-labelledby="records-title">
        <SectionLabel number="03">{vi ? "Nhãn & thông tin" : "Labels & metadata"}</SectionLabel>
        <EditorialHeading id="records-title">{vi ? "Thông tin có cấu trúc." : "Structured information."}</EditorialHeading>
        <div className="specimen-labels">
          <SectionLabel number="02">{vi ? "Danh tính" : "Identity"}</SectionLabel>
          <SectionLabel number="04">{vi ? "Các dự án được lựa chọn để trình bày chi tiết" : "Selected operations and supporting documentation"}</SectionLabel>
          <SectionLabel number="07">{vi ? "Nhật ký bảo mật" : "Security log"}</SectionLabel>
        </div>
        <Metadata>
          <MetadataItem label={vi ? "Trạng thái" : "Status"}><StatusIndicator state="active">{vi ? "HỆ THỐNG SẴN SÀNG" : "SYSTEM ONLINE"}</StatusIndicator></MetadataItem>
          <MetadataItem label={vi ? "Địa điểm" : "Location"}>{vi ? "Việt Nam" : "Vietnam"}</MetadataItem>
          <MetadataItem label={vi ? "Lĩnh vực" : "Field"}>{vi ? "Nghiên cứu hệ thống và tài liệu an toàn thông tin" : "Information security systems and technical documentation"}</MetadataItem>
        </Metadata>
        <div className="specimen-statuses">
          <StatusIndicator state="active">{vi ? "Sẵn sàng" : "Active"}</StatusIndicator>
          <StatusIndicator state="neutral">{vi ? "Thông tin" : "Neutral"}</StatusIndicator>
          <StatusIndicator state="warning">{vi ? "Cần xem xét" : "Review required"}</StatusIndicator>
          <StatusIndicator state="in-progress">{vi ? "Đang thực hiện" : "In progress"}</StatusIndicator>
        </div>
      </section>
      <Divider />

      <section id="interaction" className="specimen-section" aria-labelledby="interaction-title">
        <SectionLabel number="04">{vi ? "Tương tác" : "Interaction"}</SectionLabel>
        <EditorialHeading id="interaction-title">{vi ? "Nhẹ nhàng và rõ ràng." : "Quiet, deliberate feedback."}</EditorialHeading>
        <div className="specimen-link-list">
          <p className="text-body">{vi ? "Đọc thêm về " : "Read more about "}<TextLink href="#layout">{vi ? "nhịp điệu và khoảng cách" : "rhythm and spacing"}</TextLink>.</p>
          <TextLink href="#typography" variant="navigation">{vi ? "Liên kết điều hướng mẫu" : "Navigation link specimen"}</TextLink>
          <TextLink href="https://fonts.google.com/specimen/Be+Vietnam+Pro" newTab newTabLabel={vi ? "mở trong thẻ mới" : "opens in a new tab"} arrow="external">Google Fonts / Be Vietnam Pro</TextLink>
          <TextLink href="#records" variant="editorial" arrow="right">{vi ? "XEM THÔNG TIN MINH HỌA" : "VIEW SAMPLE INFORMATION"}</TextLink>
        </div>
        <PreviewActions locale={locale} />
        <p className="text-body-sm text-secondary">{vi ? "Dùng Tab để kiểm tra tiêu điểm, Enter cho liên kết và Enter hoặc Space cho nút. Trạng thái không có hiệu ứng nhấp nháy." : "Use Tab to inspect focus, Enter for links, and Enter or Space for buttons. Status indicators remain static."}</p>
      </section>
      <Divider />

      <section id="layout" className="specimen-section" aria-labelledby="layout-title">
        <SectionLabel number="05">{vi ? "Bố cục" : "Layout"}</SectionLabel>
        <EditorialHeading id="layout-title">{vi ? "Một lưới. Nhiều nhịp điệu." : "One grid. Room for rhythm."}</EditorialHeading>
        <SystemLabel>4 / 8 / 12 columns · Fluid gutters · 1440px wide maximum</SystemLabel>
        <EditorialGrid className="specimen-grid">{Array.from({ length: 12 }, (_, i) => <div className="specimen-grid-cell" key={i}>{String(i + 1).padStart(2, "0")}</div>)}</EditorialGrid>
        <div className="specimen-space-list">{[1, 2, 3, 4, 6, 8, 12, 16, 24, 36, 48].map((step) => <div key={step}>
          <SystemLabel>{step * 4}px</SystemLabel><span style={{ width: `var(--space-${step})` }} aria-hidden="true" />
        </div>)}</div>
        <Metadata>
          <MetadataItem label="Duration / fast">160ms</MetadataItem><MetadataItem label="Duration / medium">350ms</MetadataItem><MetadataItem label="Duration / slow">700ms</MetadataItem>
        </Metadata>
      </section>
    </Container>
    <FullBleed className="specimen-bleed">
      <Container><SystemLabel>Full bleed / Content container</SystemLabel><p className="text-body-lg">{vi ? "Nền mở rộng, nội dung vẫn giữ đúng lề." : "The surface extends. The content stays aligned."}</p></Container>
    </FullBleed>
    <Container width="reading" className="specimen-reading">
      <SystemLabel>Reading container / 704px maximum</SystemLabel>
      <p className="text-body">{vi ? "Độ rộng đoạn văn được giới hạn để việc đọc dễ dàng hơn trên màn hình lớn. Không dùng chiều cao cố định cho văn bản hoặc cắt các dấu tiếng Việt." : "The reading measure stays bounded on wide screens. Text has no fixed height, so longer explanations and Vietnamese diacritics remain fully visible."}</p>
      <TextLink href="#main-content" variant="editorial" arrow="right">{vi ? "VỀ ĐẦU TRANG MẪU" : "BACK TO SPECIMEN START"}</TextLink>
    </Container>
  </main>;
}
