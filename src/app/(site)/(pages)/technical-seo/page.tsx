import { getFaqItemsByService } from "@/lib/sanity-data";
import TechnicalSeoPage from "@/components/pages/technical-seo/technical-seo-page";

export { metadata } from "@/components/pages/technical-seo/technical-seo-page";

export default async function TechnicalSeoRoute() {
  const faqItems = await getFaqItemsByService("technical-seo").catch(() => []);
  return <TechnicalSeoPage cmsFaqItems={faqItems} />;
}
