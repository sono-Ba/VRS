import { getProject, getProjects, getUnit, getUnitsInProject } from "@/application/catalog-service";
import { PageFrame } from "@/components/layout/PageFrame";
import { PermissionGate } from "@/components/layout/PermissionGate";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatPrice } from "@/lib/format";
import { ENQUIRY_STATUS_STAFF_LABEL } from "@/lib/labels";
import { clientRepositories } from "@/repositories/mock";

export default function SalesPage() {
  return (
    <PermissionGate permission="sales_sessions:create">
      <SalesWorkspace />
    </PermissionGate>
  );
}

async function SalesWorkspace() {
  const [enquiries, projects] = await Promise.all([
    clientRepositories.enquiries.listAll(),
    getProjects(),
  ]);

  const inventory = await Promise.all(
    projects.map(async (project) => {
      const units = await getUnitsInProject(project.id);
      return {
        project,
        total: units.length,
        available: units.filter((u) => u.availability === "available").length,
        reserved: units.filter((u) => u.availability === "reserved").length,
      };
    })
  );

  const recent = await Promise.all(
    [...enquiries]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 8)
      .map(async (enquiry) => ({
        enquiry,
        project: enquiry.projectId ? await getProject(enquiry.projectId) : null,
        unit: enquiry.unitId ? await getUnit(enquiry.unitId) : null,
      }))
  );

  return (
    <PageFrame
      eyebrow="Sales workspace"
      title="Today's demand"
      description="Live enquiries and inventory, with the internal detail your role allows."
    >
      <section>
        <h2 className="vrs-eyebrow">Incoming enquiries</h2>
        {recent.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No enquiries yet"
              description="Enquiries submitted from the client experience arrive here as they come in."
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {recent.map(({ enquiry, project, unit }) => (
              <li
                key={enquiry.id}
                className="flex flex-wrap items-baseline justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] text-[var(--color-bone)]">
                    {unit ? `Unit ${unit.unitNumber}` : (project?.name ?? "General")}
                    {unit && project && (
                      <span className="vrs-meta"> · {project.name}</span>
                    )}
                  </p>
                  <p className="vrs-meta mt-1 text-[0.75rem]">
                    {enquiry.name ?? "Signed-in client"} · {formatDate(enquiry.createdAt)}
                  </p>
                </div>
                <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--color-sand)]">
                  {ENQUIRY_STATUS_STAFF_LABEL[enquiry.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="vrs-eyebrow">Inventory</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {inventory.map(({ project, total, available, reserved }) => (
            <li key={project.id} className="border border-[var(--color-line)] p-5">
              <p className="vrs-eyebrow">{project.developer}</p>
              <p className="vrs-display mt-2 text-xl text-[var(--color-bone)]">
                {project.name}
              </p>
              <p className="vrs-meta mt-1 text-[0.8125rem]">
                From {formatPrice(project.startingPrice)} · {project.handover}
              </p>
              <dl className="mt-4 flex gap-6">
                <div>
                  <dt className="vrs-eyebrow">Available</dt>
                  <dd className="mt-1 text-[0.9375rem] text-[var(--color-available)]">
                    {available}
                  </dd>
                </div>
                <div>
                  <dt className="vrs-eyebrow">Reserved</dt>
                  <dd className="mt-1 text-[0.9375rem] text-[var(--color-reserved)]">
                    {reserved}
                  </dd>
                </div>
                <div>
                  <dt className="vrs-eyebrow">Total</dt>
                  <dd className="mt-1 text-[0.9375rem]">{total}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <p className="vrs-meta mt-10 border-t border-[var(--color-line)] pt-6 text-[0.8125rem]">
        Sales sessions, client lookup, and shortlists build on this workspace once the
        lead and session contracts are wired to a real CRM.
      </p>
    </PageFrame>
  );
}
