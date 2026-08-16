"use client";

import Link from "next/link";
import { useDeviceClass } from "@/components/responsive/useDeviceClass";
import type { Crumb } from "./breadcrumb-model";

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const SEPARATOR = (
  <span aria-hidden className="px-2 text-[var(--color-line-strong)]">
    /
  </span>
);

/**
 * Sits directly beneath the top bar, left-aligned on desktop. Parent levels
 * stay interactive; the current level carries the strongest contrast. On
 * mobile the middle of the trail collapses so the ends stay readable.
 */
export function Breadcrumb({ crumbs }: BreadcrumbProps) {
  const deviceClass = useDeviceClass();
  if (crumbs.length === 0) return null;

  const last = crumbs[crumbs.length - 1]!;
  const parents = crumbs.slice(0, -1);
  const collapse = deviceClass === "mobile" && parents.length > 1;
  const visibleParents = collapse ? parents.slice(-1) : parents;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex h-[var(--spacing-crumbbar)] items-center border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-ink)_88%,transparent)] px-4 backdrop-blur-md sm:px-6 lg:px-8"
    >
      <ol className="flex min-w-0 items-center text-[0.8125rem] tracking-wide">
        {collapse && (
          <li className="flex items-center">
            <Link
              href={parents[0]!.href}
              className="text-[var(--color-bone-faint)] transition-colors hover:text-[var(--color-bone)]"
              aria-label={`Back to ${parents[0]!.label}`}
            >
              …
            </Link>
            {SEPARATOR}
          </li>
        )}

        {visibleParents.map((crumb) => (
          <li key={`${crumb.level}-${crumb.href}`} className="flex min-w-0 items-center">
            <Link
              href={crumb.href}
              className="truncate text-[var(--color-bone-faint)] transition-colors hover:text-[var(--color-bone)]"
            >
              {crumb.label}
            </Link>
            {SEPARATOR}
          </li>
        ))}

        <li className="min-w-0">
          <span
            aria-current="page"
            className="block truncate font-medium text-[var(--color-bone)]"
          >
            {last.label}
          </span>
        </li>
      </ol>
    </nav>
  );
}
