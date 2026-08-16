/**
 * Spatial catalog domain models.
 * Hierarchy: City → District → Project → Experience → Building → Floor → Unit
 */

import type { SceneConfig } from "@/viewers/core/types";

export interface City {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  scene: SceneConfig;
}

export interface District {
  id: string;
  slug: string;
  cityId: string;
  name: string;
  tagline: string;
  description: string;
  scene: SceneConfig;
}

export type ProjectStatus = "launch" | "selling" | "handover";

export interface Project {
  id: string;
  slug: string;
  cityId: string;
  districtId: string;
  name: string;
  developer: string;
  status: ProjectStatus;
  startingPrice: number;
  currency: string;
  handover: string;
  bedroomRange: string;
  lifestyle: string;
  description: string;
  amenities: string[];
  scene: SceneConfig;
}

export interface Building {
  id: string;
  projectId: string;
  name: string;
  floorsCount: number;
  scene: SceneConfig;
}

export interface Floor {
  id: string;
  buildingId: string;
  projectId: string;
  number: number;
  name: string;
  scene: SceneConfig;
}

export type UnitAvailability = "available" | "reserved" | "sold";

/** API-friendly unit shape per docs/DATA-MODEL.md — no presentation-specific fields. */
export interface Unit {
  id: string;
  unitCode: string;
  unitNumber: string;
  projectId: string;
  buildingId?: string;
  floorId?: string;
  floorNumber: number;
  unitType?: string;
  bedrooms?: number;
  bathrooms?: number;
  balconyArea?: number;
  netArea?: number;
  grossArea?: number;
  viewEN?: string;
  viewAR?: string;
  actualPrice?: number;
  availability?: UnitAvailability;
  unitPlanURL?: string;
  imageURL?: string;
}
