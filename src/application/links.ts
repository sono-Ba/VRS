import type { Project, Unit } from "@/domain";
import { routes } from "@/lib/routes";
import { catalogRepositories } from "@/repositories";

/**
 * Builds canonical deep links for entities that are only known by id
 * (saved items, comparisons, enquiries). Returns null when the ancestry
 * cannot be resolved, so callers can render the entity without a dead link.
 */
export async function linkForProject(project: Project): Promise<string | null> {
  const repos = catalogRepositories();
  const districts = await repos.districts.getByCity(project.cityId);
  const district = districts.find((d) => d.id === project.districtId);
  const cities = await repos.cities.getAll();
  const city = cities.find((c) => c.id === project.cityId);
  if (!city || !district) return null;
  return routes.project(city.slug, district.slug, project.slug);
}

export async function linkForUnit(unit: Unit): Promise<string | null> {
  if (!unit.buildingId || !unit.floorId) return null;
  const repos = catalogRepositories();
  const project = await repos.projects.getById(unit.projectId);
  if (!project) return null;

  const cities = await repos.cities.getAll();
  const city = cities.find((c) => c.id === project.cityId);
  if (!city) return null;

  const districts = await repos.districts.getByCity(project.cityId);
  const district = districts.find((d) => d.id === project.districtId);
  if (!district) return null;

  return routes.unit(
    city.slug,
    district.slug,
    project.slug,
    unit.buildingId,
    unit.floorId,
    unit.id
  );
}
