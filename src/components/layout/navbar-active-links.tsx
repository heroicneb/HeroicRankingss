"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { isNavItemActive } from "@/lib/nav-active";
import { normalizePath } from "@/lib/normalize-path";
import { AppLink } from "@/components/ui/app-link";
import { ChevronDownIcon } from "@/components/ui/icons";
import type { NavItem } from "@/types";

export interface NavbarActiveLinksProps {
  navItems: NavItem[];
}

export function NavbarActiveLinks({ navItems }: NavbarActiveLinksProps) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [openDropdown, setOpenDropdown] = useState<{ label: string; pathname: string } | null>(null);
  const activeNavLabel: NavItem["label"] | null =
    navItems.find((item) => isNavItemActive(normalizedPathname, { href: item.href, label: item.label }))?.label ?? null;

  useEffect(() => {
    if (!openDropdown) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (!event.target.closest("[data-nav-dropdown]")) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown]);

  return (
    <ul className="hidden items-center gap-[10px] lg:flex" data-nav-theme-sync>
      {navItems.map((item) => {
        const isActiveItem = item.label === activeNavLabel;
        const isOpenDropdown = openDropdown?.label === item.label && openDropdown.pathname === normalizedPathname;

        if (item.children) {
          return (
            <li className="relative" data-nav-dropdown key={item.label}>
              <button
                aria-expanded={isOpenDropdown}
                aria-haspopup="menu"
                className={cn(
                  "type-nav motion-interactive motion-interactive-press inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-[14px] py-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]",
                  isActiveItem
                    ? "bg-[var(--color-hr-dark)] !text-[var(--color-text-inverse)] [-webkit-text-fill-color:var(--color-text-fill-light)] hover:bg-[var(--color-hr-dark)] dark:bg-[var(--color-text-inverse)] dark:!text-[var(--color-text-fill-dark)] dark:[-webkit-text-fill-color:var(--color-text-fill-dark)] dark:hover:bg-[var(--color-bg-primary)]"
                    : "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]",
                )}
                onClick={() =>
                  setOpenDropdown((current) =>
                    current?.label === item.label && current.pathname === normalizedPathname
                      ? null
                      : { label: item.label, pathname: normalizedPathname },
                  )
                }
                type="button"
              >
                {item.label}
                <ChevronDownIcon
                  className={cn(
                    "h-auto w-2 transition-transform",
                    isOpenDropdown ? "rotate-180" : "",
                  )}
                />
              </button>

              <div
                className={cn(
                  "absolute left-0 top-[42px] z-20 w-[246px] rounded-[24px] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] p-[10px] shadow-[var(--shadow-nav-dropdown)] dark:shadow-[var(--shadow-nav-dropdown-dark)] transition-[opacity,transform] duration-200 ease-out",
                  isOpenDropdown ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1 pointer-events-none",
                )}
                role="menu"
              >
                {item.children.map((child) => {
                  const isActiveChild = normalizePath(child.href) === normalizedPathname;

                  return (
                    <AppLink
                      aria-current={isActiveChild ? "page" : undefined}
                      className={cn(
                        "type-nav block rounded-[50px] px-[14px] py-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]",
                        isActiveChild
                          ? "bg-[var(--color-hr-dark)] !text-[var(--color-text-inverse)] [-webkit-text-fill-color:var(--color-text-fill-light)] hover:bg-[var(--color-hr-dark)] dark:bg-[var(--color-text-inverse)] dark:!text-[var(--color-text-fill-dark)] dark:[-webkit-text-fill-color:var(--color-text-fill-dark)] dark:hover:bg-[var(--color-bg-primary)]"
                          : "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]",
                      )}
                      href={child.href}
                      key={child.label}
                      onClick={() => setOpenDropdown(null)}
                      role="menuitem"
                    >
                      {child.label}
                    </AppLink>
                  );
                })}
              </div>
            </li>
          );
        }

        return (
          <li key={item.label}>
            <AppLink
              aria-current={isActiveItem ? "page" : undefined}
              className={cn(
                "type-nav inline-flex items-center rounded-[var(--radius-pill)] px-[14px] py-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]",
                isActiveItem
                  ? "bg-[var(--color-hr-dark)] !text-[var(--color-text-inverse)] [-webkit-text-fill-color:var(--color-text-fill-light)] hover:bg-[var(--color-hr-dark)] dark:bg-[var(--color-text-inverse)] dark:!text-[var(--color-text-fill-dark)] dark:[-webkit-text-fill-color:var(--color-text-fill-dark)] dark:hover:bg-[var(--color-bg-primary)]"
                  : "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]",
              )}
              href={item.href}
            >
              {item.label}
            </AppLink>
          </li>
        );
      })}
    </ul>
  );
}
