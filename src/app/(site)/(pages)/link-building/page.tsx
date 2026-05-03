import { getFaqItemsByService } from "@/lib/sanity-data";
import LinkBuildingPage from "@/components/pages/link-building/link-building-page";

export { metadata } from "@/components/pages/link-building/link-building-page";

export default async function LinkBuildingRoute() {
  const faqItems = await getFaqItemsByService("link-building").catch(() => []);
  return <LinkBuildingPage cmsFaqItems={faqItems} />;
}
