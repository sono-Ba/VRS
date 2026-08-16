export type DataSource = "mock" | "api";

/**
 * Environment is read here and nowhere else. UI and services depend on this
 * module, never on `process.env` directly.
 */
export const config = {
  dataSource: (process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock") as DataSource,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
} as const;
