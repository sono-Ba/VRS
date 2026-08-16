"use client";

import { MAX_COMPARE, useCompareStore } from "@/stores/compare-store";

export function CompareUnitButton({
  unitId,
  className,
}: {
  unitId: string;
  className?: string;
}) {
  const selected = useCompareStore((state) => state.unitIds.includes(unitId));
  const full = useCompareStore(
    (state) => state.unitIds.length >= MAX_COMPARE && !state.unitIds.includes(unitId)
  );
  const toggleUnit = useCompareStore((state) => state.toggleUnit);

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={full}
      title={full ? `Compare holds up to ${MAX_COMPARE} residences.` : undefined}
      onClick={() => toggleUnit(unitId)}
      className={`vrs-btn-ghost ${className ?? ""}`}
    >
      {selected ? "In compare" : "Compare"}
    </button>
  );
}

export function CompareProjectButton({
  projectId,
  className,
}: {
  projectId: string;
  className?: string;
}) {
  const selected = useCompareStore((state) => state.projectIds.includes(projectId));
  const full = useCompareStore(
    (state) =>
      state.projectIds.length >= MAX_COMPARE && !state.projectIds.includes(projectId)
  );
  const toggleProject = useCompareStore((state) => state.toggleProject);

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={full}
      title={full ? `Compare holds up to ${MAX_COMPARE} projects.` : undefined}
      onClick={() => toggleProject(projectId)}
      className={`vrs-btn-ghost ${className ?? ""}`}
    >
      {selected ? "In compare" : "Compare"}
    </button>
  );
}
