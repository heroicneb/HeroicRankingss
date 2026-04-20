import { getFaqItemsByService, getServicePage } from "@/lib/sanity-data";
import { CmsServicePage } from "@/components/pages/shared/cms-service-page";
import EcommerceSeoPage from "@/components/pages/ecommerce-seo/ecommerce-seo-page";

export { metadata } from "@/components/pages/ecommerce-seo/ecommerce-seo-page";

export default async function EcommerceSeoRoute() {
  const [faqItems, servicePage] = await Promise.all([
    getFaqItemsByService("ecommerce-seo").catch(() => []),
    getServicePage("ecommerce-seo").catch(() => null),
  ]);

  if (servicePage?.heroImageUrl) {
    return <CmsServicePage fallbackFaqItems={faqItems} servicePage={servicePage} />;
  }

  return <EcommerceSeoPage cmsFaqItems={faqItems} />;
}
