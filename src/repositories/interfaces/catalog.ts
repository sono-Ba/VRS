import type {
  Building,
  City,
  District,
  Floor,
  Project,
  Unit,
} from "@/domain";

export interface ProjectQuery {
  cityId?: string;
  districtId?: string;
  status?: Project["status"];
}

export interface UnitQuery {
  projectId?: string;
  buildingId?: string;
  floorId?: string;
  availability?: Unit["availability"];
  bedrooms?: number;
}

export interface CityRepository {
  getAll(): Promise<City[]>;
  getBySlug(slug: string): Promise<City | null>;
}

export interface DistrictRepository {
  getByCity(cityId: string): Promise<District[]>;
  getBySlug(citySlug: string, districtSlug: string): Promise<District | null>;
}

export interface ProjectRepository {
  getAll(query?: ProjectQuery): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  getByDistrict(districtId: string): Promise<Project[]>;
}

export interface BuildingRepository {
  getByProject(projectId: string): Promise<Building[]>;
  getById(id: string): Promise<Building | null>;
}

export interface FloorRepository {
  getByBuilding(buildingId: string): Promise<Floor[]>;
  getById(id: string): Promise<Floor | null>;
}

export interface UnitRepository {
  getAll(query?: UnitQuery): Promise<Unit[]>;
  getById(id: string): Promise<Unit | null>;
  getByIds(ids: string[]): Promise<Unit[]>;
}
