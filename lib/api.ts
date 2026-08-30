import type { ApiResponse, Reading } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ApiError(
      "Could not reach the API. Check that the backend is running and reachable."
    );
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = (await res.json()) as ApiResponse<unknown>;
      if (body?.message) message = body.message;
    } catch {
      // ignore body parse errors, keep default message
    }
    throw new ApiError(message, res.status);
  }

  const body = (await res.json()) as ApiResponse<T>;
  if (body.status === "error") {
    throw new ApiError(body.message || "The API returned an error.");
  }
  return body.data;
}

function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== ""
  );
  if (entries.length === 0) return "";
  const search = new URLSearchParams(
    entries.map(([k, v]) => [k, String(v)])
  );
  return `?${search.toString()}`;
}

export function getLatest(deviceId?: string): Promise<Reading> {
  return request<Reading>(`/api/readings/latest${qs({ deviceId })}`);
}

export function getReadings(
  limit = 50,
  deviceId?: string
): Promise<Reading[]> {
  return request<Reading[]>(`/api/readings${qs({ limit, deviceId })}`);
}

export function getAlerts(deviceId?: string): Promise<Reading[]> {
  return request<Reading[]>(`/api/alerts${qs({ deviceId })}`);
}
