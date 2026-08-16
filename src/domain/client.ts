/** Client personal-layer models: saves, interests, journey. */

export interface SavedProject {
  id: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

export interface SavedUnit {
  id: string;
  userId: string;
  projectId: string;
  unitId: string;
  createdAt: string;
}

export type InterestLevel =
  | "viewed"
  | "saved"
  | "interested"
  | "high_interest"
  | "enquired";

export interface ClientInterest {
  id: string;
  userId: string;
  entityType: "project" | "unit";
  entityId: string;
  level: InterestLevel;
  createdAt: string;
  updatedAt: string;
}

export interface RecentlyViewedEntry {
  entityType: "project" | "unit";
  entityId: string;
  viewedAt: string;
}

/** Enough spatial state to resume approximately the same place. */
export interface JourneySnapshot {
  cityId?: string;
  districtId?: string;
  projectId?: string;
  buildingId?: string;
  floorId?: string;
  unitId?: string;
  path: string;
  updatedAt: string;
}
