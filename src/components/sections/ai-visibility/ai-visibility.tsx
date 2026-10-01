import { CountUp } from "@/components/motion/count-up";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/components/pages/home/home-content";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";

import { AnswerEngine } from "./AnswerEngine";
import { MODEL_MARKS, type ModelId } from "./model-marks";
import { ModelMark } from "./ModelMark";

/*
 * "/ AI Visibility / Ranked on Google. Cited by AI." — the homepage section
 * that explains how answer engines pick who to recommend and which of our
 * services earn each source. Dark full-bleed panel like the stats block:
 * header, the Answer Engine simulator, three pillars, real proof numbers, CTA.
 */

const MODEL_ROW: ModelId[] = ["chatgpt", "gemini", "perplexity", "claude", "copilot"];

interface AiVisibilityProps {
  content?: HomeContent["aiVisibility"];
}

export function AiVisibility({ content = DEFAULT_HOME_CONTENT.aiVisibility }: AiVisibilityProps) {
  return (
    <section className="pt-[60px] lg:pt-[120px]" id="ai-visibility">
      <div className="surface-rect-5 mx-[5px] rounded-[30px] py-[60px] text-[var(--color-hr-pure-white)] md:mx-[10px] lg:rounded-[var(--radius-card)] lg:py-[100px]">
        <Container>
          <div className="grid gap-[24px] lg:grid-cols-[1fr_minmax(0,520px)] lg:items-end lg:gap-[60px]" data-reveal>
            <div className="mx-auto w-full max-w-[350px] text-center lg:mx-0 lg:max-w-[560px] lg:text-left">
              <SectionLabel>{content.label}</SectionLabel>
              <h2 className="type-h2 mt-5 text-[var(--color-hr-pure-white)]">
                <GradientHeading highlightClassName="gradient-text-brand-services" segments={content.heading} />
              </h2>
            </div>
            <div className="mx-auto w-full max-w-[350px] text-center lg:mx-0 lg:max-w-none lg:text-left">
              <p className="type-paragraph text-[var(--color-text-inverse-60)]">{content.intro}</p>
              <ul aria-label="Answer engines we optimise for" className="mt-[18px] flex flex-wrap items-center justify-center gap-[8px] lg:justify-start">
                {MODEL_ROW.map((id) => (
                  <li className="inline-flex items-center gap-[8px] rounded-full border border-[var(--color-border-inverse-15)] px-[12px] py-[6px] text-[13px] leading-[16px] text-[var(--color-text-inverse-95)]" key={id}>
                    <ModelMark className="size-[14px]" id={id} />
                    {MODEL_MARKS[id].label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-[40px] lg:mt-[60px]">
            <AnswerEngine disclaimer={content.disclaimer} scenarios={content.scenarios} sources={content.sources} />
          </div>

          <div className="mt-[40px] grid gap-[14px] lg:mt-[60px] lg:grid-cols-3 lg:gap-[20px]" data-reveal-stagger>
            {content.pillars.map((pillar, index) => (
              <article className="flex flex-col rounded-[30px] border border-[var(--color-border-inverse-10)] bg-[var(--color-surface-inverse-10)] p-[24px] lg:p-[30px]" key={pillar.title}>
                <span className="text-[13px] uppercase tracking-[0.08em] text-[var(--color-text-inverse-50)]">0{index + 1}</span>
                <h3 className="type-h3 mt-[12px] text-[var(--color-hr-pure-white)]">{pillar.title}</h3>
                <p className="type-paragraph mt-[10px] text-[var(--color-text-inverse-60)]">{pillar.body}</p>
                <AppLink className="motion-interactive mt-auto inline-flex items-center gap-2 pt-[20px] text-[15px] text-[var(--color-hr-pure-white)] underline decoration-[var(--color-hr-accent)] underline-offset-4" href={pillar.href} motionPreset="none">
                  {pillar.ctaLabel}
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </article>
            ))}
          </div>

          <div className="mt-[40px] rounded-[30px] border border-[var(--color-border-inverse-10)] p-[24px] lg:mt-[60px] lg:p-[30px]" data-reveal>
            <div className="grid grid-cols-2 gap-[14px] lg:grid-cols-4 lg:gap-[20px]">
              {content.proof.map((stat) => (
                <div key={stat.label}>
                  <p className="gradient-text-brand gradient-text-brand-services text-[36px] font-normal leading-[1.1] tracking-[-0.72px] lg:text-[48px] lg:tracking-[-0.96px]">
                    <CountUp prefix={stat.prefix} suffix={stat.suffix} value={stat.value} />
                  </p>
                  <p className="mt-[6px] text-[14px] leading-[20px] text-[var(--color-text-inverse-60)] lg:text-[16px]">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-[20px] text-[14px] leading-[20px] text-[var(--color-text-inverse-50)]">
              {content.proofNote}{" "}
              <AppLink className="text-[var(--color-hr-pure-white)] underline decoration-[var(--color-hr-accent)] underline-offset-4" href={content.proofHref} motionPreset="none">
                Read the case study
              </AppLink>
            </p>
          </div>

          <div className="mt-[40px] flex justify-center lg:mt-[50px]">
            <AppLink
              className="type-cta motion-interactive motion-interactive-press inline-flex h-[51px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-pure-white)] hover:bg-[var(--color-surface-inverse-10)] lg:w-auto lg:max-w-none lg:px-7"
              href={content.ctaUrl}
              motionPreset="none"
            >
              {content.ctaLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </Container>
      </div>
    </section>
  );
}
