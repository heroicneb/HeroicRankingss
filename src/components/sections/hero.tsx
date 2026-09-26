import type { CSSProperties } from "react";
import Image from "next/image";

import { AnimatedWords } from "@/components/motion/animated-words";
import { HeroVideoOverlay } from "@/components/sections/hero-video-overlay";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { DEFAULT_HOME_CONTENT, segmentsText, splitSegments, type HomeContent } from "@/components/pages/home/home-content";

interface HeroProps {
  content?: HomeContent["hero"];
}

export function Hero({ content = DEFAULT_HOME_CONTENT.hero }: HeroProps) {
  // WHY: the word stagger continues across lines, so each line starts where the previous one ended.
  const lineTexts = splitSegments(content.heading).map(segmentsText);
  const lines = lineTexts.map((line, index) => ({
    line,
    startIndex: lineTexts.slice(0, index).reduce((sum, previous) => sum + previous.split(" ").length, 0),
  }));
  const [lead, ...rest] = content.paragraphs;

  return (
    <section className="pb-0 pt-[60px] lg:pt-[104px]">
      <Container>
        <div className="mx-auto flex max-w-[857px] flex-col items-center text-center">
          <h1 className="type-h1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {lines.map(({ line, startIndex }, index) => (
              <span key={`${line}-${index}`}>
                {index > 0 ? <br /> : null}
                <AnimatedWords startIndex={startIndex} text={line} />
              </span>
            ))}
          </h1>
          <p className="hero-fade type-paragraph mx-auto mt-[30px] w-full max-w-[342px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mt-[17px] lg:max-w-[670px]" style={{ "--d": "520ms" } as CSSProperties}>
            <span className="block">{lead}</span>
            {rest.map((paragraph, index) => (
              <span className="mt-5 block" key={`${index}-${paragraph.slice(0, 24)}`}>
                {paragraph}
              </span>
            ))}
          </p>
          <AppLink
            className="hero-fade type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-[29px] lg:w-auto lg:max-w-none lg:px-6"
            href={content.ctaUrl}
            motionPreset="none"
            style={{ "--d": "700ms" } as CSSProperties}
          >
            {content.ctaLabel}
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>
      </Container>

      <div className="mx-auto mt-[60px] max-w-[1440px] px-[5px] md:px-[10px] lg:mt-[116px]">
        <div className="hero-frame relative h-[180px] overflow-hidden rounded-[30px] sm:h-[300px] md:h-[380px] lg:h-[480px] lg:rounded-[var(--radius-card)]">
          {/* WHY: file names carry a version because image caches key by URL. The still is the video's first frame, so it stays the LCP asset and the
              only thing phones and reduced-motion visitors see; on desktop the clip plays
              once over it on hover. */}
          <Image
            alt="Classical statue representing enduring digital presence"
            className="pointer-events-none object-cover"
            fetchPriority="high"
            fill
            priority
            quality={95}
            sizes="(min-width: 1024px) 1440px, 100vw"
            src="/hero-face-final-poster.webp"
          />
          <HeroVideoOverlay src="/hero-face-final.mp4" />
        </div>
      </div>
    </section>
  );
}
