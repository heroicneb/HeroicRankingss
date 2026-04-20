import Image from "next/image";

import { GradientText } from "@/components/ui/gradient-text";

export function AboutUsHero() {
  return (
    <section className="pt-[60px] lg:pt-[109px]" id="about-us-hero">
      <div className="mx-auto w-full max-w-[1440px] px-[20px] lg:px-[10px]">
        <h1 className="type-h1 mx-auto w-full max-w-[350px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[857px]">
          Meet the{" "}
          <GradientText className="gradient-text-brand-about-us-hero-title">Ranking Heroes</GradientText>
        </h1>

        <div className="lg:hidden">
          <p className="type-paragraph mx-auto mt-[10px] w-full max-w-[350px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            When rankings, traffic, and revenue matter, brands turn to Heroic Rankings. Trusted for the metrics that
            outperform your competitors.
          </p>

          <div className="relative mx-auto mt-0 h-[360px] w-full max-w-[350px]">
            <div className="about-hero-panel-gradient absolute bottom-0 left-0 h-[255px] w-full rounded-[30px]" />

            <div className="absolute inset-0 overflow-hidden rounded-[30px]">
              <Image
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-[-7.66%] top-[-13.89%] max-w-none"
                fetchPriority="high"
                height={410}
                priority
                quality={95}
                sizes="820px"
                src="/figma/about-us/hero/statue-fill.webp"
                style={{ width: 410, height: 410 }}
                width={410}
              />
            </div>
          </div>

          <p className="type-paragraph mx-auto mt-[20px] w-full max-w-[350px] pb-[60px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Being in a hero business involves the great responsibility of saving, defending, and improving the quality
            of your metrics. As solution designers and builders, we assure you that nothing will surprise us and that
            we are always ready for action!
          </p>
        </div>

        <div className="hidden lg:block">
          <p className="type-paragraph mx-auto mt-5 w-full max-w-[688px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            <span className="block">When rankings, traffic, and revenue matter, brands turn to Heroic Rankings.</span>
            <span className="mt-[8px] block">Trusted for the metrics that outperform your competitors.</span>
          </p>

          <div className="relative mt-[127px] h-[480px]">
            <div className="about-hero-panel-gradient absolute inset-0 rounded-[40px]" />

            <Image
              alt=""
              aria-hidden
              className="about-hero-statue pointer-events-none absolute left-[394px] top-[-150px] max-w-none"
              fetchPriority="high"
              height={561}
              priority
              quality={95}
              sizes="1266px"
              src="/figma/about-us/hero/statue-fill.webp"
              style={{ width: 633, height: 561 }}
              width={633}
            />

            <p className="type-paragraph absolute left-1/2 top-[348px] w-[688px] -translate-x-1/2 text-center text-[var(--color-hr-pure-white)]">
              Being in a hero business involves the great responsibility of saving, defending, and improving the quality
              of your metrics. As solution designers and builders, we assure you that nothing will surprise us and that
              we are always ready for action!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
