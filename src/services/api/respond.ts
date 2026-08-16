import { NextResponse } from "next/server";
import {
  HTTP_STATUS_BY_CODE,
  type ApiError,
  type ApiErrorCode,
} from "./contract";

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ data, ...(meta ? { meta } : {}) });
}

export function fail(
  code: ApiErrorCode,
  message: string,
  details?: Record<string, string>
) {
  const error: ApiError = { code, message, ...(details ? { details } : {}) };
  return NextResponse.json({ error }, { status: HTTP_STATUS_BY_CODE[code] });
}
