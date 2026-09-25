import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

import { CaseStudyBeforeAfter } from "./parts/CaseStudyBeforeAfter";
import { CaseStudyChallenges } from "./parts/CaseStudyChallenges";
import { CaseStudyConclusion } from "./parts/CaseStudyConclusion";
import { CaseStudyCtaFooter } from "./parts/CaseStudyCtaFooter";
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
 * Case study detail page — the template from Figma `2255:878` (desktop),
 * `2255:1899` (dark) and `2255:1378` (mobile).
 *
 * Every section reads one block of the Sanity case study document and
 * returns `null` when that block is empty, so a new case study only shows
 * the sections its editor filled in. Duplicate a document in the Studio to
 * start a new case study from this template.
 */
export function CaseStudyDetailPage({ caseStudy }: CaseStudyDetailPageProps) {
  return (
    <>
      <CaseStudyHero data={caseStudy} />
      <CaseStudyHeroPanel data={caseStudy} />
      <CaseStudyOverview data={caseStudy.caseOverview} />
      <CaseStudyChallenges data={caseStudy.objectiveChallenges} />
      <CaseStudyPillars data={caseStudy.strategyPillars} intro={caseStudy.strategyIntro} />
      <CaseStudyJourney data={caseStudy.journeyTimeline} />
      <CaseStudyNumbers chart={caseStudy.growthChart} data={caseStudy.numbersThatMatter} />
      <CaseStudyProofData data={caseStudy.proofData} />
      <CaseStudyBeforeAfter afterLabel={caseStudy.beforeAfter?.afterLabel ?? undefined} beforeLabel={caseStudy.beforeAfter?.beforeLabel ?? undefined} data={caseStudy.beforeAfter} />
      <CaseStudyConclusion data={caseStudy.conclusion} />
      <CaseStudyCtaFooter data={caseStudy.ctaFooter} />
    </>
  );
}
