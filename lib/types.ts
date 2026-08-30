export type AlarmLevel = "OK" | "WARN" | "HIGH";

export interface Reading {
  id: number | string;
  created_at: string;
  temperature: number;
  humidity: number;
  water: number;
  fan_on: boolean;
  alarm: AlarmLevel;
  device_id?: string | null;
  rain?: number;
  rainStatus?: string;
}

export interface ApiResponse<T> {
  status: "ok" | "error";
  data: T;
  message?: string;
}
