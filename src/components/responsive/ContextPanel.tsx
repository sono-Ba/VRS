"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useDeviceClass } from "./useDeviceClass";

interface ContextPanelProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Pinned to the bottom of the panel on every device. */
  footer?: ReactNode;
}

/**
 * One panel, three presentations:
 *   desktop floating rail → tablet compact panel → mobile bottom sheet.
 *
 * The panel owns only its own open/collapsed presentation state. Everything
 * that matters — route, selection, viewer — lives outside it, so crossing a
 * breakpoint or rotating the device re-presents the same content in place.
 */
export function ContextPanel({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: ContextPanelProps) {
  const deviceClass = useDeviceClass();
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [railHidden, setRailHidden] = useState(false);

  // Collapse the sheet when leaving mobile so returning to it starts at peek.
  useEffect(() => {
    if (deviceClass !== "mobile") setSheetExpanded(false);
  }, [deviceClass]);

  const header = (
    <div>
      {eyebrow && <p className="vrs-eyebrow">{eyebrow}</p>}
      <h2 className="vrs-display mt-1.5 text-2xl text-[var(--color-bone)]">{title}</h2>
      {subtitle && <p className="vrs-meta mt-1.5">{subtitle}</p>}
    </div>
  );

  if (deviceClass === "mobile") {
    return (
      <div
        className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex flex-col"
        style={{
          maxHeight: sheetExpanded ? "82%" : "auto",
          transition: "max-height 240ms ease",
        }}
      >
        <div className="vrs-panel flex min-h-0 flex-col border-x-0 border-b-0">
          <button
            type="button"
            onClick={() => setSheetExpanded((open) => !open)}
            aria-expanded={sheetExpanded}
            className="flex w-full items-start justify-between gap-4 px-5 pb-4 pt-3 text-left"
          >
            <span className="min-w-0">
              <span aria-hidden className="mx-auto mb-3 block h-0.5 w-9 bg-[var(--color-line-strong)]" />
              {header}
            </span>
            <span
              aria-hidden
              className="mt-6 text-[var(--color-bone-faint)] transition-transform"
              style={{ transform: sheetExpanded ? "rotate(180deg)" : "none" }}
            >
              ⌃
            </span>
          </button>

          {sheetExpanded && (
            <div className="vrs-scroll min-h-0 flex-1 px-5 pb-5">{children}</div>
          )}

          {footer && (
            <div className="border-t border-[var(--color-line)] px-5 py-3">{footer}</div>
          )}
        </div>
      </div>
    );
  }

  const isTablet = deviceClass === "tablet";

  // The rail floats over the masterplan, so it can cover a marker. Hiding it
  // gives the drawing back in full without leaving the place you are in.
  if (railHidden) {
    return (
      <div className="pointer-events-auto absolute left-4 top-4 z-30 sm:left-6 lg:left-8 lg:top-8">
        <button
          type="button"
          onClick={() => setRailHidden(false)}
          className="vrs-panel flex min-h-11 items-center gap-2 px-4 text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-bone-dim)] transition-colors hover:text-[var(--color-bone)]"
        >
          <span aria-hidden>›</span> {title}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-auto absolute left-4 z-30 flex flex-col sm:left-6 lg:left-8 ${
        isTablet ? "top-4 bottom-4 w-[19rem]" : "top-8 bottom-8 w-[23rem]"
      }`}
    >
      <div className="vrs-panel flex min-h-0 flex-1 flex-col">
        <div
          className={`flex items-start justify-between gap-3 ${
            isTablet ? "px-5 pt-5" : "px-6 pt-6"
          }`}
        >
          {header}
          <button
            type="button"
            onClick={() => setRailHidden(true)}
            aria-label="Hide panel"
            className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center text-[var(--color-bone-faint)] transition-colors hover:text-[var(--color-bone)]"
          >
            <span aria-hidden>‹</span>
          </button>
        </div>
        <div
          className={`vrs-scroll min-h-0 flex-1 ${isTablet ? "px-5 py-4" : "px-6 py-5"}`}
        >
          {children}
        </div>
        {footer && (
          <div
            className={`border-t border-[var(--color-line)] ${
              isTablet ? "px-5 py-3" : "px-6 py-4"
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
