import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} Open Graph Image`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// next/og (Satori) does not support CSS custom properties in border/gradient styles.
const OG_COLOR = {
  gradient: "linear-gradient(115deg, rgb(31 45 61) 0%, rgb(15 26 39) 50%, rgb(94 122 151) 100%)",
  text: "rgb(255 255 255)",
  border: "1px solid rgb(255 255 255 / 0.35)",
  mutedText: "rgb(255 255 255 / 0.85)",
} as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: OG_COLOR.gradient,
          color: OG_COLOR.text,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: OG_COLOR.border,
            borderRadius: "999px",
            display: "flex",
            fontSize: 34,
            letterSpacing: "0.08em",
            marginBottom: 32,
            padding: "12px 24px",
            textTransform: "uppercase",
          }}
        >
          SEO Agency
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            color: OG_COLOR.mutedText,
            display: "flex",
            fontSize: 36,
            lineHeight: 1.35,
            maxWidth: 940,
            textAlign: "center",
          }}
        >
          Data-driven SEO strategy for long-term organic growth.
        </div>
      </div>
    ),
    size,
  );
}
