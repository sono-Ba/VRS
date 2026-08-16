import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFloors,
  getUnitsInProject,
  resolveContext,
} from "@/application/catalog-service";
import { JourneyTracker } from "@/components/client/JourneyTracker";
import { ExperienceStage } from "@/components/layout/ExperienceStage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { buildCrumbs } from "@/components/navigation/breadcrumb-model";
import { ContextPanel } from "@/components/responsive/ContextPanel";
import { routes } from "@/lib/routes";

export default async function BuildingPage({
  params,
}: {
  params: Promise<{
    city: string;
    district: string;
    project: string;
    buildingId: string;
  }>;
}) {
  const {
    city: citySlug,
    district: districtSlug,
    project: projectSlug,
    buildingId,
  } = await params;
  const context = await resolveContext({
    citySlug,
    districtSlug,
    projectSlug,
    buildingId,
  });
  if (!context?.building) notFound();

  const { city, district, project, building } = context;
  const [floors, projectUnits] = await Promise.all([
    getFloors(building.id),
    getUnitsInProject(project!.id),
  ]);

  const availabilityByFloor = new Map<string, number>();
  for (const unit of projectUnits) {
    if (unit.availability !== "available" || !unit.floorId) continue;
    availabilityByFloor.set(unit.floorId, (availabilityByFloor.get(unit.floorId) ?? 0) + 1);
  }

  return (
    <>
      <Breadcrumb crumbs={buildCrumbs(context)} />
      <JourneyTracker
        cityId={city.id}
        districtId={district!.id}
        projectId={project!.id}
        buildingId={building.id}
      />

      <main className="relative min-h-0 flex-1">
        <ExperienceStage scene={building.scene}>
          <ContextPanel
            eyebrow={project!.name}
            title={building.name}
            subtitle={`${building.floorsCount} levels. Select a level to see the floor plate and its residences.`}
          >
            <p className="vrs-eyebrow">Levels</p>
            <ul className="mt-3 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {[...floors].reverse().map((floor) => {
                const available = availabilityByFloor.get(floor.id) ?? 0;
                return (
                  <li key={floor.id}>
                    <Link
                      href={routes.floor(
                        city.slug,
                        district!.slug,
                        project!.slug,
                        building.id,
                        floor.id
                      )}
                      className="group flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <span className="text-[0.9375rem] text-[var(--color-bone)] transition-colors group-hover:text-[var(--color-sand)]">
                        {floor.name}
                      </span>
                      <span
                        className="text-[0.6875rem] uppercase tracking-[0.14em]"
                        style={{
                          color:
                            available > 0
                              ? "var(--color-available)"
                              : "var(--color-bone-faint)",
                        }}
                      >
                        {available > 0 ? `${available} available` : "Fully taken"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ContextPanel>
        </ExperienceStage>
      </main>
    </>
  );
}
