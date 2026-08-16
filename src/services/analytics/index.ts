/**
 * Analytics facade. Presentation code calls `analytics.track(...)` and never
 * touches a vendor SDK, so swapping providers is a change to this file only.
 */

export type AnalyticsEvent =
  | "city_selected"
  | "district_selected"
  | "project_viewed"
  | "project_saved"
  | "experience_entered"
  | "unit_viewed"
  | "unit_saved"
  | "compare_added"
  | "comparison_opened"
  | "enquiry_started"
  | "enquiry_submitted"
  | "sales_session_started"
  | "sales_session_completed";

export type AnalyticsContext = Record<string, string | number | boolean | undefined>;

interface AnalyticsSink {
  track(event: AnalyticsEvent, context?: AnalyticsContext): void;
}

/**
 * Development sink. A production sink would forward to the chosen provider —
 * only events with a stated product purpose should ever be added.
 */
const consoleSink: AnalyticsSink = {
  track(event, context) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[analytics] ${event}`, context ?? {});
    }
  },
};

let sink: AnalyticsSink = consoleSink;

export const analytics = {
  track(event: AnalyticsEvent, context?: AnalyticsContext): void {
    sink.track(event, context);
  },
  setSink(next: AnalyticsSink): void {
    sink = next;
  },
};
