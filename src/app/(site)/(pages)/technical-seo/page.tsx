import { getFaqItemsByService, getServicePage } from "@/lib/sanity-data";
import { CmsServicePage } from "@/components/pages/shared/cms-service-page";
import TechnicalSeoPage from "@/components/pages/technical-seo/technical-seo-page";

export { metadata } from "@/components/pages/technical-seo/technical-seo-page";

export default async function TechnicalSeoRoute() {
  const [faqItems, servicePage] = await Promise.all([
    getFaqItemsByService("technical-seo").catch(() => []),
    getServicePage("technical-seo").catch(() => null),
  ]);

  if (servicePage?.heroImageUrl) {
    return <CmsServicePage fallbackFaqItems={faqItems} servicePage={servicePage} />;
  }

  return <TechnicalSeoPage cmsFaqItems={faqItems} />;
}
