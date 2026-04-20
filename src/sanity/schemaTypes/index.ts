import type { SchemaTypeDefinition } from "sanity";

import { caseStudy } from "./documents/caseStudy";
import { contactPage } from "./documents/contactPage";
import { faqItem } from "./documents/faqItem";
import { legalPage } from "./documents/legalPage";
import { partnerLogo } from "./documents/partnerLogo";
import { partnershipPage } from "./documents/partnershipPage";
import { post } from "./documents/post";
import { servicePage } from "./documents/servicePage";
import { siteSettings } from "./documents/siteSettings";
import { teamMember } from "./documents/teamMember";
import { testimonial } from "./documents/testimonial";
import { portableText } from "./objects/portableText";
import { seo } from "./objects/seo";
import { socialLink } from "./objects/socialLink";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    siteSettings,
    post,
    servicePage,
    partnershipPage,
    contactPage,
    legalPage,
    caseStudy,
    testimonial,
    teamMember,
    faqItem,
    partnerLogo,
    // Objects
    portableText,
    seo,
    socialLink,
  ],
};
