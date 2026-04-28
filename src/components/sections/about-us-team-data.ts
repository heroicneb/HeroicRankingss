import {
  SITE_EMAIL,
  SITE_INSTAGRAM_URL,
  SITE_LINKEDIN_URL,
  SITE_PHONE,
  SITE_X_URL,
} from "@/lib/site";
import type { AboutTeamMember, TeamMemberPopupData } from "@/types";

export const TEAM_MEMBERS: AboutTeamMember[] = [
  {
    name: "Nebojša Janković",
    role: "/  Founder & CEO  /",
    imageSrc: "/figma/about-us/team/nebojsa.jpg",
    imageAlt: "Nebojša Janković portrait",
  },
  {
    name: "Anastasija Janković",
    role: "/  Co-Founder & CHRO  /",
    imageSrc: "/figma/about-us/team/anastasija.jpg",
    imageAlt: "Anastasija Janković portrait",
  },
  {
    name: "Stefan Cvetković",
    role: "Organic Growth Manager",
    imageSrc: "/figma/about-us/team/stefan.jpg",
    imageAlt: "Stefan Cvetković portrait",
  },
  {
    name: "Una Stanojević",
    role: "Head of Operations",
    imageSrc: "/figma/about-us/team/una.jpg",
    imageAlt: "Una Stanojević portrait",
  },
  {
    name: "Srđan Gombar",
    role: "/  Content Manager  /",
    imageSrc: "/figma/about-us/team/srdjan.jpg",
    imageAlt: "Srđan Gombar portrait",
  },
  {
    name: "Slobodan Kačavenda",
    role: "/  Link Building Manager  /",
    imageSrc: "/figma/about-us/team/slobodan.jpg",
    imageAlt: "Slobodan Kačavenda portrait",
  },
  {
    name: "Anđela Knežević",
    role: "/  Link Building Specialist  /",
    imageSrc: "/figma/about-us/team/andjela.jpg",
    imageAlt: "Anđela Knežević portrait",
  },
  {
    name: "Become a Hero",
    role: "/  Apply Now  /",
    imageSrc: "/figma/about-us/team/become-hero.png",
    imageAlt: "Become a Hero card visual",
    isRoleGradient: true,
  },
];

export const POPUP_DATA: Record<string, TeamMemberPopupData> = {
  "Nebojša Janković": {
    name: "Nebojša Janković",
    role: "/  Founder & CEO  /",
    cardImageSrc: "/figma/about-us/team/popup/nebojsa-card.webp",
    cardImageAlt: "Nebojša Janković",
    bioParagraphs: [
      [
        "My journey into the world of SEO has been one of perseverance and self-discovery. I started from humble beginnings, juggling warehouse shifts and studying engineering, but I always had a hunger for more.",
        "Throughout my life, I've seen myself as a problem solver. To me, every problem is a puzzle first and a challenge second. This perspective has driven me to develop a keen eye for detail and a meticulous approach, which has earned me the reputation of being the go-to person for resolving SEO issues.",
      ],
      [
        "Paired with my leadership skills and results-driven mindset, I view any task, no matter how monumental, as just another puzzle waiting to be solved. Through hard work and adaptability, I've built a career and a company I'm proud of, turning challenges into opportunities for success.",
        "I'm a resilient, dedicated, and ambitious individual who strives to grow both personally and professionally. In my spare time, I enjoy traveling the world, spending quality time with my wife and son, and keeping up with the latest marketing trends to stay inspired and informed.",
      ],
    ],
    contact: { phone: SITE_PHONE, email: SITE_EMAIL },
    socials: [
      { label: "Instagram", url: SITE_INSTAGRAM_URL },
      { label: "LinkedIn", url: SITE_LINKEDIN_URL },
      { label: "X", url: SITE_X_URL },
    ],
  },
};

export const POPUP_MEMBERS = TEAM_MEMBERS.filter(
  (member) => member.name in POPUP_DATA,
);

export function createTeamMemberHash(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
