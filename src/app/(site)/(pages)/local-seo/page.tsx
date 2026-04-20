import { getFaqItemsByService, getServicePage } from "@/lib/sanity-data";
import { CmsServicePage } from "@/components/pages/shared/cms-service-page";
import LocalSeoPage from "@/components/pages/local-seo/local-seo-page";

export { metadata } from "@/components/pages/local-seo/local-seo-page";

export default async function LocalSeoRoute() {
  const [faqItems, servicePage] = await Promise.all([
    getFaqItemsByService("local-seo").catch(() => []),
    getServicePage("local-seo").catch(() => null),
  ]);

  if (servicePage?.heroImageUrl) {
    return <CmsServicePage fallbackFaqItems={faqItems} servicePage={servicePage} />;
  }

  return <LocalSeoPage cmsFaqItems={faqItems} />;
}
