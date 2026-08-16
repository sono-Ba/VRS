import { ApiClientError, type ApiResponse } from "./contract";

/** Resolves an absolute base URL so the client works in browser and server contexts. */
function resolveUrl(path: string): string {
  if (typeof window !== "undefined") return path;
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;
  return `${base}${path}`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(resolveUrl(path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiClientError({
      code: "upstream_unavailable",
      message: "The service is unreachable. Check your connection and try again.",
    });
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiClientError({
      code: "server_error",
      message: "The service returned an unreadable response.",
    });
  }

  if ("error" in payload) {
    throw new ApiClientError(payload.error);
  }
  return payload.data;
}
