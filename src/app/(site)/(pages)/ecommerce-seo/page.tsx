import { getFaqItemsByService } from "@/lib/sanity-data";
import EcommerceSeoPage from "@/components/pages/ecommerce-seo/ecommerce-seo-page";

export { metadata } from "@/components/pages/ecommerce-seo/ecommerce-seo-page";

export default async function EcommerceSeoRoute() {
  const faqItems = await getFaqItemsByService("ecommerce-seo").catch(() => []);
  return <EcommerceSeoPage cmsFaqItems={faqItems} />;
}
