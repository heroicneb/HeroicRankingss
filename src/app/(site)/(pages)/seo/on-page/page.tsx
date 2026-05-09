import { getFaqItemsByService } from "@/lib/sanity-data";
import OnPageSeoPage from "@/components/pages/on-page-seo/on-page-seo-page";

export { metadata } from "@/components/pages/on-page-seo/on-page-seo-page";

export default async function OnPageSeoRoute() {
  const faqItems = await getFaqItemsByService("on-page-seo").catch(() => []);
  return <OnPageSeoPage cmsFaqItems={faqItems} />;
}
