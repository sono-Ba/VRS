import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectsInDistrict, resolveContext } from "@/application/catalog-service";
import { JourneyTracker } from "@/components/client/JourneyTracker";
import { ExperienceStage } from "@/components/layout/ExperienceStage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { buildCrumbs } from "@/components/navigation/breadcrumb-model";
import { ContextPanel } from "@/components/responsive/ContextPanel";
import { formatPrice } from "@/lib/format";
import { PROJECT_STATUS_LABEL } from "@/lib/labels";
import { routes } from "@/lib/routes";

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ city: string; district: string }>;
}) {
  const { city: citySlug, district: districtSlug } = await params;
  const context = await resolveContext({ citySlug, districtSlug });
  if (!context?.district) notFound();

  const { city, district } = context;
  const projects = await getProjectsInDistrict(district.id);

  return (
    <>
      <Breadcrumb crumbs={buildCrumbs(context)} />
      <JourneyTracker
        cityId={city.id}
        districtId={district.id}
        event="district_selected"
      />

      <main className="relative min-h-0 flex-1">
        <ExperienceStage scene={district.scene}>
          <ContextPanel
            eyebrow={district.tagline}
            title={district.name}
            subtitle={district.description}
          >
            <p className="vrs-eyebrow">Projects</p>
            {projects.length === 0 ? (
              <p className="vrs-meta mt-3">
                No projects are published in this district yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-px">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={routes.project(city.slug, district.slug, project.slug)}
                      className="group block border border-[var(--color-line)] p-4 transition-colors hover:border-[var(--color-line-strong)]"
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="vrs-display truncate text-lg text-[var(--color-bone)] transition-colors group-hover:text-[var(--color-sand)]">
                          {project.name}
                        </span>
                        <span className="shrink-0 text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-bone-faint)]">
                          {PROJECT_STATUS_LABEL[project.status]}
                        </span>
                      </span>
                      <span className="vrs-meta mt-1 block truncate text-[0.75rem]">
                        {project.developer} · {project.bedroomRange}
                      </span>
                      <span className="mt-2 block text-[0.8125rem] text-[var(--color-bone-dim)]">
                        From {formatPrice(project.startingPrice)}
                      </span>
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
