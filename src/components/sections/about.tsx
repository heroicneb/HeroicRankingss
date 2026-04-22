import Image from "next/image";

import { Container } from "@/components/ui/container";
import { DesktopScrollProgress } from "@/components/ui/desktop-scroll-progress";
import { SectionLabel } from "@/components/ui/section-label";
import type { AboutLogoAsset } from "@/types";

const ABOUT_LOGOS: Array<AboutLogoAsset & { darkSrc: string }> = [
  {
    src: "/figma/about/logo-1-light.png",
    darkSrc: "/figma/about/logo-1-dark.png",
    width: 126.5105,
    height: 28.5503,
    imgW: 128.69,
    imgH: 570.26,
    imgL: -14.35,
    imgT: -235.13,
  },
  {
    src: "/figma/about/logo-2-light.png",
    darkSrc: "/figma/about/logo-2-dark.png",
    width: 42.7404,
    height: 63.9465,
    imgW: 380.93,
    imgH: 254.61,
    imgL: -140.47,
    imgT: -77.3,
  },
  {
    src: "/figma/about/logo-3-light.png",
    darkSrc: "/figma/about/logo-3-dark.png",
    width: 127.9079,
    height: 23.6024,
    imgW: 127.29,
    imgH: 689.81,
    imgL: -13.64,
    imgT: -294.9,
  },
  {
    src: "/figma/about/logo-4-light.png",
    darkSrc: "/figma/about/logo-4-dark.png",
    width: 60.5414,
    height: 58.7868,
    imgW: 231.23,
    imgH: 238.13,
    imgL: -65.62,
    imgT: -69.07,
  },
  {
    src: "/figma/about/logo-5-light.png",
    darkSrc: "/figma/about/logo-5-dark.png",
    width: 116.3586,
    height: 19.4157,
    imgW: 139.92,
    imgH: 838.55,
    imgL: -19.96,
    imgT: -369.28,
  },
  {
    src: "/figma/about/logo-6-light.png",
    darkSrc: "/figma/about/logo-6-dark.png",
    width: 74.2805,
    height: 32.8456,
    imgW: 188.95,
    imgH: 427.32,
    imgL: -44.48,
    imgT: -163.66,
  },
  {
    src: "/figma/about/logo-7-light.png",
    darkSrc: "/figma/about/logo-7-dark.png",
    width: 119.9011,
    height: 44.6296,
    imgW: 135.79,
    imgH: 364.81,
    imgL: -17.89,
    imgT: -132.4,
  },
  {
    src: "/figma/about/logo-8-light.png",
    darkSrc: "/figma/about/logo-8-dark.png",
    width: 127.9079,
    height: 36.0397,
    imgW: 127.29,
    imgH: 451.76,
    imgL: -13.64,
    imgT: -175.88,
  },
];

const ABOUT_PARAGRAPHS = [
  {
    body: "Committed to delivering data-driven results and ",
    emphasis: "long-term success for your business.",
    suffix: "",
  },
  {
    body: "We believe in building strong relationships with our clients, rooted in trust, collaboration, and transparency. Our goal is to craft ",
    emphasis: "strategies that align with your vision, ",
    suffix: "ensuring growth and success for every business we serve.",
  },
  {
    body: "What drives us? ",
    emphasis: "Seeing our clients achieve their goals",
    suffix:
      " and thrive in a competitive market. Our team is driven by creativity, dedication, and the hard work to push boundaries in digital marketing.",
  },
] as const;

export function About() {
  return (
    <section className="pb-[60px] pt-[60px] lg:pb-24 lg:pt-[7px]" id="about">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[40px]">
        <DesktopScrollProgress scrollTargetId="services-rail-scroll" />
      </div>

      <Container className="pt-0 lg:pt-20">
        <div className="grid gap-10 xl:grid-cols-[522px_630px] xl:items-start xl:gap-32">
          <div className="mx-auto w-full max-w-[352px] xl:mx-0 xl:max-w-none">
            <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
              <SectionLabel className="w-full xl:relative xl:-top-[6px]">
                / About /
              </SectionLabel>
              <h2 className="type-h2 mt-5 w-[306px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] xl:mt-[26px] xl:w-auto xl:max-w-[485px]">
                Data-Driven SEO Agency and{" "}
                <span className="gradient-text-brand gradient-text-brand-about-heading">
                  Trusted Growth Partner
                </span>
              </h2>
              <div className="mt-10 w-[316px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] xl:w-auto xl:max-w-[485px]">
                {ABOUT_PARAGRAPHS.map((paragraph, index) => (
                  <p
                    className={`type-paragraph${index < 2 ? " mb-5" : ""}`}
                    key={`${paragraph.body}-${index + 1}`}
                  >
                    {paragraph.body}
                    <span className="gradient-text-brand gradient-text-brand-about-body">
                      {paragraph.emphasis}
                    </span>
                    {paragraph.suffix ?? ""}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto h-[329px] w-full max-w-[352px] overflow-hidden rounded-[30px] xl:mx-0 xl:h-[588px] xl:max-w-none xl:rounded-[var(--radius-card)]">
            <Image
              alt=""
              aria-hidden
              className="object-cover"
              fill
              quality={95}
              sizes="(min-width: 1280px) 1260px, 704px"
              src="/figma/about/about-main.webp"
            />
          </div>
        </div>
      </Container>

      <div className="about-logos-marquee mt-10 overflow-hidden">
        <div className="-translate-x-[564px] lg:translate-x-0">
          <div className="about-logos-track flex w-max items-center gap-[40px] opacity-50 md:gap-[72px] lg:gap-[98px]">
            {[...ABOUT_LOGOS, ...ABOUT_LOGOS].map((logo, index) => (
              <div
                className="relative shrink-0 overflow-hidden dark:bg-[var(--color-hr-dark)]"
                key={`${logo.src}-${index + 1}`}
                style={{
                  height: `${logo.height}px`,
                  width: `${logo.width}px`,
                }}
              >
                <Image
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute max-w-none grayscale opacity-45 dark:invert dark:opacity-60"
                  height={1}
                  src={logo.src}
                  style={{
                    height: `${logo.imgH}%`,
                    left: `${logo.imgL}%`,
                    top: `${logo.imgT}%`,
                    width: `${logo.imgW}%`,
                  }}
                  // WHY: Sprite-cropped marquee logos rely on full-source pixels; optimizer downscales 1x1 declarations to blurry 16px assets.
                  unoptimized
                  width={1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
