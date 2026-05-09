import Image from "next/image";

import { NavbarActiveLinks } from "@/components/layout/navbar-active-links";
import { MobileMenu } from "@/components/layout/mobile-menu";
import ThemeToggle from "@/components/theme-toggle";
import { AppLink } from "@/components/ui/app-link";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SITE_PHONE } from "@/lib/site";
import type { NavItem } from "@/types";

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "SEO",
    href: "/seo",
    children: [
      { label: "All SEO Services", href: "/seo" },
      { label: "On-Page SEO Services", href: "/seo/on-page" },
      { label: "Technical SEO Services", href: "/seo/technical" },
      { label: "Local SEO Services", href: "/seo/local" },
      { label: "E-commerce Services", href: "/seo/e-commerce" },
      { label: "Content Creation Services", href: "/seo/content-creation" },
      { label: "Keyword Strategy Services", href: "/seo/keyword-research" },
    ],
  },
  { label: "Link Building", href: "/seo/linkbuilding" },
  { label: "Partnership", href: "/partnership" },
  { label: "Insights", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Podcast", href: "/podcast" },
];

interface NavbarProps {
  navItems?: NavItem[];
  phone?: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export function Navbar({ navItems, phone, ctaLabel, ctaUrl }: NavbarProps) {
  const baseItems = navItems?.length ? navItems : NAV_ITEMS;
  const hasPodcast = baseItems.some((item) => item.href === "/podcast");
  const itemsWithPodcast = hasPodcast
    ? baseItems
    : [...baseItems, { label: "Podcast", href: "/podcast" }];
  const items = itemsWithPodcast.map((item) => {
    if (!item.children?.length || !item.href) return item;
    if (item.children.some((child) => child.href === item.href)) return item;
    return {
      ...item,
      children: [
        { label: `All ${item.label} Services`, href: item.href },
        ...item.children,
      ],
    };
  });
  const resolvedPhone = phone?.trim() || SITE_PHONE;
  const resolvedCtaLabel = ctaLabel?.trim() || "Get Started";
  const resolvedCtaUrl = ctaUrl?.trim() || "/contact";

  return (
    <header className="sticky top-0 z-50 w-full" id="home">
      <div className="mx-auto w-full max-w-[1440px] px-[5px] md:px-[10px]">
        <nav
          aria-label="Primary"
          className="relative mt-[5px] flex h-[69px] items-center justify-between rounded-[20px] border border-transparent bg-[var(--color-hr-pure-white)] px-[15px] py-[12px] shadow-[var(--shadow-navbar)] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-bg-dark)] dark:shadow-[var(--shadow-navbar-dark)] lg:mt-[14px] lg:rounded-[var(--radius-panel)] lg:px-3 lg:py-3 xl:pl-[20px] xl:pr-[12px] xl:py-[12px]"
        >
          <div className="flex min-w-0 items-center gap-10">
            <AppLink
              aria-label="Heroic Rankings"
              className="flex h-11 w-11 items-center justify-center lg:h-auto lg:w-auto"
              href="/"
              motionPreset="none"
            >
              {/* WHY: The navbar brand is above the fold on every route, so eager loading avoids delayed logo paint. */}
              <Image
                alt=""
                aria-hidden
                className="hidden dark:brightness-0 dark:invert lg:block"
                height={30}
                loading="eager"
                src="/figma/navbar/logo-wordmark.svg"
                width={109}
              />
              <Image
                alt=""
                aria-hidden
                className="dark:brightness-0 dark:invert lg:hidden"
                height={30}
                loading="eager"
                src="/figma/footer/logo-mark.svg"
                width={27}
              />
            </AppLink>

            <NavbarActiveLinks navItems={items} />
          </div>

          <div className="hidden shrink-0 items-center gap-[20px] lg:flex">
            <ThemeToggle />

            <AppLink
              aria-label={resolvedCtaLabel}
              className="motion-interactive motion-interactive-press inline-flex items-center justify-center gap-[10px] rounded-[16px] border border-[var(--color-hr-accent)] bg-transparent px-[20px] py-[12px] text-[16px] font-medium leading-none whitespace-nowrap text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
              href={resolvedCtaUrl}
              motionPreset="none"
            >
              {resolvedCtaLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>

          <MobileMenu
            navItems={items}
            phone={resolvedPhone}
            ctaLabel={resolvedCtaLabel}
            ctaUrl={resolvedCtaUrl}
          />
        </nav>
      </div>
    </header>
  );
}

export { NAV_ITEMS };
