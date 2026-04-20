"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import ThemeToggle from "@/components/theme-toggle";
import { AppLink } from "@/components/ui/app-link";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { isNavItemActive } from "@/lib/nav-active";
import { normalizePath } from "@/lib/normalize-path";
import type { NavItem } from "@/types";

interface MobileMenuProps {
  navItems: NavItem[];
  phone: string;
  ctaLabel: string;
  ctaUrl: string;
}

interface MobileMenuItem {
  label: string;
  href: string;
}

export function buildMobileMenuItems(navItems: NavItem[]): MobileMenuItem[] {
  const byLabel = new Map(navItems.map((item) => [item.label, item]));
  const seoItem = byLabel.get("SEO");
  const seoChildrenByLabel = new Map((seoItem?.children ?? []).map((item) => [item.label, item]));

  return [
    byLabel.get("Home"),
    byLabel.get("About Us"),
    seoItem ? { label: "All SEO Services", href: seoItem.href } : undefined,
    seoChildrenByLabel.get("On-Page SEO Services"),
    seoChildrenByLabel.get("Technical SEO Services"),
    seoChildrenByLabel.get("Local SEO Services"),
    seoChildrenByLabel.get("E-commerce Services"),
    seoChildrenByLabel.get("Content Creation Services"),
    seoChildrenByLabel.get("Keyword Strategy Services"),
    byLabel.get("Link Building"),
    byLabel.get("Partnership"),
    byLabel.get("Insights"),
    byLabel.get("Case Studies"),
    byLabel.get("Podcast"),
  ].filter((item): item is MobileMenuItem => Boolean(item));
}

export function MobileMenu({
  navItems,
  phone,
  ctaLabel,
  ctaUrl,
}: MobileMenuProps) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const isOpen = openForPath === normalizedPathname;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const menuItems = useMemo<MobileMenuItem[]>(() => buildMobileMenuItems(navItems), [navItems]);

  const closeMenu = useCallback((options?: { restoreFocus?: boolean }) => {
    setOpenForPath(null);

    if (options?.restoreFocus) {
      window.requestAnimationFrame(() => {
        toggleButtonRef.current?.focus();
      });
    }
  }, []);
  const toggleMenu = () =>
    setOpenForPath((current) => (current === normalizedPathname ? null : normalizedPathname));

  const handleNavClick = (href: string) => {
    import("@/lib/tracking").then(({ trackEvent }) => {
      trackEvent("nav_click", { link: href, location: "mobile_menu_overlay" });
    });
    closeMenu();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const panelNode = panelRef.current;
    document.body.classList.add("overflow-hidden");

    const focusable = panelNode
      ? Array.from(panelNode.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      : [];
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu({ restoreFocus: true });
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  return (
    <>
      <div className="flex items-center gap-[10px] lg:hidden">
        <a
          aria-label="Call Heroic Rankings"
          className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-center rounded-[14px] border border-[var(--color-hr-light-grey)] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]"
          href={`tel:${phone.replace(/\s/g, "")}`}
        >
          <PhoneIcon className="size-[19px]" />
        </a>

        <ThemeToggle />

        <button
          aria-controls="mobile-menu-overlay"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-center rounded-[14px] border border-[var(--color-hr-light-grey)] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]"
          onClick={toggleMenu}
          ref={toggleButtonRef}
          type="button"
        >
          {isOpen ? <CloseIcon className="size-[28px]" /> : <MenuIcon className="size-[28px]" />}
        </button>
      </div>

      <div
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-[70] lg:hidden transition-[visibility]",
          isOpen ? "visible" : "invisible delay-300",
        )}
        id="mobile-menu-overlay"
      >
        <button
          aria-label="Close menu"
          className={cn(
            "absolute inset-0 bg-[var(--color-overlay-scrim-soft)] transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]",
            isOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => closeMenu({ restoreFocus: true })}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        />

        <div className={cn(
          "absolute inset-0 p-[5px] transition-[opacity,transform] duration-300",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none",
        )}>
          <div
            className="flex h-full flex-col overflow-hidden rounded-[20px] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]"
            ref={panelRef}
          >
            <div className="flex items-center justify-between px-[15px] py-[12px] shadow-[var(--shadow-navbar)]">
              <AppLink aria-label="Heroic Rankings" className="inline-flex items-center" href="/" motionPreset="none" tabIndex={isOpen ? 0 : -1}>
                {/* WHY: Mobile drawer logo is non-critical for initial paint and should not be priority-loaded. */}
                <Image
                  alt=""
                  aria-hidden
                  className="dark:brightness-0 dark:invert"
                  height={30}
                  src="/figma/footer/logo-mark.svg"
                  width={27}
                />
              </AppLink>

              <div className="flex items-center gap-[10px]">
                <a
                  aria-label="Call Heroic Rankings"
                  className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-center rounded-[14px] border border-[var(--color-hr-light-grey)] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]"
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <PhoneIcon className="size-[19px]" />
                </a>

                <ThemeToggle />

                <button
                  aria-label="Close menu"
                  className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-center rounded-[14px] border border-[var(--color-hr-light-grey)] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]"
                  onClick={() => closeMenu({ restoreFocus: true })}
                  tabIndex={isOpen ? 0 : -1}
                  type="button"
                >
                  <CloseIcon className="size-[28px]" />
                </button>
              </div>
            </div>

            <ul className="flex-1 space-y-4 overflow-y-auto px-[10px] py-4">
              {menuItems.map((item) => {
                const isActive = isNavItemActive(normalizedPathname, item);

                return (
                  <li key={item.label}>
                    <AppLink
                      className={cn(
                        "flex min-h-[44px] w-full items-center justify-center rounded-[50px] px-[14px] py-[6px] text-center text-[16px] font-normal leading-[1] text-[var(--color-hr-dark)]",
                        "hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]",
                        isActive
                          ? "bg-[var(--color-hr-dark)] text-[var(--color-hr-pure-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
                          : "dark:text-[var(--color-text-inverse)]",
                      )}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {item.label}
                    </AppLink>
                  </li>
                );
              })}
            </ul>

            <div className="px-[10px] pb-[10px] pt-4">
              <AppLink
                className="type-cta motion-interactive motion-interactive-press flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:border-[var(--color-border-inverse-20)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                href={ctaUrl}
                motionPreset="none"
                onClick={() => {
                  import("@/lib/tracking").then(({ trackEvent }) => {
                    trackEvent("cta_click", { location: "mobile_menu_overlay" });
                  });
                  closeMenu();
                }}
                tabIndex={isOpen ? 0 : -1}
              >
                {ctaLabel}
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
