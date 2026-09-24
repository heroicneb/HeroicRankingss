import type { CSSProperties } from "react";
import Image from "next/image";

import { AnimatedWords } from "@/components/motion/animated-words";
import { HeroVideoOverlay } from "@/components/sections/hero-video-overlay";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";

export function Hero() {
  return (
    <section className="pb-0 pt-[60px] lg:pt-[104px]">
      <Container>
        <div className="mx-auto flex max-w-[857px] flex-col items-center text-center">
          <h1 className="type-h1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            <AnimatedWords text="Others are not better," />
            <br />
            <AnimatedWords startIndex={4} text="they're just easier to find." />
          </h1>
          <p className="hero-fade type-paragraph mx-auto mt-[30px] w-full max-w-[342px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mt-[17px] lg:max-w-[670px]" style={{ "--d": "520ms" } as CSSProperties}>
            <span className="block">
              If your audience can&apos;t find you, they&apos;ll choose the
              competitor who shows up.
            </span>
            <span className="mt-5 block">
              Search has changed. Your audience now finds answers through
              Google, AI overviews, and LLM recommendations. If you&apos;re not
              visible across all of them, you&apos;re losing ground. We help
              businesses dominate every search surface &mdash; backed by a
              212.6% growth rate and 100% client retention.
            </span>
          </p>
          <AppLink
            className="hero-fade type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-[29px] lg:w-auto lg:max-w-none lg:px-6"
            href="/contact"
            motionPreset="none"
            style={{ "--d": "700ms" } as CSSProperties}
          >
            Get Found Everywhere
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>
      </Container>

      <div className="mx-auto mt-[60px] max-w-[1440px] px-[5px] md:px-[10px] lg:mt-[116px]">
        <div className="hero-frame relative h-[180px] overflow-hidden rounded-[30px] sm:h-[300px] md:h-[380px] lg:h-[480px] lg:rounded-[var(--radius-card)]">
          {/* WHY: the still is the video's first frame, so it stays the LCP asset and the
              only thing phones and reduced-motion visitors see; on desktop the clip plays
              once over it on hover. */}
          <Image
            alt="Classical statue representing enduring digital presence"
            className="pointer-events-none object-cover"
            fetchPriority="high"
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 1440px, 100vw"
            src="/hero-face-poster.webp"
          />
          <HeroVideoOverlay src="/hero-face-loop.mp4" />
        </div>
      </div>
    </section>
  );
}
