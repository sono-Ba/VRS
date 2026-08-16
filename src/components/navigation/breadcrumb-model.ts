import type { SpatialContext } from "@/application/catalog-service";
import { routes } from "@/lib/routes";

export type CrumbLevel =
  | "city"
  | "district"
  | "project"
  | "experience"
  | "building"
  | "floor"
  | "unit";

export interface Crumb {
  level: CrumbLevel;
  label: string;
  href: string;
}

/**
 * Builds the breadcrumb trail from resolved spatial context. The trail is
 * derived from the same context the viewer uses, so navigating a parent crumb
 * moves route, application, and viewer state together.
 */
export function buildCrumbs(
  context: SpatialContext,
  options: { includeExperience?: boolean } = {}
): Crumb[] {
  const { city, district, project, building, floor, unit } = context;
  const crumbs: Crumb[] = [
    { level: "city", label: city.name, href: routes.city(city.slug) },
  ];
  if (!district) return crumbs;

  crumbs.push({
    level: "district",
    label: district.name,
    href: routes.district(city.slug, district.slug),
  });
  if (!project) return crumbs;

  const projectHref = routes.project(city.slug, district.slug, project.slug);
  crumbs.push({ level: "project", label: project.name, href: projectHref });

  // "Experience" is the project's immersive site plan — the same route as the
  // project page, surfaced as its own level once the user has gone deeper.
  if (options.includeExperience || building) {
    crumbs.push({ level: "experience", label: "Experience", href: projectHref });
  }
  if (!building) return crumbs;

  crumbs.push({
    level: "building",
    label: building.name,
    href: routes.building(city.slug, district.slug, project.slug, building.id),
  });
  if (!floor) return crumbs;

  crumbs.push({
    level: "floor",
    label: floor.name,
    href: routes.floor(city.slug, district.slug, project.slug, building.id, floor.id),
  });
  if (!unit) return crumbs;

  crumbs.push({
    level: "unit",
    label: `Unit ${unit.unitNumber}`,
    href: routes.unit(
      city.slug,
      district.slug,
      project.slug,
      building.id,
      floor.id,
      unit.id
    ),
  });
  return crumbs;
}
