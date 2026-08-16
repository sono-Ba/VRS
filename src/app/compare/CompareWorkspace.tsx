"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project, Unit } from "@/domain";
import { formatArea, formatPrice, formatPricePerArea } from "@/lib/format";
import { AVAILABILITY_LABEL, PROJECT_STATUS_LABEL } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { analytics } from "@/services/analytics";
import { apiFetch } from "@/services/api/http";
import { useCompareStore } from "@/stores/compare-store";

type Mode = "units" | "projects";

export function CompareWorkspace() {
  const unitIds = useCompareStore((state) => state.unitIds);
  const projectIds = useCompareStore((state) => state.projectIds);
  const toggleUnit = useCompareStore((state) => state.toggleUnit);
  const toggleProject = useCompareStore((state) => state.toggleProject);
  const clearUnits = useCompareStore((state) => state.clearUnits);
  const clearProjects = useCompareStore((state) => state.clearProjects);

  const [mode, setMode] = useState<Mode>("units");
  const [units, setUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  // Zustand's persist middleware hydrates after mount; wait for it before
  // deciding the list is empty.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    analytics.track("comparison_opened", { units: unitIds.length, projects: projectIds.length });
  }, [hydrated, unitIds.length, projectIds.length]);

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    setStatus("loading");

    Promise.all([
      unitIds.length ? apiFetch<Unit[]>(`/api/units?ids=${unitIds.join(",")}`) : [],
      projectIds.length
        ? Promise.all(projectIds.map((id) => apiFetch<Project>(`/api/projects/${id}`)))
        : [],
    ])
      .then(([nextUnits, nextProjects]) => {
        if (!active) return;
        setUnits(nextUnits);
        setProjects(nextProjects);
        setStatus("idle");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [hydrated, unitIds, projectIds]);

  if (!hydrated) {
    return <p className="vrs-meta">Loading your comparison…</p>;
  }

  if (status === "error") {
    return (
      <div role="alert" className="border border-[var(--color-line)] p-6">
        <p className="text-[0.9375rem] text-[var(--color-bone)]">
          We could not load your comparison.
        </p>
        <button
          type="button"
          className="vrs-btn-ghost mt-4"
          onClick={() => setStatus("idle")}
        >
          Try again
        </button>
      </div>
    );
  }

  const showUnits = mode === "units";
  const isEmpty = showUnits ? unitIds.length === 0 : projectIds.length === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Comparison type" className="flex gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={showUnits}
            onClick={() => setMode("units")}
            className="vrs-btn-ghost !min-h-10"
          >
            Residences {unitIds.length > 0 && `(${unitIds.length})`}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!showUnits}
            onClick={() => setMode("projects")}
            className="vrs-btn-ghost !min-h-10"
          >
            Projects {projectIds.length > 0 && `(${projectIds.length})`}
          </button>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={() => (showUnits ? clearUnits() : clearProjects())}
            className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-bone-faint)] hover:text-[var(--color-bone)]"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-8">
        {isEmpty ? (
          <div className="border border-dashed border-[var(--color-line)] px-6 py-10">
            <h3 className="vrs-display text-xl">
              Nothing to compare yet
            </h3>
            <p className="vrs-meta mt-2 max-w-sm">
              Add up to four {showUnits ? "residences" : "projects"} while exploring and
              they will line up here.
            </p>
            <Link href={routes.home()} className="vrs-btn-ghost mt-6">
              Start exploring
            </Link>
          </div>
        ) : showUnits ? (
          <CompareTable
            columns={units.map((unit) => ({
              id: unit.id,
              title: `Unit ${unit.unitNumber}`,
              subtitle: unit.unitType ?? "",
              onRemove: () => toggleUnit(unit.id),
            }))}
            rows={[
              { label: "Price", values: units.map((u) => formatPrice(u.actualPrice)) },
              {
                label: "Price / area",
                values: units.map((u) => formatPricePerArea(u.actualPrice, u.netArea)),
              },
              { label: "Bedrooms", values: units.map((u) => u.bedrooms?.toString() ?? "—") },
              {
                label: "Bathrooms",
                values: units.map((u) => u.bathrooms?.toString() ?? "—"),
              },
              { label: "Net area", values: units.map((u) => formatArea(u.netArea)) },
              { label: "Balcony", values: units.map((u) => formatArea(u.balconyArea)) },
              { label: "Gross area", values: units.map((u) => formatArea(u.grossArea)) },
              { label: "View", values: units.map((u) => u.viewEN ?? "—") },
              { label: "Level", values: units.map((u) => u.floorNumber.toString()) },
              {
                label: "Availability",
                values: units.map((u) =>
                  u.availability ? (AVAILABILITY_LABEL[u.availability] ?? "—") : "—"
                ),
              },
            ]}
          />
        ) : (
          <CompareTable
            columns={projects.map((project) => ({
              id: project.id,
              title: project.name,
              subtitle: project.developer,
              onRemove: () => toggleProject(project.id),
            }))}
            rows={[
              {
                label: "Starting price",
                values: projects.map((p) => formatPrice(p.startingPrice)),
              },
              { label: "Handover", values: projects.map((p) => p.handover) },
              { label: "Layouts", values: projects.map((p) => p.bedroomRange) },
              {
                label: "Status",
                values: projects.map((p) => PROJECT_STATUS_LABEL[p.status] ?? p.status),
              },
              { label: "Lifestyle", values: projects.map((p) => p.lifestyle) },
              {
                label: "Amenities",
                values: projects.map((p) => p.amenities.slice(0, 4).join(", ")),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}

interface CompareColumn {
  id: string;
  title: string;
  subtitle: string;
  onRemove: () => void;
}

interface CompareRow {
  label: string;
  values: string[];
}

/**
 * Desktop reads as a precise side-by-side table. On narrow screens the same
 * table scrolls horizontally with the attribute column pinned, so the label
 * you are reading against stays visible.
 */
function CompareTable({
  columns,
  rows,
}: {
  columns: CompareColumn[];
  rows: CompareRow[];
}) {
  return (
    <div className="vrs-scroll overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 w-32 bg-[var(--color-ink)] pb-4 pr-4 align-bottom"
            >
              <span className="vrs-eyebrow">Attribute</span>
            </th>
            {columns.map((column) => (
              <th key={column.id} scope="col" className="pb-4 pr-4 align-bottom">
                <span className="vrs-display block text-lg text-[var(--color-bone)]">
                  {column.title}
                </span>
                <span className="vrs-meta block text-[0.75rem]">{column.subtitle}</span>
                <button
                  type="button"
                  onClick={column.onRemove}
                  className="mt-2 text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--color-bone-faint)] hover:text-[var(--color-sold)]"
                >
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-[var(--color-line)]">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-[var(--color-ink)] py-3.5 pr-4 align-top text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-[var(--color-bone-faint)]"
              >
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td
                  key={`${row.label}-${columns[index]?.id ?? index}`}
                  className="py-3.5 pr-4 align-top text-[0.875rem] text-[var(--color-bone)]"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
