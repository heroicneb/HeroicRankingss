import { getFaqItemsByService, getServicePage } from "@/lib/sanity-data";
import { CmsServicePage } from "@/components/pages/shared/cms-service-page";
import SeoServicesPage from "@/components/pages/seo-services/seo-services-page";

export { metadata } from "@/components/pages/seo-services/seo-services-page";

export default async function SeoServicesRoute() {
  const [faqItems, servicePage] = await Promise.all([
    getFaqItemsByService("seo-services").catch(() => []),
    getServicePage("seo-services").catch(() => null),
  ]);

  if (servicePage?.heroImageUrl) {
    return <CmsServicePage fallbackFaqItems={faqItems} servicePage={servicePage} />;
  }

  return <SeoServicesPage cmsFaqItems={faqItems} />;
}
