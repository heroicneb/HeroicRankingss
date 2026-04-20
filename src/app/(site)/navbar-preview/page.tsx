import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Navbar Preview",
    description: "Preview route for validating Heroic Rankings navigation styling and behavior across breakpoints.",
    path: "/navbar-preview",
  }),
  robots: { index: false, follow: false },
};

export { default } from "@/components/pages/home/navbar-preview-page";
