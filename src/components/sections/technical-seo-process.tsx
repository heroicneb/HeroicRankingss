import Image from "next/image";

import { ProcessStepSwitcher } from "@/components/sections/process-step-switcher";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { buildProcessSteps } from "@/data/process-steps";

const PROCESS_STEPS = buildProcessSteps([
  "Contact us to schedule a consultation and learn how our technical SEO services can transform your online presence.",
  "The first call helps us understand your site's current technical health, business goals, and the infrastructure issues blocking growth.",
  "We collect crawl data, indexation signals, page templates, and platform details so every technical recommendation is scoped accurately.",
  "We align effort and budget with your highest-impact technical priorities to deliver measurable wins as quickly as possible.",
  "You receive a clear technical SEO roadmap with actionable fixes, implementation order, and expected ranking and performance outcomes.",
]);

export function TechnicalSeoProcess() {
  return (
    <section className="mt-[60px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[20px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:mt-[120px] lg:rounded-[40px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]">
      <h3 className="type-h3 max-w-[1024px] pb-[4px] text-center leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
        Ready to start optimizing your{" "}
        <GradientText className="gradient-text-brand-about-us-process-title">
          website&apos;s technical performance
        </GradientText>{" "}
        and{" "}
        <GradientText className="gradient-text-brand-about-us-process-title">
          search engine rankings
        </GradientText>
        ? The Fastest and{" "}
        <GradientText className="gradient-text-brand-about-us-process-title">
          Most Effective to Get Started!
        </GradientText>
      </h3>

      <div className="mt-[20px] lg:mt-[30px]">
        <ProcessStepSwitcher
          steps={PROCESS_STEPS}
          descriptionClassName="type-paragraph mt-[39px] max-w-[600px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
          mutedPillClassName="type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] px-[14px] py-[6px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)] transition-colors hover:text-[var(--color-hr-dark)] dark:hover:text-[var(--color-text-inverse)]"
          rowClassName="flex flex-wrap items-center gap-[10px] pb-1 xl:flex-nowrap"
        />
      </div>

      <AppLink
        className="type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-10 lg:w-[222px]"
        href="/contact"
        motionPreset="none"
      >
        Book a Discovery Call
        <Image
          alt=""
          aria-hidden
          className="size-[10px]"
          height={10}
          src="/technical-seo/5b5f57ba-9e76-4628-b0ab-75080e2575b3.svg"
          width={10}
        />
      </AppLink>
    </section>
  );
}
