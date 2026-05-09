import Image from "next/image";

import { FooterCtaVariant } from "@/components/layout/footer-cta-variant";
import { AppLink } from "@/components/ui/app-link";
import {
  SITE_EMAIL,
  SITE_INSTAGRAM_URL,
  SITE_LINKEDIN_URL,
  SITE_PHONE,
  SITE_X_URL,
} from "@/lib/site";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Services", href: "/seo" },
  { label: "Link Building", href: "/seo/linkbuilding" },
  { label: "Partnership", href: "/partnership" },
  { label: "Insights", href: "/insights" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy policy", href: "/privacy-policy" },
] as const;

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: SITE_LINKEDIN_URL },
  { label: "Instagram", href: SITE_INSTAGRAM_URL },
  { label: "X", href: SITE_X_URL },
] as const;

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  twitter: "X",
  x: "X",
  facebook: "Facebook",
  youtube: "YouTube",
};

interface FooterProps {
  navLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ platform: string; url: string }>;
  phone?: string;
  email?: string;
  copyrightText?: string;
  footerCtaHeading?: string | null;
  footerCtaBody?: string | null;
  footerCtaLabel?: string | null;
  footerCtaUrl?: string | null;
}

export function Footer({
  navLinks,
  socialLinks,
  phone,
  email,
  copyrightText,
  footerCtaHeading,
  footerCtaBody,
  footerCtaLabel,
  footerCtaUrl,
}: FooterProps) {
  const resolvedNavLinks = navLinks?.length ? navLinks : NAV_LINKS;
  const resolvedSocialLinks = socialLinks?.length
    ? socialLinks.map((sl) => ({
        label: PLATFORM_LABELS[sl.platform.toLowerCase()] ?? sl.platform,
        href: sl.url,
      }))
    : SOCIAL_LINKS;
  const resolvedPhone = phone || SITE_PHONE;
  const resolvedEmail = email || SITE_EMAIL;
  const resolvedCopyright = copyrightText || "\u00A92026 Heroic Rankings";

  return (
    <footer
      className="pb-[10px] pt-[10px] lg:pb-[10px] lg:pt-[10px]"
      id="footer"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[5px] md:px-[10px]">
        <div className="relative overflow-hidden rounded-[30px] border border-[var(--color-hr-accent)] bg-[var(--color-hr-dark)] px-[15px] pb-[20px] pt-[60px] dark:border-[color-mix(in_srgb,var(--color-hr-accent)_30%,transparent)] dark:bg-[var(--color-bg-dark)] lg:rounded-[var(--radius-card)] lg:px-5 lg:pb-[46px] lg:pt-[120px] xl:px-[70px] xl:pt-[60px]">
          <div className="pointer-events-none absolute left-[1194px] top-[-379px] size-[580px]">
            <div className="footer-glow-top absolute inset-[-86.21%] rounded-full" />
          </div>
          <div className="pointer-events-none absolute left-[-379px] top-[498px] size-[606px]">
            <div className="footer-glow-bottom absolute inset-[-82.51%] rounded-full" />
          </div>

          <div className="relative flex flex-col items-center gap-[40px] lg:gap-[100px]">
            <FooterCtaVariant
              cmsBody={footerCtaBody}
              cmsHeading={footerCtaHeading}
              cmsLabel={footerCtaLabel}
              cmsUrl={footerCtaUrl}
            />

            <div className="w-full">
              <div className="h-px w-full bg-[color-mix(in_srgb,var(--color-hr-light-grey)_40%,transparent)]" />

              <div className="mt-[20px] flex w-full flex-col items-center gap-[20px] text-[var(--color-hr-pure-white)] lg:mt-[30px] lg:flex-row lg:items-center lg:justify-between lg:gap-[18px]">
                <div className="order-1 flex w-full flex-col items-center gap-[5px] text-center lg:order-2 lg:w-auto lg:flex-row lg:gap-[18px]">
                  <a
                    className="type-footer inline-flex min-h-[44px] items-center rounded-[10px] px-1 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-dark)] lg:min-h-0 lg:rounded-none lg:px-0"
                    href={`tel:${resolvedPhone.replace(/\s/g, "")}`}
                  >
                    {resolvedPhone}
                  </a>
                  <a
                    className="type-footer inline-flex min-h-[44px] items-center rounded-[10px] px-1 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-dark)] lg:min-h-0 lg:rounded-none lg:px-0"
                    href={`mailto:${resolvedEmail}`}
                  >
                    {resolvedEmail}
                  </a>
                </div>

                <div className="order-2 h-px w-full bg-[color-mix(in_srgb,var(--color-hr-light-grey)_40%,transparent)] lg:hidden" />

                <div className="order-3 flex items-center justify-center gap-[30px] lg:order-3 lg:gap-[18px]">
                  {resolvedSocialLinks.map((social) => (
                    <a
                      className="type-footer inline-flex min-h-[44px] items-center rounded-[10px] px-1 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-dark)] lg:min-h-0 lg:rounded-none lg:px-0"
                      href={social.href}
                      key={social.label}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>

                <div className="order-4 h-px w-full bg-[color-mix(in_srgb,var(--color-hr-light-grey)_40%,transparent)] lg:hidden" />

                <nav
                  aria-label="Footer links"
                  className="order-5 flex w-full flex-col items-center gap-[5px] text-center lg:order-1 lg:w-auto lg:flex-row lg:flex-nowrap lg:gap-[18px]"
                >
                  {resolvedNavLinks.map((link) => (
                    <AppLink
                      className="type-footer inline-flex min-h-[44px] items-center rounded-[10px] px-1 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-dark)] lg:min-h-0 lg:rounded-none lg:px-0"
                      href={link.href}
                      key={link.label}
                      motionPreset="none"
                    >
                      {link.label}
                    </AppLink>
                  ))}
                </nav>

                <div className="order-6 flex flex-col items-center gap-[18px] lg:order-4 lg:flex-row lg:gap-[18px]">
                  <p className="type-footer">{resolvedCopyright}</p>
                  {/* WHY: Footer logo is below the fold and should not consume early preload budget. */}
                  <Image
                    alt=""
                    aria-hidden
                    className="brightness-0 invert"
                    height={30}
                    src="/figma/footer/logo-mark.svg"
                    width={27}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
