import { AppLink } from "@/components/ui/app-link";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";

export function Partnerships() {
  return (
    <section className="pb-24 pt-10" id="partnerships">
      <div className="mx-auto max-w-[var(--size-page-max)] px-[10px]">
        <div className="overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(40.898deg,var(--color-bg-inverse)_35.359%,var(--color-case-art-maudsch)_142.03%)] px-6 py-12 md:px-10 lg:px-[70px] lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[70px] lg:items-start">
            <div className="max-w-[634px]">
              <SectionLabel className="text-[var(--color-hr-pure-white)]">
                / The Value We Bring /
              </SectionLabel>
              <div className="mt-5 text-[var(--color-hr-pure-white)]">
                <p className="type-h3 max-w-[634px] font-normal leading-[1.14] pb-[2px]">
                  At Heroic Rankings, we offer{" "}
                  <span className="gradient-text-brand gradient-text-brand-partnerships">
                    various
                  </span>{" "}
                  <span className="gradient-text-brand gradient-text-brand-partnerships">
                    partnership
                  </span>{" "}
                  opportunities for businesses and individuals looking to expand
                  their service offerings{" "}
                  <span className="gradient-text-brand gradient-text-brand-partnerships">
                    through our expertise.
                  </span>
                </p>
              </div>
              <AppLink
                href="/contact"
                className="type-cta mt-9 inline-flex h-[45px] w-[194px] items-center justify-center gap-[9px] rounded-[var(--radius-button)] whitespace-nowrap border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-gradient-start)]"
              >
                Become a Partner
                <GradientArrowUpRightIcon className="h-[11px] w-[11px] shrink-0" />
              </AppLink>
            </div>

            <div className="max-w-[418px] text-[var(--color-hr-pure-white)] lg:justify-self-end lg:pt-[3px]">
              <p className="type-paragraph">
                Whether you&apos;re interested in reselling our services,
                partnering as an affiliate, or utilizing our white-label
                options, we provide flexible solutions to meet your needs.
              </p>
              <p className="type-paragraph mt-6">
                Our partnership programs are designed to help you grow your
                business while delivering exceptional SEO results to your
                clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
