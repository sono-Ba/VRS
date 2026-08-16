"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { analytics } from "@/services/analytics";

export const MAX_COMPARE = 4;

interface CompareState {
  unitIds: string[];
  projectIds: string[];
  toggleUnit: (unitId: string) => void;
  toggleProject: (projectId: string) => void;
  clearUnits: () => void;
  clearProjects: () => void;
}

function toggle(list: string[], id: string): string[] {
  if (list.includes(id)) return list.filter((entry) => entry !== id);
  if (list.length >= MAX_COMPARE) return list;
  return [...list, id];
}

/**
 * Comparison is available to guests — it is a temporary session tool, so it
 * persists locally rather than requiring an account. Signing in is only needed
 * to keep a comparison across devices.
 */
export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      unitIds: [],
      projectIds: [],
      toggleUnit: (unitId) =>
        set((state) => {
          const next = toggle(state.unitIds, unitId);
          if (next.length > state.unitIds.length) {
            analytics.track("compare_added", { entityType: "unit", entityId: unitId });
          }
          return { unitIds: next };
        }),
      toggleProject: (projectId) =>
        set((state) => {
          const next = toggle(state.projectIds, projectId);
          if (next.length > state.projectIds.length) {
            analytics.track("compare_added", {
              entityType: "project",
              entityId: projectId,
            });
          }
          return { projectIds: next };
        }),
      clearUnits: () => set({ unitIds: [] }),
      clearProjects: () => set({ projectIds: [] }),
    }),
    { name: "vrs-compare" }
  )
);
