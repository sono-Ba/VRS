import { notFound } from "next/navigation";
import { resolveContext } from "@/application/catalog-service";
import { authorize } from "@/auth/session";
import { CompareUnitButton } from "@/components/client/CompareButton";
import { EnquiryDialog } from "@/components/client/EnquiryDialog";
import { JourneyTracker } from "@/components/client/JourneyTracker";
import { SaveUnitButton } from "@/components/client/SaveButton";
import { ExperienceStage } from "@/components/layout/ExperienceStage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { buildCrumbs } from "@/components/navigation/breadcrumb-model";
import { ContextPanel } from "@/components/responsive/ContextPanel";
import { AvailabilityPill } from "@/components/ui/StatusPill";
import { formatArea, formatPrice, formatPricePerArea } from "@/lib/format";
import type { SceneConfig } from "@/viewers/core/types";

export default async function UnitPage({
  params,
}: {
  params: Promise<{
    city: string;
    district: string;
    project: string;
    buildingId: string;
    floorId: string;
    unitId: string;
  }>;
}) {
  const {
    city: citySlug,
    district: districtSlug,
    project: projectSlug,
    buildingId,
    floorId,
    unitId,
  } = await params;
  const context = await resolveContext({
    citySlug,
    districtSlug,
    projectSlug,
    buildingId,
    floorId,
    unitId,
  });
  if (!context?.unit) notFound();

  const { city, district, project, building, floor, unit } = context;
  const [{ allowed: canViewPrice }, { allowed: canViewInternal }] = await Promise.all([
    authorize("units:view_price"),
    authorize("units:view_internal_data"),
  ]);

  const scene: SceneConfig = {
    viewerType: "image",
    src: unit.unitPlanURL ?? "/media/unitplan.svg",
    aspectRatio: 1.33,
  };

  return (
    <>
      <Breadcrumb crumbs={buildCrumbs(context)} />
      <JourneyTracker
        cityId={city.id}
        districtId={district!.id}
        projectId={project!.id}
        buildingId={building!.id}
        floorId={floor!.id}
        unitId={unit.id}
        event="unit_viewed"
      />

      <main className="relative min-h-0 flex-1">
        <ExperienceStage scene={scene}>
          <ContextPanel
            eyebrow={`${project!.name} · ${building!.name} · ${floor!.name}`}
            title={`Unit ${unit.unitNumber}`}
            subtitle={`${unit.unitType} · ${unit.viewEN}`}
            footer={
              <div className="flex flex-wrap gap-2">
                <SaveUnitButton
                  projectId={unit.projectId}
                  unitId={unit.id}
                  className="!min-h-10 flex-1"
                />
                <CompareUnitButton unitId={unit.id} className="!min-h-10 flex-1" />
                <EnquiryDialog
                  projectId={unit.projectId}
                  projectName={project!.name}
                  unitId={unit.id}
                  unitLabel={`Unit ${unit.unitNumber}`}
                  className="!min-h-10 w-full"
                />
              </div>
            }
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] pb-4">
              <AvailabilityPill availability={unit.availability} />
              {canViewPrice && (
                <span className="vrs-display text-xl text-[var(--color-bone)]">
                  {formatPrice(unit.actualPrice)}
                </span>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5">
              <Fact label="Bedrooms" value={unit.bedrooms?.toString() ?? "—"} />
              <Fact label="Bathrooms" value={unit.bathrooms?.toString() ?? "—"} />
              <Fact label="Net area" value={formatArea(unit.netArea)} />
              <Fact label="Balcony" value={formatArea(unit.balconyArea)} />
              <Fact label="Gross area" value={formatArea(unit.grossArea)} />
              <Fact label="View" value={unit.viewEN ?? "—"} />
              {canViewPrice && (
                <Fact
                  label="Price / area"
                  value={formatPricePerArea(unit.actualPrice, unit.netArea)}
                />
              )}
              <Fact label="Level" value={unit.floorNumber.toString()} />
            </dl>

            {canViewInternal && (
              <div className="mt-5 border border-[var(--color-line)] p-4">
                <p className="vrs-eyebrow">Internal — sales only</p>
                <dl className="mt-3 space-y-2">
                  <div className="flex justify-between gap-3 text-[0.8125rem]">
                    <dt className="text-[var(--color-bone-faint)]">Unit code</dt>
                    <dd className="text-[var(--color-bone-dim)]">{unit.unitCode}</dd>
                  </div>
                  <div className="flex justify-between gap-3 text-[0.8125rem]">
                    <dt className="text-[var(--color-bone-faint)]">View (AR)</dt>
                    <dd dir="rtl" className="text-[var(--color-bone-dim)]">
                      {unit.viewAR}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </ContextPanel>
        </ExperienceStage>
      </main>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="vrs-eyebrow">{label}</dt>
      <dd className="mt-1 text-[0.9375rem] text-[var(--color-bone)]">{value}</dd>
    </div>
  );
}
