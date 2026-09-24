import type { SchemaTypeDefinition } from "sanity";

import { caseStudy } from "./documents/caseStudy";
import { contactPage } from "./documents/contactPage";
import { faqItem } from "./documents/faqItem";
import { legalPage } from "./documents/legalPage";
import { linkBuildingPage } from "./documents/linkBuildingPage";
import { partnerLogo } from "./documents/partnerLogo";
import { partnershipPage } from "./documents/partnershipPage";
import { podcastEpisode } from "./documents/podcastEpisode";
import { post } from "./documents/post";
import { redditMarketingPage } from "./documents/redditMarketingPage";
import { seoServicePage } from "./documents/seoServicePage";
import { siteSettings } from "./documents/siteSettings";
import { teamMember } from "./documents/teamMember";
import { testimonial } from "./documents/testimonial";
import { gradientHeading } from "./objects/gradientHeading";
import { portableText } from "./objects/portableText";
import { seo } from "./objects/seo";
import { simpleText } from "./objects/simpleText";
import { socialLink } from "./objects/socialLink";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    siteSettings,
    post,
    seoServicePage,
    partnershipPage,
    linkBuildingPage,
    redditMarketingPage,
    contactPage,
    legalPage,
    caseStudy,
    testimonial,
    teamMember,
    faqItem,
    partnerLogo,
    podcastEpisode,
    // Objects
    portableText,
    gradientHeading,
    simpleText,
    seo,
    socialLink,
  ],
};
