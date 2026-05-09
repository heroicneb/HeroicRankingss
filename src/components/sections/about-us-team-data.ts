import type { AboutTeamMember } from "@/types";

/**
 * Hardcoded team roster used as a fallback when Sanity returns no team
 * members (or during initial render before CMS data is fetched). Each entry
 * mirrors what Sanity now ships, with `slug` matching the team document
 * slug so /about/[slug] routing works for both CMS and fallback data.
 */
export const TEAM_MEMBERS: AboutTeamMember[] = [
  {
    name: "Nebojša Janković",
    slug: "nebojsa-jankovic",
    role: "/  Founder & CEO  /",
    imageSrc: "/figma/about-us/team/nebojsa.jpg",
    imageAlt: "Nebojša Janković portrait",
  },
  {
    name: "Anastasija Janković",
    slug: "anastasija-jankovic",
    role: "/  Co-Founder & CHRO  /",
    imageSrc: "/figma/about-us/team/anastasija.jpg",
    imageAlt: "Anastasija Janković portrait",
  },
  {
    name: "Stefan Cvetković",
    slug: "stefan-cvetkovic",
    role: "Organic Growth Manager",
    imageSrc: "/figma/about-us/team/stefan.jpg",
    imageAlt: "Stefan Cvetković portrait",
  },
  {
    name: "Una Stanojević",
    slug: "una-stanojevic",
    role: "Head of Operations",
    imageSrc: "/figma/about-us/team/una.jpg",
    imageAlt: "Una Stanojević portrait",
  },
  {
    name: "Srđan Gombar",
    slug: "srdjan-gombar",
    role: "/  Content Manager  /",
    imageSrc: "/figma/about-us/team/srdjan.jpg",
    imageAlt: "Srđan Gombar portrait",
  },
  {
    name: "Slobodan Kačavenda",
    slug: "slobodan-kacavenda",
    role: "/  Link Building Manager  /",
    imageSrc: "/figma/about-us/team/slobodan.jpg",
    imageAlt: "Slobodan Kačavenda portrait",
  },
  {
    name: "Anđela Knežević",
    slug: "andjela-knezevic",
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
