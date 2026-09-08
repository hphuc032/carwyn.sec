import type { Profile } from "@/types/content";

// Only established baseline facts. Extended biography/objective/availability stay pending.
export const profile = {
  brand: "carwyn.sec",
  name: "Nguyen Hoang Phuc",
  field: "Information Security",
  location: "Vietnam",
  content: {
    en: { state: "published", value: { biography: "I’m Nguyen Hoang Phuc, based in Vietnam. carwyn.sec is where I document security projects, technical learning, and the systems I study." } },
    vi: { state: "published", value: { biography: "Tôi là Nguyen Hoang Phuc, hiện ở Việt Nam. carwyn.sec là nơi tôi ghi lại các dự án bảo mật, quá trình học kỹ thuật và những hệ thống tôi nghiên cứu." } },
  },
  currentLearning: [{ name: "CEH", status: "in-progress" }],
  portrait: {
    src: "/images/identity/nguyen-hoang-phuc.webp", width: 1800, height: 2700,
    alt: {
      en: { state: "review", value: "Nguyen Hoang Phuc wearing a black jacket and sunglasses, seated in warm natural surroundings." },
      vi: { state: "review", value: "Nguyen Hoang Phuc mặc áo khoác đen và đeo kính râm, ngồi trong không gian có tông màu ấm." },
    },
  },
} as const satisfies Profile;
