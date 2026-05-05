import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { TeamMemberDetail } from "@/components/pages/team/team-member-detail";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { PersonSchema } from "@/components/seo/person-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getTeamMemberBySlug, getTeamMemberSlugs } from "@/lib/sanity-data";

export const dynamic = "force-dynamic";

interface TeamMemberPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Topics this team's profiles are known for. Used as `Person.knowsAbout` in
 * the JSON-LD payload to strengthen entity SEO. Generic to the agency, not
 * per-member, so all profile pages stay self-consistent.
 */
const KNOWS_ABOUT_TOPICS = [
  "Search Engine Optimization",
  "Technical SEO",
  "Content Marketing",
  "Link Building",
  "Keyword Research",
  "Digital Marketing Strategy",
];

function firstParagraph(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function generateStaticParams() {
  const slugs = await getTeamMemberSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const cleanRole = member.role.replace(/^\/\s*|\s*\/$/g, "").trim();
  const titleSuffix = cleanRole ? `, ${cleanRole}` : "";
  const title = `${member.name}${titleSuffix} | Heroic Rankings`;
  const description =
    firstParagraph(member.bio) ??
    firstParagraph(member.bioParagraphs?.[0] ?? null) ??
    `${member.name}${titleSuffix} at Heroic Rankings.`;

  const base = createPageMetadata({
    title,
    description,
    path: `/team/${slug}`,
    ogType: "article",
  });

  // Strip explicit `images` keys so Next can auto-populate from the per-route
  // opengraph-image.tsx file (Next 16 hashes the OG route URL automatically;
  // an explicit images URL would bypass that resolution and 404).
  const { images: _baseOg, ...openGraphRest } = base.openGraph ?? {};
  const { images: _baseTw, ...twitterRest } = base.twitter ?? {};
  void _baseOg;
  void _baseTw;
  return {
    ...base,
    openGraph: openGraphRest,
    twitter: twitterRest,
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const description =
    firstParagraph(member.bio) ??
    firstParagraph(member.bioParagraphs?.[0] ?? null);
  const cleanRole = member.role.replace(/^\/\s*|\s*\/$/g, "").trim();
  const photo = member.cardImageUrl || member.photoUrl || null;

  const sameAs = (member.socialLinks ?? []).map((social) => social.url);

  return (
    <>
      <Suspense fallback={null}>
        <BreadcrumbSchema
          items={[
            { name: "Home", href: "/" },
            { name: "About Us", href: "/about-us" },
            { name: member.name, href: `/team/${slug}` },
          ]}
        />
        <PersonSchema
          dateCreated={member.createdAt}
          dateModified={member.updatedAt}
          description={description}
          image={photo}
          jobTitle={cleanRole || member.role}
          knowsAbout={KNOWS_ABOUT_TOPICS}
          name={member.name}
          sameAs={sameAs}
          slug={slug}
        />
      </Suspense>
      <TeamMemberDetail member={member} />
    </>
  );
}
