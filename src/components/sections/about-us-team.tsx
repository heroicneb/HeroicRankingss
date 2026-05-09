import Image from "next/image";
import Link from "next/link";

import { TEAM_MEMBERS } from "@/components/sections/about-us-team-data";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import type { SanityTeamMember } from "@/lib/sanity-data";
import type { AboutTeamMember } from "@/types";

const HARDCODED_MEMBER_BY_NAME = new Map(
  TEAM_MEMBERS.map((member) => [member.name, member]),
);
const BECOME_A_HERO_MEMBER = TEAM_MEMBERS.find(
  (member) => member.name === "Become a Hero",
);

function buildCmsTeamRoster(cmsMembers: SanityTeamMember[]): AboutTeamMember[] {
  return cmsMembers
    .map((cmsMember) => {
      const hardcodedMember = HARDCODED_MEMBER_BY_NAME.get(cmsMember.name);
      const imageSrc =
        cmsMember.photoUrl ||
        cmsMember.cardImageUrl ||
        hardcodedMember?.imageSrc;

      if (!imageSrc) {
        return null;
      }

      const rawRole = cmsMember.role || hardcodedMember?.role || "";
      const normalizedRole = rawRole.startsWith("/")
        ? rawRole
        : rawRole
          ? `/ ${rawRole} /`
          : "";
      const slug = cmsMember.slug?.current ?? hardcodedMember?.slug;
      const built: AboutTeamMember = {
        name: cmsMember.name,
        role: normalizedRole,
        imageSrc,
        imageAlt:
          cmsMember.photoAlt ||
          hardcodedMember?.imageAlt ||
          `${cmsMember.name} portrait`,
      };
      if (slug) built.slug = slug;
      return built;
    })
    .filter((member): member is AboutTeamMember => Boolean(member));
}

interface AboutUsTeamProps {
  cmsTeamMembers?: SanityTeamMember[];
}

export function AboutUsTeam({ cmsTeamMembers }: AboutUsTeamProps) {
  const hasCmsData = Boolean(cmsTeamMembers && cmsTeamMembers.length > 0);
  const cmsRoster = hasCmsData ? buildCmsTeamRoster(cmsTeamMembers ?? []) : [];

  const teamMembers =
    hasCmsData && cmsRoster.length > 0 ? cmsRoster : TEAM_MEMBERS;
  const membersWithCta =
    BECOME_A_HERO_MEMBER &&
    !teamMembers.some((member) => member.name === BECOME_A_HERO_MEMBER.name)
      ? [...teamMembers, BECOME_A_HERO_MEMBER]
      : teamMembers;

  return (
    <section className="pt-[60px] lg:pt-[120px]" id="about-us-team">
      <div className="mx-auto w-full max-w-[1440px] px-[15px] lg:px-[40px]">
        <SectionLabel className="text-center lg:text-left">
          / Our Team /
        </SectionLabel>
        <h2 className="type-h2 mt-[43px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
          Meet Your{" "}
          <GradientText className="gradient-text-brand-about-us-team-title">
            Core Heroes
          </GradientText>
        </h2>

        <div className="mt-[40px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {membersWithCta.map((member) => {
            const cardClass =
              "motion-interactive motion-interactive-press group relative block overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] pb-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:rounded-[40px] lg:pb-7";

            if (member.slug) {
              return (
                <Link
                  aria-label={`Open team profile: ${member.name}`}
                  className={cardClass}
                  href={`/about/${member.slug}`}
                  key={member.name}
                >
                  <TeamCard member={member} showArrow />
                </Link>
              );
            }

            if (member.name === "Become a Hero") {
              return (
                <AppLink
                  aria-label="Apply to join Heroic Rankings"
                  className={cardClass}
                  href="/contact"
                  key={member.name}
                  motionPreset="none"
                >
                  <TeamCard member={member} showArrow />
                </AppLink>
              );
            }

            return (
              <div
                className="relative block cursor-default overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] pb-5 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:rounded-[40px] lg:pb-7"
                key={member.name}
              >
                <TeamCard member={member} showArrow={false} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TeamCard({
  member,
  showArrow,
}: {
  member: AboutTeamMember;
  showArrow: boolean;
}) {
  return (
    <>
      <Image
        alt={member.imageAlt}
        className={cn(
          "aspect-square w-full rounded-[30px] object-cover lg:rounded-[40px]",
          member.name === "Become a Hero"
            ? "bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)]"
            : "",
        )}
        height={305}
        loading="lazy"
        quality={95}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        src={member.imageSrc}
        width={305}
      />

      <h3 className="type-team-title mt-5 px-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mt-6 lg:text-left">
        {member.name}
      </h3>
      {member.isRoleGradient ? (
        <GradientText
          as="p"
          className="gradient-text-brand-about-us-team-role type-paragraph mt-1 !block min-h-[3em] px-5 text-center lg:mt-2 lg:text-left"
        >
          {member.role}
        </GradientText>
      ) : (
        <p className="type-paragraph mt-1 min-h-[3em] px-5 text-center text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)] lg:mt-2 lg:text-left">
          {member.role}
        </p>
      )}

      {showArrow ? (
        <span
          aria-hidden
          className="absolute right-4 top-[213px] inline-flex size-[62px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:scale-105 dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] lg:right-5 lg:size-[72px]"
        >
          <ArrowUpRightIcon className="size-6 lg:size-7" />
        </span>
      ) : null}
    </>
  );
}
