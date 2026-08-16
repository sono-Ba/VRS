/** Centralized semantic breakpoints. Layout code reads these, never raw numbers. */

export const BREAKPOINTS = {
  smallMobile: 0,
  mobile: 480,
  tabletPortrait: 768,
  tabletLandscape: 1024,
  desktop: 1280,
  largeDesktop: 1600,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Three presentation modes; each has its own interaction pattern, not a scaled copy. */
export type DeviceClass = "mobile" | "tablet" | "desktop";

export function deviceClassForWidth(width: number): DeviceClass {
  if (width < BREAKPOINTS.tabletPortrait) return "mobile";
  if (width < BREAKPOINTS.desktop) return "tablet";
  return "desktop";
}
