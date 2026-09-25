import Image from "next/image";

import { GradientText } from "@/components/ui/gradient-text";
import { SectionLabel } from "@/components/ui/section-label";

export function AboutUsTrust() {
  return (
    <section
      className="px-[15px] pb-[60px] pt-[60px] lg:px-[80px] lg:pb-[70px] lg:pt-[120px]"
      id="about-us-trust"
    >
      <div className="lg:hidden">
        <div className="mx-auto w-full max-w-[350px]">
          <SectionLabel className="text-center">
            / Trust and Authority /
          </SectionLabel>
          <h2 className="type-h2 mt-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Over a Decade of Ethical, Data-Driven{" "}
            <GradientText className="gradient-text-brand-about-us-trust-title">
              SEO Excellence
            </GradientText>
          </h2>
          <p className="type-paragraph mt-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Heroic Rankings has evolved alongside search itself.
            <br />
            <br />
            SEO isn&apos;t a mystery: it&apos;s a system to be understood,
            tested, and mastered. Through white-hat strategies and continuous
            adaptation, we help brands rank today and get recognized by
            tomorrow&apos;s search:
            <br />
            <br />
            AI engines and large language models that decide what gets seen,
            cited, and trusted.
          </p>
        </div>

        <div className="mx-auto mt-[60px] w-full max-w-[350px]">
          <article className="text-center">
            <div className="mx-auto flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
              <Image
                alt=""
                aria-hidden
                className="h-[28.632px] w-[17px] dark:brightness-0 dark:invert"
                height={29}
                src="/figma/about-us/trust/icon-approach.svg"
                width={17}
              />
            </div>
            <h3 className="type-h3 mt-[15px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Our Approach
            </h3>
            <p className="type-paragraph mt-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Our Approach involves predictive modeling to anticipate organic
              traffic changes, staying ahead of trends and algorithm updates.
              Moreover, we conduct rigorous tests to validate our methods,
              ensuring that our strategies are consistently optimized for
              maximum impact.
            </p>
          </article>

          <div className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)]" />

          <article className="mt-[30px] text-center">
            <div className="mx-auto flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
              <div className="relative h-[23.303px] w-[32.244px]">
                <Image
                  alt=""
                  aria-hidden
                  className="absolute left-[6.485px] top-0 dark:brightness-0 dark:invert"
                  height={23}
                  src="/figma/about-us/trust/icon-team-main.svg"
                  width={20}
                />
                <Image
                  alt=""
                  aria-hidden
                  className="absolute left-0 top-[7.768px] dark:brightness-0 dark:invert"
                  height={16}
                  src="/figma/about-us/trust/icon-team-left.svg"
                  width={10}
                />
                <Image
                  alt=""
                  aria-hidden
                  className="absolute left-[22.534px] top-[7.768px] dark:brightness-0 dark:invert"
                  height={16}
                  src="/figma/about-us/trust/icon-team-right.svg"
                  width={10}
                />
              </div>
            </div>
            <h3 className="type-h3 mt-[15px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Our Team
            </h3>
            <p className="type-paragraph mt-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Our team of seasoned experts is dedicated to helping businesses of
              all sizes achieve their online marketing goals.
            </p>
          </article>

          <div className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)]" />

          <article className="mt-[30px] text-center">
            <div className="mx-auto flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
              <Image
                alt=""
                aria-hidden
                className="h-[21.091px] w-[29px] dark:brightness-0 dark:invert"
                height={21}
                src="/figma/about-us/trust/icon-vision.svg"
                width={29}
              />
            </div>
            <h3 className="type-h3 mt-[15px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Our Vision
            </h3>
            <p className="type-paragraph mt-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Is to deliver exceptional result through personalized SEO
              strategies that align with our clients unique needs. This
              commitment to transparency, research, and testing sets us apart,
              giving our clients peace of mind and tangible results.
            </p>
          </article>
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-1 lg:gap-10 xl:grid-cols-[485px_630px] xl:gap-[165px]">
        <div>
          <SectionLabel>/ Trust and Authority /</SectionLabel>
          <h2 className="type-h2 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Over a Decade of Ethical, Data-Driven{" "}
            <GradientText className="gradient-text-brand-about-us-trust-title">
              SEO Excellence
            </GradientText>
          </h2>
          <p className="type-paragraph mt-10 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Heroic Rankings has evolved alongside search itself.
            <br />
            <br />
            SEO isn&apos;t a mystery: it&apos;s a system to be understood,
            tested, and mastered. Through white-hat strategies and continuous
            adaptation, we help brands rank today and get recognized by
            tomorrow&apos;s search:
            <br />
            <br />
            AI engines and large language models that decide what gets seen,
            cited, and trusted.
          </p>
        </div>

        <div>
          <article>
            <div className="flex items-center gap-[14px]">
              <div className="flex size-[50px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
                <Image
                  alt=""
                  aria-hidden
                  className="h-[28.632px] w-[17px] dark:brightness-0 dark:invert"
                  height={29}
                  src="/figma/about-us/trust/icon-approach.svg"
                  width={17}
                />
              </div>
              <h3 className="type-h3 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                Our Approach
              </h3>
            </div>
            <p className="type-paragraph mt-4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Our Approach involves predictive modeling to anticipate organic
              traffic changes, staying ahead of trends and algorithm updates.
              Moreover, we conduct rigorous tests to validate our methods,
              ensuring that our strategies are consistently optimized for
              maximum impact.
            </p>
          </article>

          <div className="mt-[36px] h-px w-full bg-[var(--color-hr-light-grey)]" />

          <article className="mt-[36px]">
            <div className="flex items-center gap-[14px]">
              <div className="flex size-[50px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
                <div className="relative h-[23.303px] w-[32.244px]">
                  <Image
                    alt=""
                    aria-hidden
                    className="absolute left-[6.485px] top-0 dark:brightness-0 dark:invert"
                    height={23}
                    src="/figma/about-us/trust/icon-team-main.svg"
                    width={20}
                  />
                  <Image
                    alt=""
                    aria-hidden
                    className="absolute left-0 top-[7.768px] dark:brightness-0 dark:invert"
                    height={16}
                    src="/figma/about-us/trust/icon-team-left.svg"
                    width={10}
                  />
                  <Image
                    alt=""
                    aria-hidden
                    className="absolute left-[22.534px] top-[7.768px] dark:brightness-0 dark:invert"
                    height={16}
                    src="/figma/about-us/trust/icon-team-right.svg"
                    width={10}
                  />
                </div>
              </div>
              <h3 className="type-h3 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                Our Team
              </h3>
            </div>
            <p className="type-paragraph mt-4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Our team of seasoned experts is dedicated to helping businesses of
              all sizes achieve their online marketing goals.
            </p>
          </article>

          <div className="mt-[36px] h-px w-full bg-[var(--color-hr-light-grey)]" />

          <article className="mt-[36px]">
            <div className="flex items-center gap-[14px]">
              <div className="flex size-[50px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
                <Image
                  alt=""
                  aria-hidden
                  className="h-[21.091px] w-[29px] dark:brightness-0 dark:invert"
                  height={21}
                  src="/figma/about-us/trust/icon-vision.svg"
                  width={29}
                />
              </div>
              <h3 className="type-h3 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                Our Vision
              </h3>
            </div>
            <p className="type-paragraph mt-4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Is to deliver exceptional result through personalized SEO
              strategies that align with our clients unique needs. This
              commitment to transparency, research, and testing sets us apart,
              giving our clients peace of mind and tangible results.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
