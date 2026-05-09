import Image from "next/image";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import type { TeamMember } from "@/types";

const MEMBERS: TeamMember[] = [
  {
    name: "Nebojša Janković",
    role: "/  Founder & CEO  /",
    imageSrc: "/figma/team/nebojsa.webp",
    imageAlt: "Nebojša Janković portrait",
    href: "/about/nebojsa-jankovic",
  },
  {
    name: "Anastasija Janković",
    role: "/  Co-Founder & CHRO  /",
    imageSrc: "/figma/team/anastasija.webp",
    imageAlt: "Anastasija Janković portrait",
    offsetClassName: "min-[1360px]:translate-y-[70px]",
    href: "/about/anastasija-jankovic",
  },
];

export function Team() {
  return (
    <section className="section-shell pt-[60px] lg:pt-16">
      <Container>
        <div className="mx-auto flex max-w-[350px] flex-col items-center lg:hidden">
          <div className="flex w-[348px] flex-col items-center gap-5 text-center">
            <SectionLabel>
              /{"  "}The Team{"  "}/
            </SectionLabel>
            <h2 className="type-h2 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              We stand out by turning search into a measurable revenue engine
            </h2>
          </div>

          <div className="mt-10 flex flex-col items-center pb-[10px]">
            <p className="text-[120px] font-semibold leading-none tracking-[-0.02em] text-transparent [text-shadow:none] [-webkit-text-stroke:1px_var(--color-hr-accent)]">
              20+
            </p>
            <p className="type-paragraph mt-1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              professionals in our team
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-10">
            {MEMBERS.map((member) => (
              <AppLink
                aria-label={`Open team profile: ${member.name}`}
                className={cn(
                  "group relative block h-[454px] w-[350px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]",
                )}
                href={member.href}
                key={member.name}
              >
                <Image
                  alt={member.imageAlt}
                  className="h-[350px] w-[350px] rounded-[30px] object-cover"
                  height={350}
                  quality={95}
                  sizes="700px"
                  src={member.imageSrc}
                  width={350}
                />
                <h3 className="type-team-title mt-5 px-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {member.name}
                </h3>
                <p className="mt-[10px] px-5 text-[18px] leading-6 text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                  {member.role}
                </p>
                <span
                  aria-hidden
                  className="absolute right-5 top-[270px] inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:scale-105 dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                >
                  <ArrowUpRightIcon className="size-5" />
                </span>
              </AppLink>
            ))}
          </div>

          <AppLink
            className="type-cta motion-interactive motion-interactive-press mt-10 inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
            href="/about"
            motionPreset="none"
          >
            More About Us
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>

        <div className="hidden gap-10 lg:grid min-[1360px]:grid-cols-[506px_630px] min-[1360px]:gap-[144px]">
          <div>
            <SectionLabel>
              /{"  "}The Team{"  "}/
            </SectionLabel>
            <h2 className="type-h2 mt-5 max-w-[506px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              <span className="block">We stand out by</span>
              <span className="block">turning search into</span>
              <span className="block">a measurable</span>
              <span className="block">revenue engine</span>
            </h2>
            <p className="mt-5 text-[72px] font-semibold leading-none tracking-[-0.02em] text-transparent [text-shadow:none] [-webkit-text-stroke:1px_var(--color-hr-accent)] min-[1280px]:text-[120px]">
              20+
            </p>
            <p className="type-paragraph mt-1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              professionals in our team
            </p>
            <AppLink
              className="type-cta motion-interactive motion-interactive-press mt-12 inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
              href="/about"
              motionPreset="none"
            >
              More About Us
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
          <div className="grid justify-center gap-5 sm:grid-cols-2 min-[1360px]:justify-start">
            {MEMBERS.map((member) => (
              <AppLink
                aria-label={`Open team profile: ${member.name}`}
                className={cn(
                  member.offsetClassName,
                  "group relative block h-[409px] w-[305px] rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]",
                )}
                href={member.href}
                key={`desktop-${member.name}`}
              >
                <Image
                  alt={member.imageAlt}
                  className="h-[305px] w-[305px] rounded-t-[var(--radius-card)] object-cover"
                  height={305}
                  quality={95}
                  sizes="305px"
                  src={member.imageSrc}
                  width={305}
                />
                <h3 className="type-team-title mt-5 px-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {member.name}
                </h3>
                <p className="type-paragraph mt-[10px] px-5 text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                  {member.role}
                </p>
                <span
                  aria-hidden
                  className="absolute right-5 top-[213px] inline-flex size-[72px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:scale-105 dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                >
                  <ArrowUpRightIcon className="size-7" />
                </span>
              </AppLink>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
