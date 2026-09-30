import type { Testimonial } from "../../types";

/*
 * Cards behind "/ Dedication / What Our Clients Say". This is the built-in
 * list and the seed source for the Sanity "Testimonials" documents
 * (scripts/seed/testimonials.ts); the section prefers the CMS when present.
 * The four Clutch reviews quote clutch.co/profile/heroic-rankings verbatim.
 */

const CLUTCH_PROFILE_URL = "https://clutch.co/profile/heroic-rankings#reviews";

export const TESTIMONIAL_ASSETS = "/figma/testimonials";
const ASSETS = TESTIMONIAL_ASSETS;

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: "Amazing results! HR is an amazing team made of honest people and amazing experts. They deliver the results they promise!",
    name: "Gianluca Ferruggia",
    role: "General Manager",
    avatarSrc: `${ASSETS}/avatar-1.png`,
    avatarAlt: "Gianluca Ferruggia",
    logoSrc: `${ASSETS}/logo-designrush.png`,
    logoAlt: "DesignRush",
    logoWidth: 115,
    logoHeight: 27,
  },
  {
    quote: "They are very knowledgeable about SEO, and have a very methodical approach. Their work is high quality, and it's been enjoyable to work and interact with them.",
    name: "Ryan O'Connor",
    role: "Marketing Operations Manager",
    avatarSrc: `${ASSETS}/avatar-ryan-oconnor.jpg`,
    avatarAlt: "Ryan O'Connor",
    logoSrc: `${ASSETS}/logo-cirrus-insight.svg`,
    logoAlt: "Cirrus Insight",
    logoWidth: 124,
    logoHeight: 19,
    rating: 5,
    sourceUrl: CLUTCH_PROFILE_URL,
  },
  {
    quote:
      "HeroicRanking is our secret weapon! Their technical SEO know-how and link-building skills boosted rankings and brought more traffic to every project we collaborated on. They know their stuff and are great to work with. Highly recommend!",
    name: "Momcilo Popov",
    role: "Co-Founder",
    avatarSrc: `${ASSETS}/avatar-2.png`,
    avatarAlt: "Momcilo Popov",
    logoSrc: `${ASSETS}/logo-bcms.png`,
    logoAlt: "bcms",
    logoWidth: 110,
    logoHeight: 35,
  },
  {
    quote: "Heroic Rankings is a great cultural fit and delivers good work.",
    name: "Tal Braiman",
    role: "Marketing Strategist",
    avatarSrc: `${ASSETS}/avatar-tal-braiman.jpg`,
    avatarAlt: "Tal Braiman",
    logoSrc: `${ASSETS}/logo-support-adventure.png`,
    logoAlt: "Support Adventure",
    logoWidth: 117,
    logoHeight: 44,
    rating: 5,
    sourceUrl: CLUTCH_PROFILE_URL,
  },
  {
    quote: "Best in the game regarding off-page SEO and the team that is enjoyable to work with over and over again! Looking forward to more of our successes!",
    name: "Nik Vujic",
    role: "Founder",
    avatarSrc: `${ASSETS}/avatar-3.png`,
    avatarAlt: "Nik Vujic",
    logoSrc: `${ASSETS}/logo-gsd.png`,
    logoAlt: "GSD",
    logoWidth: 90,
    logoHeight: 31,
  },
  {
    quote: "They don't just promise results; they stake revenue on it. Every decision was backed by real numbers, not guesswork.",
    name: "Filip Radotic",
    role: "Head of Marketing",
    avatarSrc: `${ASSETS}/avatar-filip-radotic.jpg`,
    avatarAlt: "Filip Radotic",
    logoSrc: `${ASSETS}/logo-syncspider.png`,
    logoAlt: "SyncSpider",
    logoWidth: 124,
    logoHeight: 35,
    rating: 5,
    sourceUrl: CLUTCH_PROFILE_URL,
  },
  {
    quote: "Heroic Rankings is a great team that we can trust.",
    name: "Dragan Stanojevic",
    role: "CEO",
    avatarSrc: `${ASSETS}/avatar-dragan-stanojevic.jpg`,
    avatarAlt: "Dragan Stanojevic",
    logoSrc: `${ASSETS}/logo-my-baskets.png`,
    logoAlt: "My Baskets",
    logoWidth: 120,
    logoHeight: 38,
    rating: 4.5,
    sourceUrl: CLUTCH_PROFILE_URL,
  },
];
