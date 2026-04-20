import { getFaqItemsByService, getServicePage } from "@/lib/sanity-data";
import { CmsServicePage } from "@/components/pages/shared/cms-service-page";
import ContentCreationPage from "@/components/pages/content-creation/content-creation-page";

export { metadata } from "@/components/pages/content-creation/content-creation-page";

export default async function ContentCreationRoute() {
  const [faqItems, servicePage] = await Promise.all([
    getFaqItemsByService("content-creation").catch(() => []),
    getServicePage("content-creation").catch(() => null),
  ]);

  if (servicePage?.heroImageUrl) {
    return <CmsServicePage fallbackFaqItems={faqItems} servicePage={servicePage} />;
  }

  return <ContentCreationPage cmsFaqItems={faqItems} />;
}
