"use client";

import { useEffect } from "react";
import type { User } from "@/domain";
import { useSessionStore } from "@/stores/session-store";
import { useSavedStore } from "@/stores/saved-store";

/**
 * Hydrates client stores from the server-resolved session so the first paint
 * already reflects who the user is — no signed-out flash on refresh.
 */
export function SessionProvider({ user }: { user: User | null }) {
  const setUser = useSessionStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  useEffect(() => {
    if (user) {
      void useSavedStore.getState().load();
    } else {
      useSavedStore.getState().reset();
    }
  }, [user]);

  return null;
}
