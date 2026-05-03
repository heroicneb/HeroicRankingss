import { getFaqItemsByService } from "@/lib/sanity-data";
import SeoServicesPage from "@/components/pages/seo-services/seo-services-page";

export { metadata } from "@/components/pages/seo-services/seo-services-page";

export default async function SeoServicesRoute() {
  const faqItems = await getFaqItemsByService("seo-services").catch(() => []);
  return <SeoServicesPage cmsFaqItems={faqItems} />;
}
