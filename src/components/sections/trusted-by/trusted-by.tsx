import { Container } from "@/components/ui/container";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { SectionLabel } from "@/components/ui/section-label";
import type { HomeContent } from "@/components/pages/home/home-content";
import type { SanityClientLogo } from "@/lib/sanity-data";

import { LogoField } from "./LogoField";
import { DEFAULT_CLIENT_LOGOS, type ClientLogo } from "./trusted-by-data";

/**
 * "/ Trusted By / From Startups to Enterprise" — client logos floating in a
 * dark panel between the Proven Results photo and the testimonials. Logos come
 * from the "Client Logo" documents, falling back to the built-in white set.
 */
export interface TrustedByProps {
  content: HomeContent["trustedBy"];
  cmsLogos: SanityClientLogo[];
}

export function TrustedBy({ content, cmsLogos }: TrustedByProps) {
  const logos: ClientLogo[] = cmsLogos.length
    ? cmsLogos.map((logo) => ({
        name: logo.name,
        src: logo.logoUrl,
        width: logo.width,
        height: logo.height,
        logoHeight: logo.logoHeight,
      }))
    : DEFAULT_CLIENT_LOGOS;

  return (
    <section className="pt-[60px] lg:pt-[120px]" id="trusted-by">
      <Container>
        <div className="mx-auto w-full max-w-[350px] text-center lg:mx-0 lg:max-w-[640px] lg:text-left" data-reveal>
          <SectionLabel>{content.label}</SectionLabel>
          <h2 className="type-h2 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            <GradientHeading highlightClassName="gradient-text-brand-trusted" segments={content.heading} />
          </h2>
        </div>
      </Container>

      <div className="mx-auto mt-[40px] max-w-[1440px] px-[15px] lg:mt-[60px] lg:px-[20px]" data-reveal>
        <LogoField logos={logos} />
      </div>
    </section>
  );
}
