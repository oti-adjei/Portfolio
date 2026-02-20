export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function normalizeBase(baseUrl?: string): string {
  const trimmed = (baseUrl ?? "").trim();
  if (!trimmed) return "";
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export function getApiBaseUrl(): string {
  return normalizeBase(import.meta.env.VITE_API_BASE_URL);
}

function buildUrl(path: string, baseUrl?: string): string {
  const base = normalizeBase(baseUrl ?? getApiBaseUrl());
  if (!base) return path;
  return `${base}${path}`;
}

function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json") ?? false;
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
  baseUrl?: string
): Promise<T> {
  const response = await fetch(buildUrl(path, baseUrl), init);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    if (isJsonResponse(response)) {
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (body?.error) message = body.error;
    }
    throw new ApiError(message, response.status);
  }

  if (!isJsonResponse(response)) {
    return null as T;
  }

  return (await response.json()) as T;
}

export function authHeaders(token: string | null): HeadersInit {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
