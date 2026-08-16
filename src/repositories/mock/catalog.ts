import {
  mockBuildings,
  mockCities,
  mockDistricts,
  mockFloors,
  mockProjects,
  mockUnits,
} from "@/data/mock/catalog";
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

/** Simulates network latency so loading states are exercised during development. */
const LATENCY_MS = 0;

async function settle<T>(value: T): Promise<T> {
  if (LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  }
  return value;
}

export class MockCityRepository implements CityRepository {
  getAll() {
    return settle([...mockCities]);
  }
  getBySlug(slug: string) {
    return settle(mockCities.find((c) => c.slug === slug) ?? null);
  }
}

export class MockDistrictRepository implements DistrictRepository {
  getByCity(cityId: string) {
    return settle(mockDistricts.filter((d) => d.cityId === cityId));
  }
  async getBySlug(citySlug: string, districtSlug: string) {
    const city = mockCities.find((c) => c.slug === citySlug);
    if (!city) return null;
    return settle(
      mockDistricts.find((d) => d.cityId === city.id && d.slug === districtSlug) ?? null
    );
  }
}

export class MockProjectRepository implements ProjectRepository {
  getAll(query?: ProjectQuery) {
    let result = [...mockProjects];
    if (query?.cityId) result = result.filter((p) => p.cityId === query.cityId);
    if (query?.districtId) result = result.filter((p) => p.districtId === query.districtId);
    if (query?.status) result = result.filter((p) => p.status === query.status);
    return settle(result);
  }
  getById(id: string) {
    return settle(mockProjects.find((p) => p.id === id) ?? null);
  }
  getByDistrict(districtId: string) {
    return settle(mockProjects.filter((p) => p.districtId === districtId));
  }
}

export class MockBuildingRepository implements BuildingRepository {
  getByProject(projectId: string) {
    return settle(mockBuildings.filter((b) => b.projectId === projectId));
  }
  getById(id: string) {
    return settle(mockBuildings.find((b) => b.id === id) ?? null);
  }
}

export class MockFloorRepository implements FloorRepository {
  getByBuilding(buildingId: string) {
    return settle(mockFloors.filter((f) => f.buildingId === buildingId));
  }
  getById(id: string) {
    return settle(mockFloors.find((f) => f.id === id) ?? null);
  }
}

export class MockUnitRepository implements UnitRepository {
  getAll(query?: UnitQuery) {
    let result = [...mockUnits];
    if (query?.projectId) result = result.filter((u) => u.projectId === query.projectId);
    if (query?.buildingId) result = result.filter((u) => u.buildingId === query.buildingId);
    if (query?.floorId) result = result.filter((u) => u.floorId === query.floorId);
    if (query?.availability) result = result.filter((u) => u.availability === query.availability);
    if (query?.bedrooms !== undefined) {
      result = result.filter((u) => u.bedrooms === query.bedrooms);
    }
    return settle(result);
  }
  getById(id: string) {
    return settle(mockUnits.find((u) => u.id === id) ?? null);
  }
  getByIds(ids: string[]) {
    return settle(mockUnits.filter((u) => ids.includes(u.id)));
  }
}
