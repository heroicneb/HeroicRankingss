import { ProcessStepSwitcher } from "@/components/sections/process-step-switcher";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { buildProcessSteps, DISCOVERY_CALL_LABEL } from "@/data/process-steps";

const PROCESS_STEPS = buildProcessSteps(
  [
    "After you get in touch, we\u2019ll arrange a call that fits your schedule, wherever you\u2019re based.",
    "The initial call aims to learn as much as possible about you, your company, and your marketing needs. What is your vision? What are your goals and aspirations? What would you love to achieve but isn\u2019t working for whatever reason?",
    "Think of it as a Q&A session with our expert, where we extract all the info related to your brand and project goals so we all get a full picture about the potential achievement that will be done. This is when you share all the knowledge that you have. We strive to build long-lasting partner relationships with our clients, so we need to know how much of our help you need. Do you prefer being involved in the work, or do you want us to take care of everything (under your approval)?",
    "What comes next is a discussion about your budget. Based on all the information we discovered, we will advise you on the most optimal marketing strategy for your company and what we think are the highest priorities that can bring the most effective results where we think you should focus your priorities.",
    "We\u2019ll make a plan, define deliverables, and forecast revenue so you have peace of mind every step of the way.",
  ],
  { 1: DISCOVERY_CALL_LABEL },
);

export function AboutUsProcess() {
  return (
    <section
      className="mt-[60px] px-[15px] pb-[60px] lg:mt-[92px] lg:px-[70px] lg:pb-[70px]"
      id="about-us-process"
    >
      <div className="lg:hidden">
        <div className="rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[20px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
          <h3 className="type-h3 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            The Fastest and{" "}
            <GradientText className="gradient-text-brand-about-us-process-title">
              Most Effective
            </GradientText>{" "}
            to Get Started
          </h3>

          <div className="mt-[30px] max-w-full">
            <ProcessStepSwitcher
              mobileDotClassName="size-[6px]"
              mobileDotsRowClassName="mt-5 flex items-center justify-center gap-[3px]"
              steps={PROCESS_STEPS}
            />
          </div>

          <AppLink
            className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
            href="/contact"
            motionPreset="none"
          >
            Book a Discovery Call
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[30px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
          <h3 className="type-h3 text-left text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            The Fastest and{" "}
            <GradientText className="gradient-text-brand-about-us-process-title">
              Most Effective
            </GradientText>{" "}
            to Get Started
          </h3>

          <div className="mt-[30px] max-w-full">
            <ProcessStepSwitcher
              descriptionClassName="mt-[39px]"
              steps={PROCESS_STEPS}
            />
          </div>

          <AppLink
            className="type-cta motion-interactive motion-interactive-press mt-10 inline-flex h-[45px] w-[222px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
            href="/contact"
            motionPreset="none"
          >
            Book a Discovery Call
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>
      </div>
    </section>
  );
}
