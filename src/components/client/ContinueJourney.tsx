"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { JourneySnapshot } from "@/domain";
import { apiFetch } from "@/services/api/http";
import { useSessionStore } from "@/stores/session-store";

/**
 * A tasteful way back in — offered, never forced. Renders nothing when the
 * user is a guest or has no prior journey.
 */
export function ContinueJourney() {
  const user = useSessionStore((state) => state.user);
  const [journey, setJourney] = useState<JourneySnapshot | null>(null);

  useEffect(() => {
    if (!user) {
      setJourney(null);
      return;
    }
    let active = true;
    apiFetch<JourneySnapshot | null>("/api/me/journey")
      .then((snapshot) => {
        if (active) setJourney(snapshot);
      })
      .catch(() => {
        if (active) setJourney(null);
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (!journey) return null;

  return (
    <Link href={journey.path} className="vrs-btn-ghost">
      Continue where you left off
    </Link>
  );
}
