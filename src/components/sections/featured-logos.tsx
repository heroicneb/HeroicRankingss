import Image from "next/image";

import type { SanityPartnerLogo } from "@/lib/sanity-data";
import { Container } from "@/components/ui/container";

interface FeaturedLogosProps {
  partnerLogos?: SanityPartnerLogo[];
}

const featuredHeadingGradientClassName =
  "gradient-text-brand gradient-text-brand-featured inline-block pb-[0.12em]";

export function FeaturedLogos({ partnerLogos = [] }: FeaturedLogosProps) {
  const cmsLogos = partnerLogos
    .filter((logo) => Boolean(logo.logoUrl))
    .map((logo) => ({
      _id: logo._id,
      name: logo.name,
      src: logo.logoUrl,
      url: logo.url?.trim() ? logo.url : null,
    }));

  if (cmsLogos.length > 0) {
    return (
      <section className="pb-[60px] pt-[60px] lg:pb-[80px] lg:pt-[108px]">
        <Container className="lg:hidden">
          <div className="mx-auto flex max-w-[350px] flex-col items-center gap-5">
            <h2 className="type-h3 w-[272px] text-center text-[var(--color-hr-pure-white)]">
              Featured and <span className="gradient-text-brand gradient-text-brand-featured">Recognized</span> by{" "}
              <span className="gradient-text-brand gradient-text-brand-featured">Industry Leaders</span>
            </h2>
            <div className="w-full rounded-[30px] border border-[var(--color-hr-accent)] px-[30px] py-[20px]">
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                {cmsLogos.map((logo) => {
                  const image = (
                    <Image
                      alt={logo.name || "Partner logo"}
                      className="h-auto max-h-[26px] w-auto max-w-[135px] object-contain"
                      height={52}
                      sizes="(max-width: 1023px) 135px, 160px"
                      src={logo.src}
                      width={160}
                    />
                  );

                  if (logo.url) {
                    return (
                      <a
                        key={logo._id}
                        className="inline-flex min-h-[26px] items-center justify-center"
                        href={logo.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {image}
                      </a>
                    );
                  }

                  return (
                    <div key={logo._id} className="inline-flex min-h-[26px] items-center justify-center">
                      {image}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>

        <div className="hidden lg:block">
          <Container>
            <h2 className="type-h4 overflow-visible pb-[0.12em] font-normal text-center text-[var(--color-hr-pure-white)]">
              Featured and <span className={featuredHeadingGradientClassName}>Recognized</span> by{" "}
              <span className={featuredHeadingGradientClassName}>Industry Leaders</span>
            </h2>
          </Container>

          <Container className="mt-5">
            <div className="rounded-[var(--radius-card)] border border-[var(--color-hr-accent)] px-4 py-10 md:px-10 lg:px-20">
              <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14 xl:gap-20 2xl:gap-[120px]">
                {cmsLogos.map((logo) => {
                  const image = (
                    <Image
                      alt={logo.name || "Partner logo"}
                      className="h-auto max-h-[26px] w-auto max-w-[138px] object-contain"
                      height={56}
                      sizes="(max-width: 1535px) 138px, 170px"
                      src={logo.src}
                      width={170}
                    />
                  );

                  if (logo.url) {
                    return (
                      <a
                        key={logo._id}
                        className="inline-flex min-h-[26px] items-center justify-center"
                        href={logo.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {image}
                      </a>
                    );
                  }

                  return (
                    <div key={logo._id} className="inline-flex min-h-[26px] items-center justify-center">
                      {image}
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-[60px] pt-[60px] lg:pb-[80px] lg:pt-[108px]">
      <Container className="lg:hidden">
        <div className="mx-auto flex max-w-[350px] flex-col items-center gap-5">
          <h2 className="type-h3 w-[272px] text-center text-[var(--color-hr-pure-white)]">
            Featured and <span className="gradient-text-brand gradient-text-brand-featured">Recognized</span> by{" "}
            <span className="gradient-text-brand gradient-text-brand-featured">Industry Leaders</span>
          </h2>
          <div className="w-full rounded-[30px] border border-[var(--color-hr-accent)] px-[30px] py-[20px]">
            <div className="grid grid-cols-2 gap-x-5 gap-y-5">
              {/* WHY: Keep vector logos crisp by serving source SVGs directly instead of optimizer transforms. */}
              <Image
                alt="Serpstat"
                height={12}
                sizes="103px"
                src="/figma/featured-logos/logo-serpstat.svg"
                unoptimized
                width={103}
              />
              <Image alt="Entrepreneur" height={26} sizes="135px" src="/figma/featured-logos/logo-entrepreneur.svg" unoptimized width={135} />
              <div className="inline-flex items-center gap-[4px]">
                <Image
                  alt=""
                  aria-hidden
                  height={20}
                  sizes="14px"
                  src="/figma/featured-logos/logo-envato-mark.svg"
                  unoptimized
                  width={14}
                />
                <Image
                  alt="Envato"
                  height={15}
                  sizes="71px"
                  src="/figma/featured-logos/logo-envato-word.svg"
                  unoptimized
                  width={71}
                />
              </div>
              <Image
                alt="Cloudways by DigitalOcean"
                height={21}
                sizes="135px"
                src="/figma/featured-logos/logo-cloudways.svg"
                unoptimized
                width={135}
              />
            </div>
          </div>
        </div>
      </Container>

      <div className="hidden lg:block">
        <Container>
          <h2 className="type-h3 overflow-visible pb-[0.12em] text-center text-[var(--color-hr-pure-white)]">
            Featured and <span className={featuredHeadingGradientClassName}>Recognized</span> by{" "}
            <span className={featuredHeadingGradientClassName}>Industry Leaders</span>
          </h2>
        </Container>

        <Container className="mt-5">
          <div className="rounded-[var(--radius-card)] border border-[var(--color-hr-accent)] px-4 py-10 md:px-10 lg:px-20">
            <div className="flex flex-nowrap items-center justify-center gap-8 lg:gap-14 xl:gap-20 2xl:gap-[180px]">
              {/* WHY: Keep vector logos crisp by serving source SVGs directly instead of optimizer transforms. */}
              <Image
                alt="Serpstat"
                height={14}
                sizes="122px"
                src="/figma/featured-logos/logo-serpstat.svg"
                unoptimized
                width={122}
              />
              <div className="inline-flex items-center gap-[4px]">
                <Image
                  alt=""
                  aria-hidden
                  height={24}
                  sizes="17px"
                  src="/figma/featured-logos/logo-envato-mark.svg"
                  unoptimized
                  width={17}
                />
                <Image
                  alt="Envato"
                  height={18}
                  sizes="85px"
                  src="/figma/featured-logos/logo-envato-word.svg"
                  unoptimized
                  width={85}
                />
              </div>
              <Image
                alt="Entrepreneur"
                height={26}
                sizes="131px"
                src="/figma/featured-logos/logo-entrepreneur.svg"
                unoptimized
                width={131}
              />
              <Image
                alt="Cloudways by DigitalOcean"
                height={26}
                sizes="138px"
                src="/figma/featured-logos/logo-cloudways.svg"
                unoptimized
                width={138}
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
