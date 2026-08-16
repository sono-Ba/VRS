"use client";

import { useSavedStore } from "@/stores/saved-store";

interface SaveProjectButtonProps {
  projectId: string;
  className?: string;
}

export function SaveProjectButton({ projectId, className }: SaveProjectButtonProps) {
  const saved = useSavedStore((state) => state.projectIds.includes(projectId));
  const toggleProject = useSavedStore((state) => state.toggleProject);

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => void toggleProject(projectId)}
      className={`vrs-btn-ghost ${className ?? ""}`}
    >
      {saved ? "Saved" : "Save project"}
    </button>
  );
}

interface SaveUnitButtonProps {
  projectId: string;
  unitId: string;
  className?: string;
}

export function SaveUnitButton({ projectId, unitId, className }: SaveUnitButtonProps) {
  const saved = useSavedStore((state) => state.unitIds.includes(unitId));
  const toggleUnit = useSavedStore((state) => state.toggleUnit);

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => void toggleUnit(projectId, unitId)}
      className={`vrs-btn-ghost ${className ?? ""}`}
    >
      {saved ? "Saved" : "Save residence"}
    </button>
  );
}
