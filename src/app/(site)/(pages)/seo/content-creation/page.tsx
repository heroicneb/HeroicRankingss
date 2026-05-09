import { getFaqItemsByService } from "@/lib/sanity-data";
import ContentCreationPage from "@/components/pages/content-creation/content-creation-page";

export { metadata } from "@/components/pages/content-creation/content-creation-page";

export default async function ContentCreationRoute() {
  const faqItems = await getFaqItemsByService("content-creation").catch(
    () => [],
  );
  return <ContentCreationPage cmsFaqItems={faqItems} />;
}
