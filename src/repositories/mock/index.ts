import {
  MockEnquiryRepository,
  MockInterestRepository,
  MockJourneyRepository,
  MockRecentlyViewedRepository,
  MockSavedProjectRepository,
  MockSavedUnitRepository,
} from "./client";

/** Server-side client-layer repositories, used by the /api/me route handlers. */
export const clientRepositories = {
  savedProjects: new MockSavedProjectRepository(),
  savedUnits: new MockSavedUnitRepository(),
  interests: new MockInterestRepository(),
  recentlyViewed: new MockRecentlyViewedRepository(),
  journey: new MockJourneyRepository(),
  enquiries: new MockEnquiryRepository(),
};
