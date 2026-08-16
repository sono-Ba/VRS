import type {
  Building,
  City,
  District,
  Floor,
  Project,
  Unit,
} from "@/domain";
import { apiFetch } from "@/services/api/http";
import type {
  BuildingRepository,
  CityRepository,
  DistrictRepository,
  FloorRepository,
  ProjectQuery,
  ProjectRepository,
  UnitQuery,
  UnitRepository,
} from "../interfaces";

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const serialized = search.toString();
  return serialized ? `?${serialized}` : "";
}

export class HttpCityRepository implements CityRepository {
  getAll() {
    return apiFetch<City[]>("/api/cities");
  }
  getBySlug(slug: string) {
    return apiFetch<City | null>(`/api/cities/${slug}`);
  }
}

export class HttpDistrictRepository implements DistrictRepository {
  getByCity(cityId: string) {
    return apiFetch<District[]>(`/api/districts${query({ cityId })}`);
  }
  getBySlug(citySlug: string, districtSlug: string) {
    return apiFetch<District | null>(`/api/cities/${citySlug}/districts/${districtSlug}`);
  }
}

export class HttpProjectRepository implements ProjectRepository {
  getAll(q?: ProjectQuery) {
    return apiFetch<Project[]>(`/api/projects${query({ ...q })}`);
  }
  getById(id: string) {
    return apiFetch<Project | null>(`/api/projects/${id}`);
  }
  getByDistrict(districtId: string) {
    return apiFetch<Project[]>(`/api/projects${query({ districtId })}`);
  }
}

export class HttpBuildingRepository implements BuildingRepository {
  getByProject(projectId: string) {
    return apiFetch<Building[]>(`/api/buildings${query({ projectId })}`);
  }
  getById(id: string) {
    return apiFetch<Building | null>(`/api/buildings/${id}`);
  }
}

export class HttpFloorRepository implements FloorRepository {
  getByBuilding(buildingId: string) {
    return apiFetch<Floor[]>(`/api/floors${query({ buildingId })}`);
  }
  getById(id: string) {
    return apiFetch<Floor | null>(`/api/floors/${id}`);
  }
}

export class HttpUnitRepository implements UnitRepository {
  getAll(q?: UnitQuery) {
    return apiFetch<Unit[]>(`/api/units${query({ ...q })}`);
  }
  getById(id: string) {
    return apiFetch<Unit | null>(`/api/units/${id}`);
  }
  getByIds(ids: string[]) {
    if (ids.length === 0) return Promise.resolve([]);
    return apiFetch<Unit[]>(`/api/units${query({ ids: ids.join(",") })}`);
  }
}
