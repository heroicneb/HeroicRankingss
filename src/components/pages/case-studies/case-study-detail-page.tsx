import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

import { CaseStudyBeforeAfter } from "./parts/CaseStudyBeforeAfter";
import { CaseStudyChallenges } from "./parts/CaseStudyChallenges";
import { CaseStudyConclusion } from "./parts/CaseStudyConclusion";
import { CaseStudyCtaFooter } from "./parts/CaseStudyCtaFooter";
import { CaseStudyGrowthChart } from "./parts/CaseStudyGrowthChart";
import { CaseStudyHero } from "./parts/CaseStudyHero";
import { CaseStudyHeroPanel } from "./parts/CaseStudyHeroPanel";
import { CaseStudyJourney } from "./parts/CaseStudyJourney";
import { CaseStudyNumbers } from "./parts/CaseStudyNumbers";
import { CaseStudyOverview } from "./parts/CaseStudyOverview";
import { CaseStudyPillars } from "./parts/CaseStudyPillars";
import { CaseStudyProofData } from "./parts/CaseStudyProofData";

interface CaseStudyDetailPageProps {
  caseStudy: SanityCaseStudyDetail;
}

/**
 * Sanity-driven case study detail page (Figma `2255:878` desktop /
 * `2255:1378` mobile).
 *
 * Composes 12 self-contained sub-components — each renders one Sanity
 * field block in its own `<section>` and returns `null` when the
 * corresponding field is empty. Vertical rhythm comes from the
 * sub-components themselves so missing data collapses without leaving
 * gaps.
 */
export function CaseStudyDetailPage({ caseStudy }: CaseStudyDetailPageProps) {
  return (
    <>
      <CaseStudyHero data={caseStudy} />
      <CaseStudyHeroPanel data={caseStudy} />
      <CaseStudyOverview data={caseStudy.caseOverview} />
      <CaseStudyChallenges data={caseStudy.objectiveChallenges} />
      <CaseStudyPillars data={caseStudy.strategyPillars} />
      <CaseStudyJourney data={caseStudy.journeyTimeline} />
      <CaseStudyNumbers data={caseStudy.numbersThatMatter} />
      <CaseStudyGrowthChart data={caseStudy.growthChart} />
      <CaseStudyProofData data={caseStudy.proofData} />
      <CaseStudyBeforeAfter data={caseStudy.beforeAfter} />
      <CaseStudyConclusion data={caseStudy.conclusion} />
      <CaseStudyCtaFooter data={caseStudy.ctaFooter} />
    </>
  );
}
