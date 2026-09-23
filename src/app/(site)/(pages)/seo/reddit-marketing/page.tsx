import { getFaqItemsByService } from "@/lib/sanity-data";
import RedditMarketingPage from "@/components/pages/reddit-marketing/reddit-marketing-page";

export { metadata } from "@/components/pages/reddit-marketing/reddit-marketing-page";

export default async function RedditMarketingRoute() {
  const faqItems = await getFaqItemsByService("reddit-marketing").catch(
    () => [],
  );
  return <RedditMarketingPage cmsFaqItems={faqItems} />;
}
