"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics, type AnalyticsEvent } from "@/services/analytics";
import { apiFetch } from "@/services/api/http";
import { useSessionStore } from "@/stores/session-store";

interface JourneyTrackerProps {
  cityId?: string;
  districtId?: string;
  projectId?: string;
  buildingId?: string;
  floorId?: string;
  unitId?: string;
  event?: AnalyticsEvent;
}

/**
 * Records where the user is so an authenticated client can pick the journey
 * back up later, and emits the matching analytics event. Guests are tracked
 * client-side only — the API treats journey writes without a session as no-ops.
 */
export function JourneyTracker(props: JourneyTrackerProps) {
  const pathname = usePathname();
  const user = useSessionStore((state) => state.user);
  const { cityId, districtId, projectId, buildingId, floorId, unitId, event } = props;

  useEffect(() => {
    if (event) {
      analytics.track(event, { projectId, unitId, districtId });
    }
  }, [event, projectId, unitId, districtId]);

  useEffect(() => {
    if (!user) return;

    void apiFetch("/api/me/journey", {
      method: "PUT",
      body: JSON.stringify({
        cityId,
        districtId,
        projectId,
        buildingId,
        floorId,
        unitId,
        path: pathname,
      }),
    }).catch(() => {
      // Journey persistence is best-effort; a failure must never interrupt exploration.
    });

    const entityType = unitId ? "unit" : projectId ? "project" : null;
    const entityId = unitId ?? projectId;
    if (entityType && entityId) {
      void apiFetch("/api/me/recently-viewed", {
        method: "POST",
        body: JSON.stringify({ entityType, entityId }),
      }).catch(() => {});
    }
  }, [user, pathname, cityId, districtId, projectId, buildingId, floorId, unitId]);

  return null;
}
