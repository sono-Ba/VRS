"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ROLE_LABELS } from "@/auth/accounts";
import type { Permission } from "@/auth/permissions";
import { routes } from "@/lib/routes";
import { useCompareStore } from "@/stores/compare-store";
import { useSessionStore } from "@/stores/session-store";
import { useDeviceClass } from "@/components/responsive/useDeviceClass";

interface NavLink {
  href: string;
  label: string;
  /** Omitted for links every visitor, including guests, may use. */
  permission?: Permission;
}

const CLIENT_LINKS: NavLink[] = [
  { href: routes.home(), label: "Explore" },
  { href: routes.saved(), label: "Saved", permission: "favorites:manage_own" },
  { href: routes.compare(), label: "Compare" },
  { href: routes.enquiries(), label: "Enquiries", permission: "leads:create" },
];

const WORKSPACE_LINKS: NavLink[] = [
  { href: routes.sales(), label: "Sales", permission: "sales_sessions:create" },
  { href: routes.salesManager(), label: "Team", permission: "leads:view_team" },
  { href: routes.admin(), label: "Admin", permission: "content:manage" },
  { href: routes.system(), label: "System", permission: "system:manage" },
];

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const deviceClass = useDeviceClass();
  const user = useSessionStore((state) => state.user);
  const canDo = useSessionStore((state) => state.can);
  const signOut = useSessionStore((state) => state.signOut);
  const compareCount = useCompareStore(
    (state) => state.unitIds.length + state.projectIds.length
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const visible = (links: NavLink[]) =>
    links.filter((link) => !link.permission || canDo(link.permission));

  const clientLinks = visible(CLIENT_LINKS);
  const workspaceLinks = visible(WORKSPACE_LINKS);
  const isCompact = deviceClass !== "desktop";

  const linkClass = (href: string) => {
    const active =
      href === routes.home() ? pathname === href : pathname.startsWith(href);
    return `text-[0.8125rem] tracking-[0.08em] uppercase transition-colors ${
      active
        ? "text-[var(--color-sand)]"
        : "text-[var(--color-bone-dim)] hover:text-[var(--color-bone)]"
    }`;
  };

  return (
    <header className="flex h-[var(--spacing-topbar)] items-center justify-between gap-4 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-ink)_92%,transparent)] px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <Link href={routes.home()} className="flex items-baseline gap-2">
        <span className="vrs-display text-lg text-[var(--color-bone)]">VRS</span>
        <span className="hidden text-[0.625rem] uppercase tracking-[0.24em] text-[var(--color-bone-faint)] sm:inline">
          Residences
        </span>
      </Link>

      {!isCompact && (
        <nav aria-label="Primary" className="flex items-center gap-7">
          {clientLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
              {link.href === routes.compare() && compareCount > 0 && (
                <span className="ml-1.5 text-[var(--color-sand)]">{compareCount}</span>
              )}
            </Link>
          ))}
          {workspaceLinks.length > 0 && (
            <span aria-hidden className="h-4 w-px bg-[var(--color-line-strong)]" />
          )}
          {workspaceLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-3" ref={menuRef}>
        {isCompact && compareCount > 0 && (
          <Link
            href={routes.compare()}
            className="text-[0.75rem] uppercase tracking-[0.08em] text-[var(--color-sand)]"
          >
            Compare {compareCount}
          </Link>
        )}

        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex min-h-11 items-center gap-2 text-left"
            >
              <span className="flex h-8 w-8 items-center justify-center border border-[var(--color-line-strong)] text-[0.6875rem] tracking-widest text-[var(--color-bone)]">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
              {!isCompact && (
                <span className="leading-tight">
                  <span className="block text-[0.8125rem] text-[var(--color-bone)]">
                    {user.firstName}
                  </span>
                  <span className="block text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-bone-faint)]">
                    {ROLE_LABELS[user.role]}
                  </span>
                </span>
              )}
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="vrs-panel absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 p-2"
              >
                {isCompact &&
                  [...clientLinks, ...workspaceLinks].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="block px-3 py-2.5 text-[0.8125rem] text-[var(--color-bone-dim)] hover:bg-[var(--color-ink-soft)] hover:text-[var(--color-bone)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                {isCompact && <div className="vrs-rule my-2" />}
                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    await signOut();
                    router.refresh();
                  }}
                  className="block w-full px-3 py-2.5 text-left text-[0.8125rem] text-[var(--color-bone-dim)] hover:bg-[var(--color-ink-soft)] hover:text-[var(--color-bone)]"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {isCompact && (
              <Link href={routes.compare()} className={linkClass(routes.compare())}>
                Compare
              </Link>
            )}
            <Link
              href={`${routes.signIn()}?next=${encodeURIComponent(pathname)}`}
              className="vrs-btn-ghost !min-h-9 !px-4"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
