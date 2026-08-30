"use client";

import { useCallback, useEffect, useState } from "react";
import { getAlerts, ApiError } from "@/lib/api";
import { useDevice } from "@/components/DeviceContext";
import type { Reading } from "@/lib/types";
import AlarmBadge from "@/components/AlarmBadge";
import ErrorState from "@/components/ErrorState";
import { fmtNum, formatClock, timeAgo } from "@/lib/format";

export default function AlertsPage() {
  const { deviceId } = useDevice();
  const [alerts, setAlerts] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlerts(deviceId || undefined);
      setAlerts(data);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Something went wrong loading alerts."
      );
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-panel-text sm:text-2xl">
          Alerts
        </h1>
        <p className="mt-1 font-body text-sm text-panel-muted">
          {deviceId ? `Device "${deviceId}"` : "All devices"} · readings flagged WARN or HIGH
        </p>
      </div>

      {error && !loading ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-panel-seam bg-panel-surface"
            />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-panel-seam bg-panel-surface px-6 py-14 text-center shadow-panel">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ok/50 bg-ok-dim">
            <span className="h-2.5 w-2.5 rounded-full bg-ok" />
          </div>
          <p className="font-display text-sm font-semibold text-panel-text">
            Nothing to flag
          </p>
          <p className="max-w-xs font-body text-sm text-panel-muted">
            Every reading for this filter has come back OK. New WARN or HIGH readings will show up here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {alerts.map((r) => (
            <div
              key={r.id}
              className={`relative overflow-hidden rounded-lg border p-4 shadow-panel ${
                r.alarm === "HIGH"
                  ? "border-high-deep/50 bg-high-dim/50"
                  : "border-warn-deep/40 bg-warn-dim/40"
              }`}
            >
              <span className="rivet-corner left-1.5 top-1.5" />
              <span className="rivet-corner right-1.5 top-1.5" />
              <div className="mb-2 flex items-center justify-between">
                <AlarmBadge alarm={r.alarm} />
                <span className="font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                  {timeAgo(r.created_at)}
                </span>
              </div>
              <div className="mb-1 grid grid-cols-3 gap-2 font-mono text-sm text-panel-text">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-panel-faint">Temp</p>
                  {fmtNum(r.temperature)}°C
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-panel-faint">Humidity</p>
                  {fmtNum(r.humidity)}%
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-panel-faint">Water</p>
                  {r.water}
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                {formatClock(r.created_at)}
                {r.device_id ? ` · ${r.device_id}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
