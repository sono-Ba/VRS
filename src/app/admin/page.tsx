import Link from "next/link";
import {
  getCities,
  getDistricts,
  getProjects,
  getUnitsInProject,
} from "@/application/catalog-service";
import { PageFrame } from "@/components/layout/PageFrame";
import { PermissionGate } from "@/components/layout/PermissionGate";
import { linkForProject } from "@/application/links";
import { formatPrice } from "@/lib/format";
import { PROJECT_STATUS_LABEL } from "@/lib/labels";

export default function AdminPage() {
  return (
    <PermissionGate permission="content:manage">
      <ContentOverview />
    </PermissionGate>
  );
}

async function ContentOverview() {
  const cities = await getCities();
  const districts = (
    await Promise.all(cities.map((city) => getDistricts(city.id)))
  ).flat();
  const projects = await getProjects();

  const rows = await Promise.all(
    projects.map(async (project) => {
      const units = await getUnitsInProject(project.id);
      return {
        project,
        href: await linkForProject(project),
        total: units.length,
        available: units.filter((u) => u.availability === "available").length,
        sold: units.filter((u) => u.availability === "sold").length,
      };
    })
  );

  const totalUnits = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <PageFrame
      eyebrow="Admin"
      title="Content and inventory"
      description="What is published across the platform, and how each project's inventory stands."
    >
      <dl className="grid gap-px border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-4">
        <Metric label="Cities" value={cities.length.toString()} />
        <Metric label="Districts" value={districts.length.toString()} />
        <Metric label="Projects" value={projects.length.toString()} />
        <Metric label="Units" value={totalUnits.toString()} />
      </dl>

      <section className="mt-12">
        <h2 className="vrs-eyebrow">Projects</h2>
        <div className="vrs-scroll mt-4 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                {["Project", "Developer", "Status", "From", "Units", "Available", "Sold"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="pb-3 pr-4 text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-[var(--color-bone-faint)]"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ project, href, total, available, sold }) => (
                <tr key={project.id} className="border-b border-[var(--color-line)]">
                  <td className="py-3.5 pr-4 text-[0.875rem] text-[var(--color-bone)]">
                    {href ? (
                      <Link href={href} className="hover:text-[var(--color-sand)]">
                        {project.name}
                      </Link>
                    ) : (
                      project.name
                    )}
                  </td>
                  <td className="py-3.5 pr-4 text-[0.875rem] text-[var(--color-bone-dim)]">
                    {project.developer}
                  </td>
                  <td className="py-3.5 pr-4 text-[0.875rem] text-[var(--color-bone-dim)]">
                    {PROJECT_STATUS_LABEL[project.status]}
                  </td>
                  <td className="py-3.5 pr-4 text-[0.875rem] text-[var(--color-bone-dim)]">
                    {formatPrice(project.startingPrice)}
                  </td>
                  <td className="py-3.5 pr-4 text-[0.875rem] text-[var(--color-bone-dim)]">
                    {total}
                  </td>
                  <td className="py-3.5 pr-4 text-[0.875rem] text-[var(--color-available)]">
                    {available}
                  </td>
                  <td className="py-3.5 pr-4 text-[0.875rem] text-[var(--color-sold)]">
                    {sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="vrs-meta mt-10 border-t border-[var(--color-line)] pt-6 text-[0.8125rem]">
        This surface is read-only while the catalog is served from mock repositories.
        Editing arrives with the CMS/inventory integration behind the same repository
        contracts.
      </p>
    </PageFrame>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-ink)] p-6">
      <dt className="vrs-eyebrow">{label}</dt>
      <dd className="vrs-display mt-2 text-3xl text-[var(--color-bone)]">{value}</dd>
    </div>
  );
}
