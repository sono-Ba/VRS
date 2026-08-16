import type {
  Building,
  City,
  District,
  Floor,
  Project,
  Unit,
} from "@/domain";
import { catalogRepositories } from "@/repositories";

/**
 * Application use cases for spatial navigation. Pages depend on this,
 * not on repositories or mock data directly.
 */

export interface SpatialContext {
  city: City;
  district?: District;
  project?: Project;
  building?: Building;
  floor?: Floor;
  unit?: Unit;
}

export async function getCities(): Promise<City[]> {
  return catalogRepositories().cities.getAll();
}

export async function getCity(slug: string): Promise<City | null> {
  return catalogRepositories().cities.getBySlug(slug);
}

export async function getDistricts(cityId: string): Promise<District[]> {
  return catalogRepositories().districts.getByCity(cityId);
}

export async function getDistrict(
  citySlug: string,
  districtSlug: string
): Promise<District | null> {
  return catalogRepositories().districts.getBySlug(citySlug, districtSlug);
}

export async function getProjectsInDistrict(districtId: string): Promise<Project[]> {
  return catalogRepositories().projects.getByDistrict(districtId);
}

export async function getProject(id: string): Promise<Project | null> {
  return catalogRepositories().projects.getById(id);
}

export async function getProjects(): Promise<Project[]> {
  return catalogRepositories().projects.getAll();
}

export async function getBuildings(projectId: string): Promise<Building[]> {
  return catalogRepositories().buildings.getByProject(projectId);
}

export async function getBuilding(id: string): Promise<Building | null> {
  return catalogRepositories().buildings.getById(id);
}

export async function getFloors(buildingId: string): Promise<Floor[]> {
  return catalogRepositories().floors.getByBuilding(buildingId);
}

export async function getFloor(id: string): Promise<Floor | null> {
  return catalogRepositories().floors.getById(id);
}

export async function getUnitsOnFloor(floorId: string): Promise<Unit[]> {
  return catalogRepositories().units.getAll({ floorId });
}

export async function getUnitsInProject(projectId: string): Promise<Unit[]> {
  return catalogRepositories().units.getAll({ projectId });
}

export async function getUnit(id: string): Promise<Unit | null> {
  return catalogRepositories().units.getById(id);
}

export async function getUnitsByIds(ids: string[]): Promise<Unit[]> {
  return catalogRepositories().units.getByIds(ids);
}

/**
 * Resolves the full ancestry for a route. Returns null when any link in the
 * chain is missing or inconsistent, so pages can render a proper not-found
 * state instead of a half-populated breadcrumb.
 */
export async function resolveContext(params: {
  citySlug: string;
  districtSlug?: string;
  projectSlug?: string;
  buildingId?: string;
  floorId?: string;
  unitId?: string;
}): Promise<SpatialContext | null> {
  const city = await getCity(params.citySlug);
  if (!city) return null;
  if (!params.districtSlug) return { city };

  const district = await getDistrict(params.citySlug, params.districtSlug);
  if (!district) return null;
  if (!params.projectSlug) return { city, district };

  const project = await getProject(params.projectSlug);
  if (!project || project.districtId !== district.id) return null;
  if (!params.buildingId) return { city, district, project };

  const building = await getBuilding(params.buildingId);
  if (!building || building.projectId !== project.id) return null;
  if (!params.floorId) return { city, district, project, building };

  const floor = await getFloor(params.floorId);
  if (!floor || floor.buildingId !== building.id) return null;
  if (!params.unitId) return { city, district, project, building, floor };

  const unit = await getUnit(params.unitId);
  if (!unit || unit.floorId !== floor.id) return null;
  return { city, district, project, building, floor, unit };
}
