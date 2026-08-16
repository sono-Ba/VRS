import type {
  ClientInterest,
  Enquiry,
  InterestLevel,
  JourneySnapshot,
  RecentlyViewedEntry,
  SavedProject,
  SavedUnit,
} from "@/domain";

export interface SavedProjectRepository {
  list(userId: string): Promise<SavedProject[]>;
  add(userId: string, projectId: string): Promise<SavedProject>;
  remove(userId: string, projectId: string): Promise<void>;
}

export interface SavedUnitRepository {
  list(userId: string): Promise<SavedUnit[]>;
  add(userId: string, projectId: string, unitId: string): Promise<SavedUnit>;
  remove(userId: string, unitId: string): Promise<void>;
}

export interface InterestRepository {
  list(userId: string): Promise<ClientInterest[]>;
  set(
    userId: string,
    entityType: ClientInterest["entityType"],
    entityId: string,
    level: InterestLevel
  ): Promise<ClientInterest>;
}

export interface RecentlyViewedRepository {
  list(userId: string): Promise<RecentlyViewedEntry[]>;
  record(
    userId: string,
    entityType: RecentlyViewedEntry["entityType"],
    entityId: string
  ): Promise<void>;
}

export interface JourneyRepository {
  get(userId: string): Promise<JourneySnapshot | null>;
  save(userId: string, snapshot: JourneySnapshot): Promise<void>;
}

export interface EnquiryRepository {
  listForUser(userId: string): Promise<Enquiry[]>;
  listAll(): Promise<Enquiry[]>;
  create(input: {
    userId?: string;
    projectId?: string;
    unitId?: string;
    name?: string;
    email?: string;
    message?: string;
  }): Promise<Enquiry>;
}
