"use client";

import { create } from "zustand";
import type { User } from "@/domain";
import { can, type Permission } from "@/auth/permissions";
import { apiFetch } from "@/services/api/http";
import { useCompareStore } from "./compare-store";

interface SessionState {
  user: User | null;
  hydrated: boolean;
  pending: boolean;
  setUser: (user: User | null) => void;
  signIn: (accountId: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Client-side capability check — for presentation only, never a security boundary. */
  can: (permission: Permission) => boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  hydrated: false,
  pending: false,

  setUser: (user) => set({ user, hydrated: true }),

  signIn: async (accountId) => {
    set({ pending: true });
    try {
      const user = await apiFetch<User>("/api/auth/session", {
        method: "POST",
        body: JSON.stringify({ accountId }),
      });
      set({ user, pending: false });
    } catch (error) {
      set({ pending: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ pending: true });
    await apiFetch<null>("/api/auth/session", { method: "DELETE" });
    // Comparison is stored on the device, so it must not carry over to
    // whoever uses this browser next.
    useCompareStore.getState().clearUnits();
    useCompareStore.getState().clearProjects();
    set({ user: null, pending: false });
  },

  can: (permission) => can(get().user, permission),
}));
