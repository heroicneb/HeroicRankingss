import { ImageResponse } from "next/og";

import { getTeamMemberBySlug } from "@/lib/sanity-data";
import { SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} team profile`;

// next/og (Satori) does not support CSS custom properties — use raw rgb() literals.
const OG_COLOR = {
  bgGradient:
    "linear-gradient(115deg, rgb(31 45 61) 0%, rgb(15 26 39) 50%, rgb(94 122 151) 100%)",
  primary: "rgb(255 255 255)",
  muted: "rgb(255 255 255 / 0.75)",
  rule: "rgb(255 255 255 / 0.25)",
} as const;

export default async function TeamMemberOg({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  const name = member?.name ?? SITE_NAME;
  const role = member?.role
    ? member.role.replace(/^\/\s*|\s*\/$/g, "").trim()
    : "";
  const photo = member?.cardImageUrl || member?.photoUrl || null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        background: OG_COLOR.bgGradient,
        color: OG_COLOR.primary,
        padding: 80,
        gap: 60,
      }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          height={470}
          src={photo}
          style={{
            borderRadius: 32,
            objectFit: "cover",
            border: `1px solid ${OG_COLOR.rule}`,
          }}
          width={350}
        />
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {role ? (
          <div
            style={{
              fontSize: 28,
              color: OG_COLOR.muted,
              letterSpacing: "0.04em",
            }}
          >
            {`/ ${role} /`}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.05,
            color: OG_COLOR.primary,
            letterSpacing: "-0.02em",
            fontWeight: 600,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 28, color: OG_COLOR.muted, marginTop: 24 }}>
          heroicrankings.com
        </div>
      </div>
    </div>,
    size,
  );
}
