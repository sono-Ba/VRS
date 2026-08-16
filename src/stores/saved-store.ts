"use client";

import { create } from "zustand";
import type { SavedProject, SavedUnit } from "@/domain";
import { ApiClientError } from "@/services/api/contract";
import { apiFetch } from "@/services/api/http";
import { analytics } from "@/services/analytics";

interface SavedState {
  projectIds: string[];
  unitIds: string[];
  loading: boolean;
  error: string | null;
  /** Set when an action needs an account, so the UI can offer a soft sign-in prompt. */
  authPromptFor: string | null;
  load: () => Promise<void>;
  reset: () => void;
  dismissAuthPrompt: () => void;
  toggleProject: (projectId: string) => Promise<void>;
  toggleUnit: (projectId: string, unitId: string) => Promise<void>;
}

export const useSavedStore = create<SavedState>((set, get) => ({
  projectIds: [],
  unitIds: [],
  loading: false,
  error: null,
  authPromptFor: null,

  reset: () => set({ projectIds: [], unitIds: [], error: null, authPromptFor: null }),

  dismissAuthPrompt: () => set({ authPromptFor: null }),

  load: async () => {
    set({ loading: true, error: null });
    try {
      const [projects, units] = await Promise.all([
        apiFetch<SavedProject[]>("/api/me/saved-projects"),
        apiFetch<SavedUnit[]>("/api/me/saved-units"),
      ]);
      set({
        projectIds: projects.map((p) => p.projectId),
        unitIds: units.map((u) => u.unitId),
        loading: false,
      });
    } catch (error) {
      if (error instanceof ApiClientError && error.code === "unauthenticated") {
        set({ projectIds: [], unitIds: [], loading: false });
        return;
      }
      set({
        loading: false,
        error: "We could not load your saved items. Try again shortly.",
      });
    }
  },

  toggleProject: async (projectId) => {
    const saved = get().projectIds.includes(projectId);
    // Optimistic: saving should feel instant during exploration.
    set((state) => ({
      projectIds: saved
        ? state.projectIds.filter((id) => id !== projectId)
        : [...state.projectIds, projectId],
      error: null,
    }));

    try {
      if (saved) {
        await apiFetch<null>(`/api/me/saved-projects/${projectId}`, { method: "DELETE" });
      } else {
        await apiFetch<SavedProject>("/api/me/saved-projects", {
          method: "POST",
          body: JSON.stringify({ projectId }),
        });
        analytics.track("project_saved", { projectId });
      }
    } catch (error) {
      set((state) => ({
        projectIds: saved
          ? [...state.projectIds, projectId]
          : state.projectIds.filter((id) => id !== projectId),
      }));
      if (error instanceof ApiClientError && error.code === "unauthenticated") {
        set({ authPromptFor: "save this project" });
        return;
      }
      set({ error: "That change did not save. Try again." });
    }
  },

  toggleUnit: async (projectId, unitId) => {
    const saved = get().unitIds.includes(unitId);
    set((state) => ({
      unitIds: saved
        ? state.unitIds.filter((id) => id !== unitId)
        : [...state.unitIds, unitId],
      error: null,
    }));

    try {
      if (saved) {
        await apiFetch<null>(`/api/me/saved-units/${unitId}`, { method: "DELETE" });
      } else {
        await apiFetch<SavedUnit>("/api/me/saved-units", {
          method: "POST",
          body: JSON.stringify({ projectId, unitId }),
        });
        analytics.track("unit_saved", { unitId, projectId });
      }
    } catch (error) {
      set((state) => ({
        unitIds: saved
          ? [...state.unitIds, unitId]
          : state.unitIds.filter((id) => id !== unitId),
      }));
      if (error instanceof ApiClientError && error.code === "unauthenticated") {
        set({ authPromptFor: "save this residence" });
        return;
      }
      set({ error: "That change did not save. Try again." });
    }
  },
}));
