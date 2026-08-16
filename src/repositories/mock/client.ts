import type {
  ClientInterest,
  Enquiry,
  InterestLevel,
  JourneySnapshot,
  RecentlyViewedEntry,
  SavedProject,
  SavedUnit,
} from "@/domain";
import type {
  EnquiryRepository,
  InterestRepository,
  JourneyRepository,
  RecentlyViewedRepository,
  SavedProjectRepository,
  SavedUnitRepository,
} from "../interfaces";
import { db, newId } from "./store";

const RECENTLY_VIEWED_LIMIT = 12;

export class MockSavedProjectRepository implements SavedProjectRepository {
  async list(userId: string): Promise<SavedProject[]> {
    return db().savedProjects.filter((s) => s.userId === userId);
  }

  async add(userId: string, projectId: string): Promise<SavedProject> {
    const existing = db().savedProjects.find(
      (s) => s.userId === userId && s.projectId === projectId
    );
    if (existing) return existing;
    const record: SavedProject = {
      id: newId("sp"),
      userId,
      projectId,
      createdAt: new Date().toISOString(),
    };
    db().savedProjects.push(record);
    return record;
  }

  async remove(userId: string, projectId: string): Promise<void> {
    const store = db();
    store.savedProjects = store.savedProjects.filter(
      (s) => !(s.userId === userId && s.projectId === projectId)
    );
  }
}

export class MockSavedUnitRepository implements SavedUnitRepository {
  async list(userId: string): Promise<SavedUnit[]> {
    return db().savedUnits.filter((s) => s.userId === userId);
  }

  async add(userId: string, projectId: string, unitId: string): Promise<SavedUnit> {
    const existing = db().savedUnits.find(
      (s) => s.userId === userId && s.unitId === unitId
    );
    if (existing) return existing;
    const record: SavedUnit = {
      id: newId("su"),
      userId,
      projectId,
      unitId,
      createdAt: new Date().toISOString(),
    };
    db().savedUnits.push(record);
    return record;
  }

  async remove(userId: string, unitId: string): Promise<void> {
    const store = db();
    store.savedUnits = store.savedUnits.filter(
      (s) => !(s.userId === userId && s.unitId === unitId)
    );
  }
}

export class MockInterestRepository implements InterestRepository {
  async list(userId: string): Promise<ClientInterest[]> {
    return db().interests.filter((i) => i.userId === userId);
  }

  async set(
    userId: string,
    entityType: ClientInterest["entityType"],
    entityId: string,
    level: InterestLevel
  ): Promise<ClientInterest> {
    const now = new Date().toISOString();
    const existing = db().interests.find(
      (i) => i.userId === userId && i.entityType === entityType && i.entityId === entityId
    );
    if (existing) {
      existing.level = level;
      existing.updatedAt = now;
      return existing;
    }
    const record: ClientInterest = {
      id: newId("int"),
      userId,
      entityType,
      entityId,
      level,
      createdAt: now,
      updatedAt: now,
    };
    db().interests.push(record);
    return record;
  }
}

export class MockRecentlyViewedRepository implements RecentlyViewedRepository {
  async list(userId: string): Promise<RecentlyViewedEntry[]> {
    return db().recentlyViewed.get(userId) ?? [];
  }

  async record(
    userId: string,
    entityType: RecentlyViewedEntry["entityType"],
    entityId: string
  ): Promise<void> {
    const store = db().recentlyViewed;
    const existing = store.get(userId) ?? [];
    const filtered = existing.filter(
      (e) => !(e.entityType === entityType && e.entityId === entityId)
    );
    filtered.unshift({ entityType, entityId, viewedAt: new Date().toISOString() });
    store.set(userId, filtered.slice(0, RECENTLY_VIEWED_LIMIT));
  }
}

export class MockJourneyRepository implements JourneyRepository {
  async get(userId: string): Promise<JourneySnapshot | null> {
    return db().journeys.get(userId) ?? null;
  }

  async save(userId: string, snapshot: JourneySnapshot): Promise<void> {
    db().journeys.set(userId, snapshot);
  }
}

export class MockEnquiryRepository implements EnquiryRepository {
  async listForUser(userId: string): Promise<Enquiry[]> {
    return db().enquiries.filter((e) => e.userId === userId);
  }

  async listAll(): Promise<Enquiry[]> {
    return [...db().enquiries];
  }

  async create(input: {
    userId?: string;
    projectId?: string;
    unitId?: string;
    name?: string;
    email?: string;
    message?: string;
  }): Promise<Enquiry> {
    const now = new Date().toISOString();
    const record: Enquiry = {
      id: newId("enq"),
      ...input,
      status: "submitted",
      createdAt: now,
      updatedAt: now,
    };
    db().enquiries.push(record);
    return record;
  }
}
