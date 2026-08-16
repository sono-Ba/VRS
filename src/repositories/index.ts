import { config } from "@/config";
import {
  MockBuildingRepository,
  MockCityRepository,
  MockDistrictRepository,
  MockFloorRepository,
  MockProjectRepository,
  MockUnitRepository,
} from "./mock/catalog";
import {
  HttpBuildingRepository,
  HttpCityRepository,
  HttpDistrictRepository,
  HttpFloorRepository,
  HttpProjectRepository,
  HttpUnitRepository,
} from "./http/catalog";
import type {
  BuildingRepository,
  CityRepository,
  DistrictRepository,
  FloorRepository,
  ProjectRepository,
  UnitRepository,
} from "./interfaces";

export interface CatalogRepositories {
  cities: CityRepository;
  districts: DistrictRepository;
  projects: ProjectRepository;
  buildings: BuildingRepository;
  floors: FloorRepository;
  units: UnitRepository;
}

const mockRepositories: CatalogRepositories = {
  cities: new MockCityRepository(),
  districts: new MockDistrictRepository(),
  projects: new MockProjectRepository(),
  buildings: new MockBuildingRepository(),
  floors: new MockFloorRepository(),
  units: new MockUnitRepository(),
};

const httpRepositories: CatalogRepositories = {
  cities: new HttpCityRepository(),
  districts: new HttpDistrictRepository(),
  projects: new HttpProjectRepository(),
  buildings: new HttpBuildingRepository(),
  floors: new HttpFloorRepository(),
  units: new HttpUnitRepository(),
};

/**
 * Composition root for catalog data. Switching `NEXT_PUBLIC_DATA_SOURCE`
 * from `mock` to `api` moves the whole application onto real HTTP endpoints
 * with no change to services, pages, or components.
 */
export function catalogRepositories(): CatalogRepositories {
  return config.dataSource === "api" ? httpRepositories : mockRepositories;
}

/** The API route handlers always read from the mock store — they *are* the backend. */
export const serverCatalogRepositories = mockRepositories;
