import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { SectionLabel } from "@/components/ui/section-label";
import type { EnhancedCaseStudy } from "@/data/case-study-details";

interface CaseStudyDetailPageProps {
  data: EnhancedCaseStudy;
}

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

function HeroSection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="pb-[80px] pt-[109px]" id="case-study-hero">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <AppLink
          className="inline-flex min-h-[44px] items-center text-[16px] font-medium text-[var(--color-hr-grey)] underline underline-offset-4 hover:text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] dark:hover:text-[var(--color-text-inverse)]"
          href="/case-studies"
        >
          Back to Case Studies
        </AppLink>

        <h1 className="mt-8 w-full max-w-[900px] text-[42px] font-normal leading-[52px] tracking-[-0.84px] sm:text-[52px] sm:leading-[66px] xl:text-[62px] xl:leading-[80px]">
          <GradientText>{data.heroTitle}</GradientText>
        </h1>

        <p className="mt-6 w-full max-w-[760px] text-[18px] font-normal leading-[28px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          {data.heroSubtitle}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {data.heroMetrics.map((metric) => (
            <div
              className="rounded-[var(--radius-panel)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-6 py-5 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
              key={metric.label}
            >
              <p className="text-[48px] font-extrabold leading-none tracking-[-0.96px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] xl:text-[80px] xl:tracking-[-1.6px]">
                {metric.value}
              </p>
              <p className="mt-2 text-[16px] font-normal leading-[22px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Case Overview Section
// ---------------------------------------------------------------------------

function OverviewSection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="py-[80px]" id="case-study-overview">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <SectionLabel>/  Case Overview  /</SectionLabel>

        <h2 className="mt-5 w-full max-w-[800px] text-[36px] font-normal leading-[46px] tracking-[-0.72px] sm:text-[44px] sm:leading-[56px] xl:text-[52px] xl:leading-[66px]">
          <GradientText>{data.overviewTitle}</GradientText>
        </h2>

        <div className="mt-8 w-full max-w-[860px] space-y-5">
          {data.overviewParagraphs.map((paragraph, idx) => (
            <p
              className="text-[18px] font-normal leading-[28px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
              key={idx}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Objectives & Challenges Section
// ---------------------------------------------------------------------------

function ChallengesSection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="py-[80px]" id="case-study-challenges">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <SectionLabel>/  Objective &amp; Challenges  /</SectionLabel>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {data.challengeCards.map((card) => (
            <article
              className="rounded-[var(--radius-panel)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-6 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
              key={card.number}
            >
              <p className="text-[40px] font-normal leading-[40px] tracking-[-0.8px] text-[var(--color-hr-light-grey)] dark:text-[var(--color-text-inverse-30)]">
                {card.number}
              </p>
              <h3 className="type-h3 mt-4 font-normal text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {card.title}
              </h3>
              <p className="type-paragraph mt-3 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Strategy (Six Pillars) Section
// ---------------------------------------------------------------------------

function StrategySection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="py-[80px]" id="case-study-strategy">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <SectionLabel>/  Our Proven Strategy  /</SectionLabel>

        <h2 className="mt-5 w-full max-w-[700px] text-[36px] font-normal leading-[46px] tracking-[-0.72px] sm:text-[44px] sm:leading-[56px] xl:text-[52px] xl:leading-[66px]">
          <GradientText>{data.strategyTitle}</GradientText>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.strategyPillars.map((pillar, idx) => (
            <article
              className="rounded-[var(--radius-panel)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-6 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
              key={idx}
            >
              <h3 className="type-h3 font-normal text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {pillar.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {pillar.bullets.map((bullet, bIdx) => (
                  <li className="type-paragraph flex gap-3 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]" key={bIdx}>
                    <span aria-hidden className="mt-[7px] size-[5px] shrink-0 rounded-full bg-[var(--color-hr-accent)]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Execution Timeline Section
// ---------------------------------------------------------------------------

function TimelineSection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="py-[80px]" id="case-study-timeline">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <SectionLabel>/  Execution  /</SectionLabel>

        <h2 className="mt-5 w-full max-w-[700px] text-[36px] font-normal leading-[46px] tracking-[-0.72px] sm:text-[44px] sm:leading-[56px] xl:text-[52px] xl:leading-[66px]">
          <GradientText>{data.timelineTitle}</GradientText>
        </h2>

        <ol className="mt-10 space-y-0">
          {data.timelineSteps.map((step, idx) => (
            <li
              className="relative flex gap-6 pb-10 last:pb-0"
              key={step.number}
            >
              {/* Vertical connector line */}
              {idx < data.timelineSteps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-[19px] top-[40px] h-[calc(100%-8px)] w-[2px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)]"
                />
              ) : null}

              {/* Step number circle */}
              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-hr-accent)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
                <span className="text-[12px] font-medium text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {step.number}
                </span>
              </div>

              <div className="pt-2">
                <h3 className="type-h3 font-normal text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {step.title}
                </h3>
                <p className="type-paragraph mt-2 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Performance Metrics Section
// ---------------------------------------------------------------------------

function MetricsSection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="py-[80px]" id="case-study-metrics">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <SectionLabel>/  Performance Metrics  /</SectionLabel>

        <h2 className="mt-5 w-full max-w-[700px] text-[36px] font-normal leading-[46px] tracking-[-0.72px] sm:text-[44px] sm:leading-[56px] xl:text-[52px] xl:leading-[66px]">
          <GradientText>{data.metricsTitle}</GradientText>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {data.performanceMetrics.map((metric) => (
            <div
              className="rounded-[var(--radius-panel)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-5 py-6 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
              key={metric.label}
            >
              <p className="text-[48px] font-extrabold leading-none tracking-[-0.96px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] xl:text-[80px] xl:tracking-[-1.6px]">
                {metric.value}
              </p>
              <p className="type-h3 mt-2 font-normal text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {metric.label}
              </p>
              {metric.description ? (
                <p className="mt-1 text-[13px] font-normal leading-[18px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {metric.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Growth chart placeholder */}
        <div className="mt-12">
          <h3 className="text-[28px] font-normal leading-[36px] tracking-[-0.56px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] sm:text-[32px] sm:leading-[40px]">
            {data.growthChartTitle}
          </h3>
          <div className="mt-5 flex h-[280px] items-center justify-center rounded-[var(--radius-panel)] border border-dashed border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
            <p className="text-[16px] font-normal text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
              Interactive growth chart — coming soon
            </p>
          </div>
        </div>

        {/* Analytics screenshots placeholder */}
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3">
          {["GSC Impressions", "GSC Clicks", "GA4 Sessions", "Revenue Attribution", "Keyword Rankings", "Backlink Growth"].map(
            (label) => (
              <div
                className="flex h-[160px] flex-col items-start justify-end rounded-[var(--radius-panel)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] p-4 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
                key={label}
              >
                <span className="rounded-full bg-[var(--color-hr-pure-white)] px-3 py-1 text-[13px] font-medium text-[var(--color-hr-dark)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]">
                  {label}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Before vs After Section
// ---------------------------------------------------------------------------

function BeforeAfterSection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="py-[80px]" id="case-study-before-after">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <SectionLabel>/  Real Results  /</SectionLabel>

        <h2 className="mt-5 w-full max-w-[700px] text-[36px] font-normal leading-[46px] tracking-[-0.72px] sm:text-[44px] sm:leading-[56px] xl:text-[52px] xl:leading-[66px]">
          <GradientText>{data.beforeAfterTitle}</GradientText>
        </h2>

        <div className="mt-10 w-full overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr>
                <th className="w-1/2 border-b border-[var(--color-hr-light-grey)] pb-4 pr-4 text-left text-[15px] font-medium uppercase tracking-[0.06em] text-[var(--color-hr-grey)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse-60)]">
                  Metric
                </th>
                <th className="border-b border-[var(--color-hr-light-grey)] pb-4 pr-4 text-left text-[15px] font-medium uppercase tracking-[0.06em] text-[var(--color-hr-grey)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse-60)]">
                  Before
                </th>
                <th className="border-b border-[var(--color-hr-light-grey)] pb-4 text-left text-[15px] font-medium uppercase tracking-[0.06em] text-[var(--color-hr-accent)]">
                  After
                </th>
              </tr>
            </thead>
            <tbody>
              {data.beforeAfterRows.map((row, idx) => (
                <tr
                  className="border-b border-[var(--color-hr-light-grey)] last:border-0 dark:border-[var(--color-border-inverse-10)]"
                  key={idx}
                >
                  <td className="py-4 pr-4 text-[16px] font-normal text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {row.metric}
                  </td>
                  <td className="py-4 pr-4 text-[16px] font-normal text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                    {row.before}
                  </td>
                  <td className="py-4 text-[16px] font-medium text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {row.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Conclusion Section
// ---------------------------------------------------------------------------

function ConclusionSection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="py-[80px]" id="case-study-conclusion">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <h2 className="text-[36px] font-normal leading-[46px] tracking-[-0.72px] sm:text-[44px] sm:leading-[56px] xl:text-[52px] xl:leading-[66px]">
          <GradientText>{data.conclusionTitle}</GradientText>
        </h2>

        <div className="mt-8 w-full max-w-[860px] space-y-5">
          {data.conclusionParagraphs.map((paragraph, idx) => (
            <p
              className="text-[18px] font-normal leading-[28px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
              key={idx}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer CTA Section
// ---------------------------------------------------------------------------

function CtaSection({ data }: { data: EnhancedCaseStudy }) {
  return (
    <section className="py-[80px]" id="case-study-cta">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <div className="surface-radial relative overflow-hidden rounded-[var(--radius-card)] px-8 py-16 text-center sm:px-12 xl:px-20">
          <h2 className="text-[32px] font-normal leading-[40px] tracking-[-0.64px] text-[var(--color-text-inverse)] sm:text-[40px] sm:leading-[52px] xl:text-[52px] xl:leading-[66px]">
            {data.ctaHeading}
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <AppLink
              className="inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-[linear-gradient(110deg,var(--color-hr-gradient-start),var(--color-hr-gradient-end))] px-5 text-[16px] font-medium text-[var(--color-hr-pure-white)] hover:opacity-90 focus-visible:ring-offset-[var(--color-bg-dark)]"
              href={data.ctaPrimary.href}
            >
              {data.ctaPrimary.label}
            </AppLink>

            <AppLink
              className="inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border-inverse-20)] bg-transparent px-5 text-[16px] font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-surface-inverse-10)] focus-visible:ring-offset-[var(--color-bg-dark)]"
              href={data.ctaSecondary.href}
            >
              {data.ctaSecondary.label}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

function SectionDivider() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
      <hr className="border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------

export function CaseStudyDetailPage({ data }: CaseStudyDetailPageProps) {
  return (
    <div className="route-motion-frame">
      <HeroSection data={data} />
      <SectionDivider />
      <OverviewSection data={data} />
      <SectionDivider />
      <ChallengesSection data={data} />
      <SectionDivider />
      <StrategySection data={data} />
      <SectionDivider />
      <TimelineSection data={data} />
      <SectionDivider />
      <MetricsSection data={data} />
      <SectionDivider />
      <BeforeAfterSection data={data} />
      <SectionDivider />
      <ConclusionSection data={data} />
      <CtaSection data={data} />
    </div>
  );
}
