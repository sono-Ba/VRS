import type { ReactNode } from "react";

/**
 * Scrollable frame for the non-immersive surfaces (account, compare,
 * workspaces). Visually related to the immersive shell — same tokens, same
 * type — but denser and vertically scrolling.
 */
export function PageFrame({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="vrs-scroll min-h-0 flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            {eyebrow && <p className="vrs-eyebrow">{eyebrow}</p>}
            <h1 className="vrs-display mt-2 text-3xl text-[var(--color-bone)] lg:text-4xl">
              {title}
            </h1>
            {description && <p className="vrs-meta mt-3 max-w-xl">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </header>
        <div className="vrs-rule my-8" />
        {children}
      </div>
    </main>
  );
}
