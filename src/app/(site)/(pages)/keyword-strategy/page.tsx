import { getFaqItemsByService, getServicePage } from "@/lib/sanity-data";
import { CmsServicePage } from "@/components/pages/shared/cms-service-page";
import KeywordStrategyPage from "@/components/pages/keyword-strategy/keyword-strategy-page";

export { metadata } from "@/components/pages/keyword-strategy/keyword-strategy-page";

export default async function KeywordStrategyRoute() {
  const [faqItems, servicePage] = await Promise.all([
    getFaqItemsByService("keyword-strategy").catch(() => []),
    getServicePage("keyword-strategy").catch(() => null),
  ]);

  if (servicePage?.heroImageUrl) {
    return <CmsServicePage fallbackFaqItems={faqItems} servicePage={servicePage} />;
  }

  return <KeywordStrategyPage cmsFaqItems={faqItems} />;
}
