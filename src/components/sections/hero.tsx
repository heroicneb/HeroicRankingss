import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";

export function Hero() {
  return (
    <section className="pb-0 pt-[60px] lg:pt-[104px]">
      <Container>
        <div className="mx-auto flex max-w-[857px] flex-col items-center text-center">
          <h1 className="type-h1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Others are not better, they&apos;re just easier to find.
          </h1>
          <p className="type-paragraph mx-auto mt-[30px] w-full max-w-[342px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mt-[17px] lg:max-w-[670px] lg:min-h-[116px]">
            <span className="block">
              If your audience can&apos;t find you, they&apos;ll choose the
              competitor who ranks.
            </span>
            <span className="mt-5 block">
              We help businesses scale through a proven SEO framework that
              adapts across industries. Backed by a 212.6% growth rate and 100%
              client retention in our most recent year, our focus is simple:
              sustained visibility that converts.
            </span>
          </p>
          <AppLink
            className="type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-[29px] lg:w-[198px] lg:max-w-none"
            href="/contact"
            motionPreset="none"
          >
            Get Started Today
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>
      </Container>

      <div className="mx-auto mt-[5px] max-w-[1440px] px-[5px] md:px-[10px] lg:mt-[116px]">
        <div className="relative h-[180px] overflow-hidden rounded-[30px] sm:h-[300px] md:h-[380px] lg:h-[480px] lg:rounded-[var(--radius-card)]">
          <Image
            alt="Classical statue representing enduring digital presence"
            className="pointer-events-none absolute left-[-52.16%] top-0 h-full w-[210.21%] max-w-none object-cover sm:left-[-22.13%] sm:w-[150.01%]"
            fetchPriority="high"
            fill
            priority
            quality={95}
            sizes="(min-width: 1024px) 1440px, 100vw"
            src="/hero-face.webp"
          />
        </div>
      </div>
    </section>
  );
}
