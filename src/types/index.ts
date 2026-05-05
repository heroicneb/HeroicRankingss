export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

export interface ServiceCard {
  title: string;
  frontImageSrc: string;
  frontImageAlt: string;
  backImageSrc?: string;
  backDescription: string;
  href?: string;
}

export interface AboutLogoAsset {
  src: string;
  width: number;
  height: number;
  imgW: number;
  imgH: number;
  imgL: number;
  imgT: number;
}

export interface TeamMemberBase {
  name: string;
  role: string;
}

export interface TeamMember extends TeamMemberBase {
  imageSrc: string;
  imageAlt: string;
  href: string;
  offsetClassName?: string;
}

export interface StatItem {
  metric: string;
  detail: string;
  imageSrc: string;
  imageAlt: string;
  sizeClassName: string;
}

export interface CaseStudy {
  title: string;
  headline: string;
  summary: string;
  date: string;
  colorClassName: string;
  href: string;
}

export interface QuoteLine {
  id: string;
  lead: string;
  accent: string;
  tail: string;
}

export interface TrustAuthorityItem {
  label: string;
  iconTone: "google" | "hubspot";
  compact?: boolean;
}

export interface BlogCard {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
}

export interface AboutTeamMember extends TeamMemberBase {
  slug?: string;
  imageSrc: string;
  imageAlt: string;
  isRoleGradient?: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarSrc: string;
  avatarAlt: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  logoOffsetTop: number;
}
