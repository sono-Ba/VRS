import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitsOnFloor, resolveContext } from "@/application/catalog-service";
import { authorize } from "@/auth/session";
import { JourneyTracker } from "@/components/client/JourneyTracker";
import { ExperienceStage } from "@/components/layout/ExperienceStage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { buildCrumbs } from "@/components/navigation/breadcrumb-model";
import { ContextPanel } from "@/components/responsive/ContextPanel";
import { AvailabilityPill } from "@/components/ui/StatusPill";
import { formatArea, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

export default async function FloorPage({
  params,
}: {
  params: Promise<{
    city: string;
    district: string;
    project: string;
    buildingId: string;
    floorId: string;
  }>;
}) {
  const {
    city: citySlug,
    district: districtSlug,
    project: projectSlug,
    buildingId,
    floorId,
  } = await params;
  const context = await resolveContext({
    citySlug,
    districtSlug,
    projectSlug,
    buildingId,
    floorId,
  });
  if (!context?.floor) notFound();

  const { city, district, project, building, floor } = context;
  const units = await getUnitsOnFloor(floor.id);
  const { allowed: canViewPrice } = await authorize("units:view_price");

  return (
    <>
      <Breadcrumb crumbs={buildCrumbs(context)} />
      <JourneyTracker
        cityId={city.id}
        districtId={district!.id}
        projectId={project!.id}
        buildingId={building!.id}
        floorId={floor.id}
      />

      <main className="relative min-h-0 flex-1">
        <ExperienceStage scene={floor.scene}>
          <ContextPanel
            eyebrow={`${project!.name} · ${building!.name}`}
            title={floor.name}
            subtitle={`${units.length} residences on this level.`}
          >
            {units.length === 0 ? (
              <p className="vrs-meta">No residences are published on this level.</p>
            ) : (
              <ul className="space-y-px">
                {units.map((unit) => (
                  <li key={unit.id}>
                    <Link
                      href={routes.unit(
                        city.slug,
                        district!.slug,
                        project!.slug,
                        building!.id,
                        floor.id,
                        unit.id
                      )}
                      className="group block border border-[var(--color-line)] p-3.5 transition-colors hover:border-[var(--color-line-strong)]"
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-[0.9375rem] text-[var(--color-bone)] transition-colors group-hover:text-[var(--color-sand)]">
                          Unit {unit.unitNumber}
                        </span>
                        <AvailabilityPill availability={unit.availability} />
                      </span>
                      <span className="vrs-meta mt-1 block text-[0.75rem]">
                        {unit.unitType} · {formatArea(unit.netArea)} · {unit.viewEN}
                      </span>
                      {canViewPrice && (
                        <span className="mt-1.5 block text-[0.8125rem] text-[var(--color-bone-dim)]">
                          {formatPrice(unit.actualPrice)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </ContextPanel>
        </ExperienceStage>
      </main>
    </>
  );
}
