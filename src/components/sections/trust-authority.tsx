import { Container } from "@/components/ui/container";
import { TrustAuthorityRail } from "@/components/sections/trust-authority-rail";
import { AppLink } from "@/components/ui/app-link";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import type { TrustAuthorityItem as TrustAuthorityItemType } from "@/types";

const TRUST_AUTHORITY_ITEMS: TrustAuthorityItemType[] = [
  { label: "Google Analytics", iconTone: "google" },
  { label: "Google Ads", iconTone: "google" },
  { label: "Google Ads Search", iconTone: "google" },
  { label: "Google Ads Display", iconTone: "google" },
  { label: "Google Ads Video", iconTone: "google" },
  {
    label: "Hubspot Social Media Marketing",
    iconTone: "hubspot",
    compact: true,
  },
  { label: "Hubspot SEO", iconTone: "hubspot" },
  { label: "Hubspot SEO II", iconTone: "hubspot" },
  { label: "Hubspot Sales Management", iconTone: "hubspot", compact: true },
  { label: "Hubspot Sales Enablement", iconTone: "hubspot", compact: true },
  { label: "Hubspot Inbound", iconTone: "hubspot", compact: true },
  { label: "Hubspot Inbound Marketing", iconTone: "hubspot", compact: true },
  {
    label: "Hubspot Inbound Marketing Optimization",
    iconTone: "hubspot",
    compact: true,
  },
  { label: "Hubspot Growth-Driven Design", iconTone: "hubspot", compact: true },
  { label: "Hubspot Email Marketing", iconTone: "hubspot", compact: true },
  { label: "Hubspot Digital advertising", iconTone: "hubspot", compact: true },
  { label: "Hubspot Digital Marketing", iconTone: "hubspot", compact: true },
  { label: "Hubspot Inbound Sales", iconTone: "hubspot", compact: true },
  { label: "Hubspot Content Marketing", iconTone: "hubspot", compact: true },
];

export function TrustAuthority() {
  return (
    <section
      className="mb-[40px] mt-[40px] lg:mb-[81px] lg:mt-[60px]"
      id="trust-authority"
    >
      <Container>
        <div className="grid items-start gap-[10px] lg:grid-cols-[600px_670px]" data-reveal-stagger>
          <div className="text-center lg:text-left">
            <SectionLabel>/ Trust and Authority /</SectionLabel>
            <h2 className="type-h2 mt-5 max-w-[413px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Certifications and{" "}
              <span className="gradient-text-brand gradient-text-brand-trust">
                Partnerships
              </span>
            </h2>
            <AppLink
              href="/contact"
              className="type-cta mt-10 inline-flex h-[45px] w-full max-w-[303px] items-center justify-center gap-2 rounded-[var(--radius-button)] whitespace-nowrap border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:w-[303px]"
            >
              Work with Certified SEO Experts
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>

          <div className="mt-[30px] grid grid-cols-2 gap-[10px] lg:hidden">
            {TRUST_AUTHORITY_ITEMS.slice(0, 8).map((item) => (
              <article
                className="flex h-[100px] flex-col items-center rounded-[20px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-1 text-center dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
                key={item.label}
              >
                <span
                  aria-hidden
                  className={`trust-authority-icon mt-[25px] inline-block size-7 rounded-full ${
                    item.iconTone === "google"
                      ? "trust-authority-icon-google"
                      : "trust-authority-icon-hubspot"
                  }`}
                />
                <p className="type-cert mt-[5px] w-[136px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                  {item.label}
                </p>
              </article>
            ))}
          </div>

          <div className="hidden lg:block">
            <TrustAuthorityRail items={TRUST_AUTHORITY_ITEMS} />
          </div>
        </div>
      </Container>
    </section>
  );
}
