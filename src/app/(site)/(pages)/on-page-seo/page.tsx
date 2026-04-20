import { getFaqItemsByService, getServicePage } from "@/lib/sanity-data";
import { CmsServicePage } from "@/components/pages/shared/cms-service-page";
import OnPageSeoPage from "@/components/pages/on-page-seo/on-page-seo-page";

export { metadata } from "@/components/pages/on-page-seo/on-page-seo-page";

export default async function OnPageSeoRoute() {
  const [faqItems, servicePage] = await Promise.all([
    getFaqItemsByService("on-page-seo").catch(() => []),
    getServicePage("on-page-seo").catch(() => null),
  ]);

  if (servicePage?.heroImageUrl) {
    return <CmsServicePage fallbackFaqItems={faqItems} servicePage={servicePage} />;
  }

  return <OnPageSeoPage cmsFaqItems={faqItems} />;
}
