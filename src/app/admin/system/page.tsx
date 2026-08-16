import { ROLE_LABELS } from "@/auth/accounts";
import {
  ROLE_PERMISSIONS,
  type Permission,
  type UserRole,
} from "@/auth/permissions";
import { config } from "@/config";
import { PageFrame } from "@/components/layout/PageFrame";
import { PermissionGate } from "@/components/layout/PermissionGate";

const ROLES = Object.keys(ROLE_PERMISSIONS) as UserRole[];

export default function SystemPage() {
  return (
    <PermissionGate permission="system:manage">
      <SystemGovernance />
    </PermissionGate>
  );
}

/**
 * Renders the live permission matrix straight from the RBAC module, so the
 * governance view can never drift from what the application actually enforces.
 */
function SystemGovernance() {
  const permissions = [
    ...new Set(ROLES.flatMap((role) => ROLE_PERMISSIONS[role])),
  ].sort() as Permission[];

  return (
    <PageFrame
      eyebrow="Super Admin"
      title="Platform governance"
      description="The capability matrix as the application enforces it, plus the current data source."
    >
      <dl className="grid gap-px border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-3">
        <div className="bg-[var(--color-ink)] p-6">
          <dt className="vrs-eyebrow">Data source</dt>
          <dd className="vrs-display mt-2 text-2xl text-[var(--color-bone)]">
            {config.dataSource}
          </dd>
        </div>
        <div className="bg-[var(--color-ink)] p-6">
          <dt className="vrs-eyebrow">Roles</dt>
          <dd className="vrs-display mt-2 text-2xl text-[var(--color-bone)]">
            {ROLES.length}
          </dd>
        </div>
        <div className="bg-[var(--color-ink)] p-6">
          <dt className="vrs-eyebrow">Capabilities</dt>
          <dd className="vrs-display mt-2 text-2xl text-[var(--color-bone)]">
            {permissions.length}
          </dd>
        </div>
      </dl>

      <section className="mt-12">
        <h2 className="vrs-eyebrow">Capability matrix</h2>
        <div className="vrs-scroll mt-4 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-[var(--color-ink)] pb-3 pr-4 text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-[var(--color-bone-faint)]"
                >
                  Capability
                </th>
                {ROLES.map((role) => (
                  <th
                    key={role}
                    scope="col"
                    className="pb-3 pr-4 text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-[var(--color-bone-faint)]"
                  >
                    {ROLE_LABELS[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission} className="border-b border-[var(--color-line)]">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-[var(--color-ink)] py-3 pr-4 text-[0.8125rem] font-normal text-[var(--color-bone-dim)]"
                  >
                    {permission}
                  </th>
                  {ROLES.map((role) => {
                    const granted = ROLE_PERMISSIONS[role].includes(permission);
                    return (
                      <td key={`${permission}-${role}`} className="py-3 pr-4">
                        <span
                          className="text-[0.875rem]"
                          style={{
                            color: granted
                              ? "var(--color-available)"
                              : "var(--color-line-strong)",
                          }}
                        >
                          {granted ? "●" : "—"}
                        </span>
                        <span className="sr-only">
                          {granted ? "granted" : "not granted"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="vrs-meta mt-10 border-t border-[var(--color-line)] pt-6 text-[0.8125rem]">
        Editing roles, organizations, integrations, and audit trails belongs to the
        production platform, once identity and server-side authorization are real.
      </p>
    </PageFrame>
  );
}
