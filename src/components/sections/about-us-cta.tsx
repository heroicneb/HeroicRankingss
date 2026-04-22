import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";

export function AboutUsCta() {
  return (
    <section className="mt-[5px] lg:mt-[10px]" id="about-us-cta">
      <div className="mx-auto w-full max-w-[1440px] px-[5px] lg:px-[10px]">
        <div className="rounded-[30px] border border-[var(--color-border-inverse-10)] bg-[var(--color-bg-dark)] px-[15px] py-[60px] lg:hidden">
          <GradientText
            as="div"
            className="gradient-text-brand-about-us-cta-copy type-h3 pb-[6px] mx-auto w-full max-w-[350px] text-center !block"
          >
            <p className="leading-[normal] mb-0">
              We focus on one thing: measurable performance.
            </p>
            <p className="leading-[normal] mb-0">&#8203;</p>
            <p className="leading-[normal]">
              Every strategy is based on data, tested at scale &amp; refined to
              deliver rankings, traffic, and authority that keeps up with AI.
              Supported by specialized experts across SEO, links, and content.
              We build with you to execute at scale without compromising
              quality.
            </p>
          </GradientText>

          <p className="type-paragraph mx-auto mt-[30px] w-full max-w-[350px] text-center text-[var(--color-text-inverse)]">
            Through transparent monthly reporting, we make SEO measurable and
            clear, with early results typically visible within the first three
            months
          </p>

          <AppLink
            href="/contact"
            className="type-cta mx-auto mt-[30px] inline-flex w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] px-[20px] py-[12px] text-[var(--color-text-inverse)]"
          >
            Let&apos;s Grow Together
            <GradientArrowUpRightIcon className="size-4" />
          </AppLink>
        </div>

        <div className="relative hidden h-[577px] overflow-hidden rounded-[40px] bg-[var(--color-hr-dark)] lg:block">
          <GradientText
            as="div"
            className="gradient-text-brand-about-us-cta-copy type-h3 pb-[6px] absolute left-1/2 top-[90px] w-[1280px] -translate-x-1/2 text-center !block"
          >
            <p className="leading-[normal] mb-0">
              We focus on one thing: measurable performance.
            </p>
            <p className="leading-[normal] mb-0">&#8203;</p>
            <p className="leading-[normal]">
              Every strategy is based on data, tested at scale &amp; refined to
              deliver rankings, traffic, and authority that keeps up with AI.
              Supported by specialized experts across SEO, links, and content.
              We build with you to execute at scale without compromising
              quality.
            </p>
          </GradientText>

          <p className="type-paragraph absolute left-1/2 top-[332px] w-[664px] -translate-x-1/2 text-center text-[var(--color-hr-pure-white)]">
            Through transparent monthly reporting, we make SEO measurable and
            clear, with early results typically visible within the first three
            months
          </p>

          <AppLink
            href="/contact"
            className="type-cta absolute left-1/2 top-[412px] inline-flex h-[45px] w-[209px] -translate-x-1/2 items-center justify-center gap-2 rounded-[var(--radius-button)] whitespace-nowrap border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] [&_svg]:text-[var(--color-hr-pure-white)]"
          >
            Let&apos;s Grow Together
            <GradientArrowUpRightIcon className="size-4" />
          </AppLink>
        </div>
      </div>
    </section>
  );
}
