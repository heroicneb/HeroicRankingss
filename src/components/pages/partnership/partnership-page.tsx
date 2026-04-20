import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import {
  FaqPlusIcon,
  GradientArrowUpRightIcon,
} from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "White Label SEO Partnership",
  description:
    "Build scalable agency growth with Heroic Rankings' white label SEO partnership model, from execution and reporting to long-term client retention.",
  path: "/partnership",
});

interface IconContainerProps {
  src: string;
  alt: string;
  iconWidth: number;
  iconHeight: number;
  iconClassName?: string;
}

function IconContainer({
  src,
  alt,
  iconWidth,
  iconHeight,
  iconClassName,
}: IconContainerProps) {
  return (
    <span className="flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
      <Image
        alt={alt}
        className={`${iconClassName ?? ""} dark:brightness-0 dark:invert`}
        height={iconHeight}
        sizes={`${iconWidth}px`}
        src={src}
        width={iconWidth}
      />
    </span>
  );
}

interface RecognizeItem {
  title: string;
  description: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  dividerSrc?: string;
}

const RECOGNIZE_ITEMS: readonly RecognizeItem[] = [
  {
    title: "SEO Agencies & Consultants",
    description:
      "Struggling with in-house link-building expertise and seeking high-quality, reliable backlink support to overcome growth barriers.",
    iconSrc: "/partnership/icon-group176776.svg",
    iconWidth: 32,
    iconHeight: 32,
    dividerSrc: "/partnership/line-6.svg",
  },
  {
    title: "Web Design & Dev Agencies",
    description:
      "Looking to upsell SEO services to increase client retention & MRR.",
    iconSrc: "/partnership/icon-group176777.svg",
    iconWidth: 32,
    iconHeight: 32,
    dividerSrc: "/partnership/line-8.svg",
  },
  {
    title: "PPC Agencies",
    description:
      "Needing expert assistance with SEO implementation and link-building to provide top tier service to your clients.",
    iconSrc: "/partnership/icon-group176778.svg",
    iconWidth: 32,
    iconHeight: 28,
  },
] as const;

interface AmplifyCard {
  title: string;
  subtitle: string;
  body: readonly string[];
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  className?: string;
  ctaLabel?: string;
}

const AMPLIFY_CARDS: readonly AmplifyCard[] = [
  {
    title: "Complete SEO Management",
    subtitle: "Outsource everything",
    body: [
      "We take full command of your clients\u2019 SEO campaigns from start to finish, staying ahead of trends and seizing opportunities as they arise. We always identify when strategies need to evolve, ensuring you\u2019re always at the cutting edge. With clear, actionable monthly reports, we map out the following steps, fine-tune campaigns, and deliver results that empower your clients - and your agency - to thrive.",
    ],
    iconSrc: "/partnership/icon-group176773.svg",
    iconWidth: 30,
    iconHeight: 30,
    className: "xl:h-[512px]",
  },
  {
    title: "White Label SEO and Link Building Solutions For Digital Agencies",
    subtitle: "Grow Your Agency",
    body: [
      "Grow your agency with white-label SEO and link building built for scale. To keep everything running smoothly, you get access to our custom white-label platform - a centralized hub where you can track finances, monitor deliverables and work progress, and order from a full service library, all in one place.",
    ],
    iconSrc: "/partnership/icon-group176774.svg",
    iconWidth: 31,
    iconHeight: 32,
    className: "xl:h-[623px]",
    ctaLabel: "Let's Grow Together",
  },
  {
    title: "What makes us the best white label SEO agency?",
    subtitle: "What Makes Us Unique",
    body: [
      "We focus on what actually protects and grows your offer: quality, transparency, and long-term success. Our white-label SEO is built around sustainable performance and strategies that hold up - not vanity metrics that look good on a dashboard and fall apart six months later.",
      "We operate as a true extension of your team, bringing the experience, process, and infrastructure of an established SEO operation directly into your agency. Every engagement is designed to protect your client relationships, scale with your growth, and give you reporting you can stand behind with confidence.",
    ],
    iconSrc: "/partnership/icon-group176775.svg",
    iconWidth: 21,
    iconHeight: 32,
    className: "xl:h-[687px]",
  },
] as const;

interface LogoCard {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  wrapperClassName?: string;
  skipMono?: boolean;
}

const PARTNER_LOGO_CARDS: readonly LogoCard[] = [
  {
    src: "/partnership/logo-becomes.svg",
    alt: "Becomes logo",
    width: 142,
    height: 48,
    className: "h-[48px] w-full",
  },
  {
    src: "/partnership/logo-atropos-digital.svg",
    alt: "Atropos Digital logo",
    width: 114,
    height: 16,
    className: "h-[16px] w-[114px]",
  },
  {
    src: "/partnership/logo-group176790.svg",
    alt: "Partner logo",
    width: 49,
    height: 44,
    className: "h-[44px] w-[49px]",
  },
  {
    src: "/partnership/logo-digital-spice.png",
    alt: "Digital Spice logo",
    width: 114,
    height: 18,
    className: "h-[18px] w-[114px]",
  },
  {
    src: "/partnership/logo-group176792.svg",
    alt: "Partner logo",
    width: 110,
    height: 15,
    className: "h-[15px] w-[110px]",
  },
  {
    src: "/partnership/logo-conversion-pipeline.svg",
    alt: "Conversion Pipeline logo",
    width: 109,
    height: 34,
    className: "h-[34px] w-[109px]",
  },
  {
    src: "/partnership/logo-ice-web.png",
    alt: "Ice Web logo",
    width: 106,
    height: 38,
    className: "h-[38px] w-[106px]",
  },
  {
    src: "/partnership/logo-white-label-agency.png",
    alt: "White Label Agency logo",
    width: 108,
    height: 22,
    className: "h-[22px] w-[108px]",
  },
  {
    src: "/partnership/logo-get-scaled-digital.jpg",
    alt: "Get Scaled Digital logo",
    width: 46,
    height: 44,
    className: "h-[44px] w-[46px]",
    wrapperClassName: "overflow-hidden",
    skipMono: true,
  },
  {
    src: "/partnership/logo-rectangle1099.png",
    alt: "Partner logo",
    width: 87,
    height: 43,
    className: "h-[42.524px] w-[87.282px]",
    wrapperClassName: "h-[34.078px] w-[80px] overflow-hidden",
  },
  {},
  {},
  {},
  {},
  {},
  {},
];

interface Differentiator {
  title: string;
  description: ReactNode;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
}

const DIFFERENTIATORS: readonly Differentiator[] = [
  {
    title: "Unmatched SEO Partnership",
    description: (
      <>
        We operate as a true extension of your team - working behind the scenes
        so{" "}
        <strong className="font-bold">
          you stay the hero with your clients.
        </strong>{" "}
        We integrate into your agency&apos;s delivery while enhancing your
        clients relationships.
      </>
    ),
    iconSrc: "/partnership/icon-praying-hand.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Guaranteed Heroic Results",
    description: (
      <>
        We are protecting your agency&apos;s credibility while{" "}
        <strong className="font-bold">driving growth your clients</strong> can
        actually feel. Our clients experience growth that scales as their
        business evolves - because real heroes don&apos;t settle for average.
      </>
    ),
    iconSrc: "/partnership/icon-graph-bar-increase.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Transparent, Actionable Reporting",
    description: (
      <>
        Your clients need to feel the value, and you need to be able to stand
        behind it. Our client-ready reports make performance easy to understand,
        easy to communicate - so{" "}
        <strong className="font-bold">
          every conversation you have builds trust
        </strong>
        , not doubt.
      </>
    ),
    iconSrc: "/partnership/icon-group176781.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "One Platform. Total Control",
    description: (
      <>
        With Partner Portal managing delivery across multiple clients becomes
        easier at scale. Our white-label partner portal centralizes everything
        in real time - track finances, monitor work progress, manage
        deliverables, and order from our full service library - all in one
        place,{" "}
        <strong className="font-bold">built to scale with your agency.</strong>
      </>
    ),
    iconSrc: "/partnership/icon-group176782.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
] as const;

const NEXT_STEPS = [
  {
    title: "SEO audits",
    description:
      "Reveal the issues with your client's current organic search performance and demonstrate why increasing their investment with you is the smart move.",
    iconSrc: "/partnership/icon-group176783.svg",
    iconWidth: 29,
    iconHeight: 32,
  },
  {
    title: "Keyword research",
    description:
      "A detailed map of what your client\u2019s target market is actually searching for - competition levels, monthly volumes, and strategic opportunities delivered as a client or investor-ready asset.",
    iconSrc: "/partnership/icon-group176784.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Long-term planning (Strategy development)",
    description:
      "Structured SEO strategies built around real business goals, not guesswork. Stress-free strategies to walk into every client conversation fully prepared and ready to show them revenue growth projections.",
    iconSrc: "/partnership/icon-group1.svg",
    iconWidth: 30,
    iconHeight: 32,
  },
  {
    title: "On-site optimization",
    description:
      "Ensure every SEO initiative drives results by setting up your client's website for success and uncovering new growth opportunities.",
    iconSrc: "/partnership/icon-group176786.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Link Building accross four continents",
    description:
      "High-quality, multilingual placements across the US, 27+ EU countries, and Asia - so your clients can build authority and improve rankings internationally. Order campaigns directly from the service library.",
    iconSrc: "/partnership/icon-group176787.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Reporting",
    description:
      "Showcase the value of their investment by demonstrating the remarkable benefits and tangible results they're reaping. Our reporting capabilities help you make data-driven decisions to outpace competitors and strategically scale your business.",
    iconSrc: "/partnership/icon-group176788.svg",
    iconWidth: 30,
    iconHeight: 32,
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "What is white label SEO?",
    answer:
      "White-label SEO is a service that allows agencies to offer SEO services to their clients under their own brand, without needing to perform the work in-house. By partnering with a white-label SEO company, agencies can deliver professional SEO strategies, link building, and technical SEO support while an external provider does the actual SEO work. This enables agencies to focus on client management and growth without needing to expand internal SEO teams.",
    defaultOpen: true,
  },
  {
    question: "What are the white label SEO services?",
    answer:
      "White label SEO services include full-spectrum search optimization delivered under your agency's brand. This covers technical SEO audits, on-page optimization, keyword research, content creation, link building, and monthly performance reporting, all presented with your branding so clients see you as the sole provider.",
    defaultOpen: false,
  },
  {
    question: "How does white label link building work?",
    answer:
      "We source, vet, and secure high-quality backlink placements on behalf of your clients while your agency remains the face of the service. You provide the target pages and goals; we handle outreach, content creation, and placement, then deliver client-ready reports branded to your agency.",
    defaultOpen: false,
  },
  {
    question: "How can agencies benefit from white-label SEO services?",
    answer:
      "Agencies gain the ability to offer comprehensive SEO services without hiring an in-house team, increasing monthly recurring revenue and client retention. White-label SEO lets you scale your service offerings, strengthen client relationships, and focus on business development while we handle execution.",
    defaultOpen: false,
  },
  {
    question: "How does our white-label SEO program work?",
    answer:
      "After an onboarding call to understand your clients' needs, we build a custom SEO strategy and begin execution. You receive regular progress updates and branded reports to share directly with your clients. Communication stays seamless through a dedicated account manager who coordinates everything behind the scenes.",
    defaultOpen: false,
  },
  {
    question: "What is a white-label SEO reseller program?",
    answer:
      "A white-label SEO reseller program allows your agency to resell professional SEO services at your own pricing under your own brand. You set the margins, manage the client relationship, and we deliver the work, giving you a scalable revenue stream with minimal operational overhead.",
    defaultOpen: false,
  },
  {
    question:
      "How do we handle client communications in our white-label SEO partnership?",
    answer:
      "All communications are managed through your agency. We provide detailed internal reports and strategic recommendations that you can relay to your clients in your own voice. If needed, we can also join calls as a member of your team to provide technical expertise while maintaining your brand's front-facing role.",
    defaultOpen: false,
  },
  {
    question: "What are the partnership options for white-label SEO services?",
    answer:
      "We offer flexible partnership tiers ranging from project-based link building campaigns to full SEO management retainers. Whether you need support for a single client or want to scale across your entire portfolio, we tailor the scope, pricing, and reporting cadence to match your agency's growth stage.",
    defaultOpen: false,
  },
] as const;

export default function PartnershipPage() {
  return (
    <>
      <section className="pt-[100px]" id="partnerships">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto w-full max-w-[857px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            <GradientText className="gradient-text-partnership-hero">
              White Label SEO Partnership
            </GradientText>{" "}
            Strategies That Grow Your MRR
          </h1>

          <p className="type-paragraph mx-auto mt-5 w-full max-w-[792px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Protect your client relationships and grow your agency&apos;s
            recurring revenue with white-label SEO and link building built for
            scale. We handle the execution, reporting, and strategy - you stay
            the hero, your clients see real results, and everyone grows together
          </p>

          <div className="relative mx-auto mt-[60px] h-[360px] w-full max-w-[350px] lg:mt-[128px] lg:h-[635px] lg:max-w-none">
            <div className="partnership-hero-panel-gradient absolute bottom-0 left-0 h-[255px] w-full rounded-[30px] lg:h-[480px] lg:rounded-[40px]" />

            <div className="absolute bottom-0 left-0 h-[360px] w-full overflow-hidden rounded-[30px] lg:h-[635px] lg:rounded-br-[40px] lg:rounded-tl-none lg:rounded-tr-none">
              <Image
                alt="Classical statue"
                className="pointer-events-none absolute left-[-10%] top-0 h-full w-[120%] max-w-none object-cover object-top lg:left-[9.28%] lg:top-[-12.4%] lg:h-[241.86%] lg:w-[81.12%]"
                fetchPriority="high"
                height={4096}
                priority
                sizes="(min-width: 1440px) 1152px, 350px"
                src="/partnership/hero-statue.webp"
                width={3072}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="partner-with-us">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 xl:px-[70px]">
            <SectionLabel>/ Partner With Us /</SectionLabel>

            <div className="mt-[37px] grid grid-cols-1 gap-12 xl:grid-cols-[1fr_630px] xl:gap-0">
              <h2 className="type-h2 mt-[6px] w-full max-w-[551px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                If You Recognize Yourself Here,{" "}
                <GradientText className="gradient-text-partnership-recognize">
                  We Might Be the Perfect Match
                </GradientText>
              </h2>

              <div>
                {RECOGNIZE_ITEMS.map((item, index) => (
                  <div className={index > 0 ? "mt-10" : ""} key={item.title}>
                    <article className="relative pl-[64px]">
                      <div className="absolute left-0 top-[-4px]">
                        <IconContainer
                          alt=""
                          iconHeight={item.iconHeight}
                          iconWidth={item.iconWidth}
                          src={item.iconSrc}
                        />
                      </div>

                      <h3 className="type-h3 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                        {item.title}
                      </h3>
                      <p className="type-paragraph mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                        {item.description}
                      </p>
                    </article>

                    {item.dividerSrc ? (
                      <div
                        aria-hidden
                        className="mt-9 h-px w-full bg-[var(--color-hr-light-grey)]"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="amplify-authority">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[60px] pt-[60px] sm:px-8 lg:pb-[120px] lg:pt-[120px] xl:px-[70px]">
            <SectionLabel>/ Amplify Authority /</SectionLabel>

            <div className="mt-[43px] grid grid-cols-1 gap-8 xl:grid-cols-[1fr_630px] xl:gap-0">
              <h2 className="type-h2 w-full max-w-[574px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                Turn{" "}
                <GradientText className="gradient-text-partnership-revenue">
                  Organic Traffic
                </GradientText>
                <br />
                Into{" "}
                <GradientText className="gradient-text-partnership-revenue">
                  Predictable Revenue
                </GradientText>
              </h2>

              <p className="type-paragraph w-full max-w-[542px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] xl:ml-auto">
                This isn&apos;t just about outsourcing SEO. It&apos;s a
                long-term partnership designed to strengthen your offer and turn
                organic traffic into a scalable revenue channel. Visibility that
                converts.
              </p>
            </div>

            <div className="mt-[180px] grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
              {AMPLIFY_CARDS.map((card) => (
                <article
                  className={`flex h-full min-h-[512px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-[30px] pb-[30px] pt-[30px] ${card.className}`}
                  key={card.title}
                >
                  <IconContainer
                    alt=""
                    iconHeight={card.iconHeight}
                    iconWidth={card.iconWidth}
                    src={card.iconSrc}
                  />

                  <h3 className="type-h3 mt-[15px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {card.title}
                  </h3>
                  <p className="type-paragraph mt-[10px] leading-[24px]">
                    <GradientText className="gradient-text-partnership-card-subtitle">
                      {card.subtitle}
                    </GradientText>
                  </p>

                  <div className="mt-[29px] space-y-4">
                    {card.body.map((paragraph) => (
                      <p
                        className="type-paragraph text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
                        key={paragraph}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {card.ctaLabel ? (
                    <AppLink
                      className="type-cta motion-interactive motion-interactive-press mt-auto inline-flex h-[38px] w-[209px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                      href="/contact"
                      motionPreset="none"
                    >
                      {card.ctaLabel}
                      <GradientArrowUpRightIcon className="size-[10px]" />
                    </AppLink>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="partnership-scale">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 xl:px-[70px]">
            <SectionLabel>/ Amplify Authority /</SectionLabel>

            <div className="mt-[43px] grid grid-cols-1 gap-10 xl:grid-cols-[1fr_628px] xl:gap-0">
              <div>
                <h2 className="type-h2 w-full max-w-[483px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  <GradientText className="gradient-text-partnership-scale">
                    Partnerships
                  </GradientText>
                  <br />
                  <GradientText className="gradient-text-partnership-scale-dark">
                    Designed to Scale
                  </GradientText>
                </h2>

                <div className="mt-[39px] w-full max-w-[502px] space-y-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  <p className="type-paragraph">
                    Our partnerships scale alongside your business goals and
                    create lasting value for everyone involved.
                  </p>
                  <p className="type-paragraph" style={{ fontWeight: 700 }}>
                    We don&apos;t grow if you don&apos;t - built for mutual
                    growth.
                  </p>
                  <p className="type-paragraph">
                    That&apos;s not a tagline. It&apos;s the foundation of how
                    we operate. Our success is directly tied to yours, which
                    means every link we build, every report we deliver, and
                    every strategy we recommend is made with your agency&apos;s
                    long-term growth in mind. When your clients win, we all win
                  </p>
                  <p className="type-paragraph italic">
                    Trusted by agencies across the US &amp; EU.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 xl:justify-self-end">
                {PARTNER_LOGO_CARDS.map((logo, index) => (
                  <div
                    className="flex h-[100px] w-full items-center justify-center rounded-[20px] bg-[var(--color-hr-off-white)] dark:border dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-surface-inverse-95)]"
                    key={logo.src ?? `empty-${index}`}
                  >
                    {logo.src ? (
                      <div className={logo.wrapperClassName ?? ""}>
                        <Image
                          alt={logo.alt ?? ""}
                          className={`${logo.className ?? ""} ${
                            logo.skipMono
                              ? ""
                              : "[filter:brightness(0)] dark:[filter:brightness(0)_invert(1)]"
                          }`}
                          height={logo.height ?? 48}
                          sizes={`${logo.width ?? 142}px`}
                          src={logo.src}
                          width={logo.width ?? 142}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="partnership-dark-cta">
        <div className={PAGE_SHELL_CLASS}>
          <div className="h-auto min-h-[511px] rounded-[40px] bg-[var(--color-hr-dark)] px-5 pb-12 pt-[110px] text-center sm:px-8 xl:px-[70px]">
            <h3 className="type-h3 mx-auto w-full max-w-[668px] text-[var(--color-hr-pure-white)]">
              Your agency&apos;s growth, managed from one place —{" "}
              <GradientText className="gradient-text-partnership-cta">
                inside your partner portal
              </GradientText>
            </h3>

            <p className="type-paragraph mx-auto mt-10 w-full max-w-[731px] text-[var(--color-hr-pure-white)]">
              Get instant access to everything you need to deliver marketing at
              scale. Track live work progress, manage orders, monitor finances,
              and pull client-ready reports — all from a centralized portal
              built specifically for agency partners. No back-and-forth, no
              chasing updates. Just clarity and control, from day one.
            </p>

            <AppLink
              className="type-cta motion-interactive motion-interactive-press mt-10 inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] [&_svg]:text-[var(--color-hr-pure-white)]"
              href="/contact"
              motionPreset="none"
            >
              Create Your Partner Account
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="distinct-advantage">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[60px] lg:pb-[120px] pt-[60px] lg:pt-[120px] sm:px-8 xl:px-[70px]">
            <SectionLabel>/ Distinct Advantage /</SectionLabel>

            <div className="mt-[43px] grid grid-cols-1 gap-12 xl:grid-cols-[1fr_630px] xl:gap-0">
              <h2 className="type-h2 w-full max-w-[482px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                What Makes Our{" "}
                <GradientText className="gradient-text-partnership-different">
                  White Label SEO
                </GradientText>{" "}
                Services Different?
              </h2>

              <div>
                {DIFFERENTIATORS.map((item, index) => (
                  <div className={index > 0 ? "mt-10" : ""} key={item.title}>
                    <article className="relative pl-[64px]">
                      <div className="absolute left-0 top-[-4px]">
                        <IconContainer
                          alt=""
                          iconHeight={item.iconHeight}
                          iconWidth={item.iconWidth}
                          src={item.iconSrc}
                        />
                      </div>

                      <h3 className="type-h3 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                        {item.title}
                      </h3>
                      <p className="type-paragraph mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                        {item.description}
                      </p>
                    </article>

                    {index < DIFFERENTIATORS.length - 1 ? (
                      <div
                        aria-hidden
                        className="mt-10 h-px w-full bg-[var(--color-hr-light-grey)]"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="white-label-process">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 xl:px-[70px]">
            <SectionLabel>/ White Label SEO Process /</SectionLabel>

            <div className="mt-[43px] grid grid-cols-1 gap-8 xl:grid-cols-[1fr_630px] xl:gap-0">
              <h2 className="type-h2 w-full max-w-[491px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                Oh, You&apos;re Ready To Partner With Us?{" "}
                <GradientText className="gradient-text-partnership-next">
                  What&apos;s Next...
                </GradientText>
              </h2>

              <div className="w-full max-w-[630px] space-y-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                <p className="type-paragraph">
                  From strategy to execution, we&apos;ve got every aspect of
                  your SEO covered - so you can focus on what you do best, while
                  we handle the rest.
                </p>
                <p className="type-paragraph">
                  Whether you need us to handle a specific SEO component or take
                  charge of your entire SEO strategy, we&apos;re adaptable and
                  here to deliver comprehensive support tailored to your exact
                  needs.
                </p>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-[21px] xl:grid-cols-3">
              {NEXT_STEPS.map((step) => (
                <article
                  className="h-auto min-h-[355px] rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-[30px] pb-[30px] pt-[30px] xl:h-[355px]"
                  key={step.title}
                >
                  <IconContainer
                    alt=""
                    iconHeight={step.iconHeight}
                    iconWidth={step.iconWidth}
                    src={step.iconSrc}
                  />

                  <h3 className="type-h3 mt-[15px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {step.title}
                  </h3>
                  <p className="type-paragraph mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServiceFaq
        containerClassName="mt-20 overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]"
        detailsClassName="group"
        detailsExtra={(index) =>
          index !== 0 ? (
            <Image
              alt=""
              aria-hidden
              className="h-px w-full"
              height={1}
              sizes="(min-width: 1280px) 1220px, 100vw"
              src="/partnership/line-13.svg"
              width={1220}
            />
          ) : null
        }
        items={FAQ_ITEMS}
        renderIcon={
          <span className="inline-flex shrink-0 items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="partnership-faq"
      />
    </>
  );
}
