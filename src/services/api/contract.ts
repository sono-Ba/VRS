/** Shared API success/error contract. Adapters at the boundary map to these. */

export type ApiErrorCode =
  | "validation_error"
  | "unauthenticated"
  | "unauthorized"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "upstream_unavailable"
  | "server_error";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string>;
}

export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export const HTTP_STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  validation_error: 400,
  unauthenticated: 401,
  unauthorized: 403,
  not_found: 404,
  conflict: 409,
  rate_limited: 429,
  upstream_unavailable: 502,
  server_error: 500,
};

/** Thrown by HTTP repositories so the UI can branch on semantics, not status codes. */
export class ApiClientError extends Error {
  readonly code: ApiErrorCode;
  readonly details?: Record<string, string>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.code = error.code;
    this.details = error.details;
  }
}
