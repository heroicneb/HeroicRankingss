import { getFaqItemsByService } from "@/lib/sanity-data";
import KeywordStrategyPage from "@/components/pages/keyword-strategy/keyword-strategy-page";

export { metadata } from "@/components/pages/keyword-strategy/keyword-strategy-page";

export default async function KeywordStrategyRoute() {
  const faqItems = await getFaqItemsByService("keyword-strategy").catch(
    () => [],
  );
  return <KeywordStrategyPage cmsFaqItems={faqItems} />;
}
