"use client";

import { useCallback, useEffect, useState } from "react";
import { getReadings, ApiError } from "@/lib/api";
import { useDevice } from "@/components/DeviceContext";
import type { Reading } from "@/lib/types";
import AlarmBadge from "@/components/AlarmBadge";
import ErrorState from "@/components/ErrorState";
import { RowSkeleton } from "@/components/LoadingSkeleton";
import { fmtNum, formatClock } from "@/lib/format";

const LIMITS = [20, 50, 100];

export default function HistoryPage() {
  const { deviceId } = useDevice();
  const [limit, setLimit] = useState(50);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReadings(limit, deviceId || undefined);
      setReadings(data);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Something went wrong loading history."
      );
    } finally {
      setLoading(false);
    }
  }, [limit, deviceId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-xl font-semibold text-panel-text sm:text-2xl">
            Reading history
          </h1>
          <p className="mt-1 font-body text-sm text-panel-muted">
            {deviceId ? `Device "${deviceId}"` : "All devices"} · showing up to {limit}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-panel-faint">
            Show
          </label>
          <div className="flex overflow-hidden rounded-md border border-panel-seam">
            {LIMITS.map((n) => (
              <button
                key={n}
                onClick={() => setLimit(n)}
                className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                  limit === n
                    ? "bg-panel-surface2 text-grain-soft"
                    : "bg-panel-surface text-panel-muted hover:text-panel-text"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && !loading ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-panel-seam bg-panel-surface shadow-panel">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-panel-seam bg-panel-surface2">
                  <th className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                    Time
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                    Temp
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                    Humidity
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                    Water
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                    Fan
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                    Alarm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-seam">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
                ) : readings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center font-body text-sm text-panel-muted">
                      No readings recorded yet.
                    </td>
                  </tr>
                ) : (
                  readings.map((r) => (
                    <tr key={r.id} className="hover:bg-panel-surface2/60">
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-panel-muted">
                        {formatClock(r.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-panel-text">
                        {fmtNum(r.temperature)}°C
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-panel-text">
                        {fmtNum(r.humidity)}%
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-panel-text">
                        {r.water}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs">
                        <span className={r.fan_on ? "text-ok-soft" : "text-panel-faint"}>
                          {r.fan_on ? "ON" : "OFF"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <AlarmBadge alarm={r.alarm} size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
