import Link from "next/link";
import { notFound } from "next/navigation";
import { getDistricts, resolveContext } from "@/application/catalog-service";
import { getProjectsInDistrict } from "@/application/catalog-service";
import { JourneyTracker } from "@/components/client/JourneyTracker";
import { ExperienceStage } from "@/components/layout/ExperienceStage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { buildCrumbs } from "@/components/navigation/breadcrumb-model";
import { ContextPanel } from "@/components/responsive/ContextPanel";
import { routes } from "@/lib/routes";

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const context = await resolveContext({ citySlug });
  if (!context) notFound();

  const { city } = context;
  const districts = await getDistricts(city.id);
  const counts = await Promise.all(
    districts.map(async (district) => ({
      district,
      projectCount: (await getProjectsInDistrict(district.id)).length,
    }))
  );

  return (
    <>
      <Breadcrumb crumbs={buildCrumbs(context)} />
      <JourneyTracker cityId={city.id} event="city_selected" />

      <main className="relative min-h-0 flex-1">
        <ExperienceStage scene={city.scene}>
          <ContextPanel
            eyebrow={city.tagline}
            title={city.name}
            subtitle={city.description}
          >
            <p className="vrs-eyebrow">Districts</p>
            <ul className="mt-3 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {counts.map(({ district, projectCount }) => (
                <li key={district.id}>
                  <Link
                    href={routes.district(city.slug, district.slug)}
                    className="group flex items-baseline justify-between gap-4 py-3.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[0.9375rem] text-[var(--color-bone)] transition-colors group-hover:text-[var(--color-sand)]">
                        {district.name}
                      </span>
                      <span className="vrs-meta block truncate text-[0.75rem]">
                        {district.tagline}
                      </span>
                    </span>
                    <span className="shrink-0 text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--color-bone-faint)]">
                      {projectCount} {projectCount === 1 ? "project" : "projects"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="vrs-meta mt-5 text-[0.75rem]">
              Select a marker on the map, or choose a district above.
            </p>
          </ContextPanel>
        </ExperienceStage>
      </main>
    </>
  );
}
