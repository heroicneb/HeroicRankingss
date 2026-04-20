import { PortableText } from "@portabletext/react";

import { portableTextComponents } from "@/components/sanity/PortableTextComponents";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";
import type { SanityPartnershipPage } from "@/lib/sanity-data";

interface CmsPartnershipPageProps {
  page: SanityPartnershipPage;
}

export function CmsPartnershipPage({ page }: CmsPartnershipPageProps) {
  const ctaLabel = page.heroCtaLabel?.trim() || "Become a Partner";
  const ctaUrl = page.heroCtaUrl?.trim() || "/contact";

  return (
    <section className="pt-[100px] lg:pt-[109px]" id="partnership-cms">
      <div className={PAGE_SHELL_CLASS}>
        <div className="mx-auto max-w-[960px] text-center">
          <SectionLabel>/  Partner With Us  /</SectionLabel>
          <h1 className="type-h1 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {page.title}
          </h1>

          {page.intro ? (
            <p className="type-paragraph mx-auto mt-5 max-w-[760px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              {page.intro}
            </p>
          ) : null}

          <AppLink
            className="type-cta motion-interactive motion-interactive-press mt-8 inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
            href={ctaUrl}
            motionPreset="none"
          >
            {ctaLabel}
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>

        {page.body?.length ? (
          <article className="mx-auto mt-14 w-full max-w-[960px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-5 py-8 text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] lg:rounded-[40px] lg:px-10 lg:py-10">
            <PortableText components={portableTextComponents} value={page.body} />
          </article>
        ) : null}
      </div>
    </section>
  );
}
