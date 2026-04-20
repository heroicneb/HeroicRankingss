import Image from "next/image";

import { ProcessStepSwitcher } from "@/components/sections/process-step-switcher";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { buildProcessSteps } from "@/data/process-steps";

const PROCESS_STEPS = buildProcessSteps([
  "Contact us to schedule a consultation and learn how our on-page SEO services can transform your online presence.",
  "We start with a focused interview to understand your current rankings, conversion goals, and the blockers impacting on-page performance.",
  "Our team collects and reviews all critical page-level inputs including URLs, templates, keyword clusters, and current metadata signals.",
  "We define scope and budget based on implementation depth, website size, and priority pages to ensure maximum impact from day one.",
  "You receive a practical on-page action roadmap with clear priorities, expected outcomes, and next-step recommendations.",
]);

export function OnPageSeoProcess() {
  return (
    <section className="mt-[60px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[20px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:mt-[120px] lg:rounded-[40px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]">
      <h3 className="type-h3 max-w-[1024px] pb-[4px] text-center leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
        Ready to start{" "}
        <GradientText className="gradient-text-brand-about-us-process-title">
          optimizing your website
        </GradientText>{" "}
        for better search engine rankings and{" "}
        <GradientText className="gradient-text-brand-about-us-process-title">
          user engagement
        </GradientText>
        ? The Fastest and{" "}
        <GradientText className="gradient-text-brand-about-us-process-title">
          Most Effective to Get Started!
        </GradientText>
      </h3>

      <div className="mt-[20px] lg:mt-[30px]">
        <ProcessStepSwitcher
          steps={PROCESS_STEPS}
          descriptionClassName="type-paragraph mt-10 max-w-[600px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
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
          src="/on-page-seo/5382253aa1ca212af36c1a21350400d6bc290a36.svg"
          width={10}
        />
      </AppLink>
    </section>
  );
}
