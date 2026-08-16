import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBuildings,
  getUnitsInProject,
  resolveContext,
} from "@/application/catalog-service";
import { CompareProjectButton } from "@/components/client/CompareButton";
import { EnquiryDialog } from "@/components/client/EnquiryDialog";
import { JourneyTracker } from "@/components/client/JourneyTracker";
import { SaveProjectButton } from "@/components/client/SaveButton";
import { ExperienceStage } from "@/components/layout/ExperienceStage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { buildCrumbs } from "@/components/navigation/breadcrumb-model";
import { ContextPanel } from "@/components/responsive/ContextPanel";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ city: string; district: string; project: string }>;
}) {
  const { city: citySlug, district: districtSlug, project: projectSlug } = await params;
  const context = await resolveContext({ citySlug, districtSlug, projectSlug });
  if (!context?.project) notFound();

  const { city, district, project } = context;
  const [buildings, units] = await Promise.all([
    getBuildings(project.id),
    getUnitsInProject(project.id),
  ]);
  const availableCount = units.filter((u) => u.availability === "available").length;

  return (
    <>
      <Breadcrumb crumbs={buildCrumbs(context, { includeExperience: true })} />
      <JourneyTracker
        cityId={city.id}
        districtId={district!.id}
        projectId={project.id}
        event="experience_entered"
      />

      <main className="relative min-h-0 flex-1">
        <ExperienceStage scene={project.scene}>
          <ContextPanel
            eyebrow={`${project.developer} · ${project.lifestyle}`}
            title={project.name}
            subtitle={project.description}
            footer={
              <div className="flex flex-wrap gap-2">
                <SaveProjectButton projectId={project.id} className="!min-h-10 flex-1" />
                <CompareProjectButton
                  projectId={project.id}
                  className="!min-h-10 flex-1"
                />
                <EnquiryDialog
                  projectId={project.id}
                  projectName={project.name}
                  className="!min-h-10 w-full"
                />
              </div>
            }
          >
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-[var(--color-line)] py-4">
              <div>
                <dt className="vrs-eyebrow">From</dt>
                <dd className="mt-1 text-[0.9375rem]">
                  {formatPrice(project.startingPrice)}
                </dd>
              </div>
              <div>
                <dt className="vrs-eyebrow">Handover</dt>
                <dd className="mt-1 text-[0.9375rem]">{project.handover}</dd>
              </div>
              <div>
                <dt className="vrs-eyebrow">Layouts</dt>
                <dd className="mt-1 text-[0.9375rem]">{project.bedroomRange}</dd>
              </div>
              <div>
                <dt className="vrs-eyebrow">Available</dt>
                <dd className="mt-1 text-[0.9375rem]">
                  {availableCount} of {units.length}
                </dd>
              </div>
            </dl>

            <p className="vrs-eyebrow mt-5">Buildings</p>
            <ul className="mt-3 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {buildings.map((building) => (
                <li key={building.id}>
                  <Link
                    href={routes.building(
                      city.slug,
                      district!.slug,
                      project.slug,
                      building.id
                    )}
                    className="group flex items-baseline justify-between gap-4 py-3.5"
                  >
                    <span className="text-[0.9375rem] text-[var(--color-bone)] transition-colors group-hover:text-[var(--color-sand)]">
                      {building.name}
                    </span>
                    <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--color-bone-faint)]">
                      {building.floorsCount} levels
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="vrs-eyebrow mt-5">Amenities</p>
            <ul className="vrs-meta mt-2 space-y-1 text-[0.8125rem]">
              {project.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </ContextPanel>
        </ExperienceStage>
      </main>
    </>
  );
}
