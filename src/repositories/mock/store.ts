import type {
  ClientInterest,
  Enquiry,
  JourneySnapshot,
  RecentlyViewedEntry,
  SavedProject,
  SavedUnit,
} from "@/domain";

/**
 * In-memory persistence for the mock backend. Lives on the server process and
 * is intentionally ephemeral — the HTTP repositories in front of it are what
 * the application depends on, so swapping in a real database changes nothing
 * above this file.
 */
interface MockDatabase {
  savedProjects: SavedProject[];
  savedUnits: SavedUnit[];
  interests: ClientInterest[];
  recentlyViewed: Map<string, RecentlyViewedEntry[]>;
  journeys: Map<string, JourneySnapshot>;
  enquiries: Enquiry[];
}

const globalRef = globalThis as typeof globalThis & {
  __vrsMockDb?: MockDatabase;
};

export function db(): MockDatabase {
  if (!globalRef.__vrsMockDb) {
    globalRef.__vrsMockDb = {
      savedProjects: [],
      savedUnits: [],
      interests: [],
      recentlyViewed: new Map(),
      journeys: new Map(),
      enquiries: [],
    };
  }
  return globalRef.__vrsMockDb;
}

export function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
