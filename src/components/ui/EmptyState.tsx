import Link from "next/link";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}): ReactNode {
  return (
    <div className="flex flex-col items-start border border-dashed border-[var(--color-line)] px-6 py-10">
      <h3 className="vrs-display text-xl text-[var(--color-bone)]">{title}</h3>
      <p className="vrs-meta mt-2 max-w-sm">{description}</p>
      {action && (
        <Link href={action.href} className="vrs-btn-ghost mt-6">
          {action.label}
        </Link>
      )}
    </div>
  );
}
