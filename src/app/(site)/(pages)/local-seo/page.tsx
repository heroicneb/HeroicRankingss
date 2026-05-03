import { getFaqItemsByService } from "@/lib/sanity-data";
import LocalSeoPage from "@/components/pages/local-seo/local-seo-page";

export { metadata } from "@/components/pages/local-seo/local-seo-page";

export default async function LocalSeoRoute() {
  const faqItems = await getFaqItemsByService("local-seo").catch(() => []);
  return <LocalSeoPage cmsFaqItems={faqItems} />;
}
