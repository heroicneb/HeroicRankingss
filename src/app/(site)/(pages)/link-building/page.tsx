import { getFaqItemsByService, getServicePage } from "@/lib/sanity-data";
import { CmsServicePage } from "@/components/pages/shared/cms-service-page";
import LinkBuildingPage from "@/components/pages/link-building/link-building-page";

export { metadata } from "@/components/pages/link-building/link-building-page";

export default async function LinkBuildingRoute() {
  const [faqItems, servicePage] = await Promise.all([
    getFaqItemsByService("link-building").catch(() => []),
    getServicePage("link-building").catch(() => null),
  ]);

  if (servicePage?.heroImageUrl) {
    return <CmsServicePage fallbackFaqItems={faqItems} servicePage={servicePage} />;
  }

  return <LinkBuildingPage cmsFaqItems={faqItems} />;
}
