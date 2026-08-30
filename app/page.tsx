"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLatest, getReadings, ApiError } from "@/lib/api";
import { useDevice } from "@/components/DeviceContext";
import type { Reading } from "@/lib/types";
import StatCard from "@/components/StatCard";
import AlarmBadge from "@/components/AlarmBadge";
import ErrorState from "@/components/ErrorState";
import { StatSkeleton, ChartSkeleton } from "@/components/LoadingSkeleton";
import { fmtNum, formatClock, timeAgo } from "@/lib/format";
import ReadingsChart from "@/components/ReadingsChart";

const POLL_MS = 12000;

const ThermoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0Z" />
  </svg>
);
const DropIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2.7s6 6.3 6 10.8a6 6 0 1 1-12 0c0-4.5 6-10.8 6-10.8Z" />
  </svg>
);
const WaterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const FanIcon = ({ spinning }: { spinning: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={spinning ? "animate-[spin_2.2s_linear_infinite]" : ""}
  >
    <path d="M12 2c1.5 3 1.5 6 0 8-1.5-2-1.5-5 0-8Z" />
    <path d="M12 22c-1.5-3-1.5-6 0-8 1.5 2 1.5 5 0 8Z" />
    <path d="M2 12c3-1.5 6-1.5 8 0-2 1.5-5 1.5-8 0Z" />
    <path d="M22 12c-3 1.5-6 1.5-8 0 2-1.5 5-1.5 8 0Z" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);
const RainIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M16 14v6" />
    <path d="M8 14v6" />
    <path d="M12 16v6" />
  </svg>
);

export default function DashboardPage() {
  const { deviceId } = useDevice();
  const [latest, setLatest] = useState<Reading | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(
    async (showSpinner: boolean) => {
      if (showSpinner) setLoading(true);
      setError(null);
      try {
        const [l, h] = await Promise.all([
          getLatest(deviceId || undefined),
          getReadings(50, deviceId || undefined),
        ]);
        setLatest(l);
        setHistory(h);
        setRefreshedAt(Date.now());
      } catch (e) {
        setError(
          e instanceof ApiError ? e.message : "Something went wrong loading readings."
        );
      } finally {
        setLoading(false);
      }
    },
    [deviceId]
  );

  useEffect(() => {
    load(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => load(false), POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [load]);

  const accent =
    latest?.alarm === "HIGH" ? "high" : latest?.alarm === "WARN" ? "warn" : "ok";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-xl font-semibold text-panel-text sm:text-2xl">
            Live readout
          </h1>
          <p className="mt-1 font-body text-sm text-panel-muted">
            {deviceId ? `Filtered to device "${deviceId}"` : "All devices"} · refreshes every {POLL_MS / 1000}s
          </p>
        </div>
        <div className="flex items-center gap-3">
          {latest && <AlarmBadge alarm={latest.alarm} />}
          <button
            onClick={() => load(true)}
            className="rounded-md border border-panel-seam bg-panel-surface px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-panel-text transition-colors hover:border-grain hover:text-grain-soft"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && !loading && (
        <ErrorState message={error} onRetry={() => load(true)} />
      )}

      {!error && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {loading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  label="Temperature"
                  value={fmtNum(latest?.temperature)}
                  unit="°C"
                  accent={accent}
                  icon={<ThermoIcon />}
                />
                <StatCard
                  label="Humidity"
                  value={fmtNum(latest?.humidity)}
                  unit="%"
                  accent={accent}
                  icon={<DropIcon />}
                />
                <StatCard
                  label="Water level"
                  value={latest ? String(latest.water) : "--"}
                  accent="grain"
                  icon={<WaterIcon />}
                />
                <div className="relative overflow-hidden rounded-lg border border-panel-seam bg-panel-surface p-4 shadow-panel sm:p-5">
                  <span className="rivet-corner left-1.5 top-1.5" />
                  <span className="rivet-corner right-1.5 top-1.5" />
                  <span className="rivet-corner left-1.5 bottom-1.5" />
                  <span className="rivet-corner right-1.5 bottom-1.5" />
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-panel-faint">
                    Fan
                  </p>
                  <div className="flex items-center gap-3 rounded-md border border-panel-seam bg-panel-bg/60 px-3 py-3">
                    <span
                      className={
                        latest?.fan_on ? "text-ok-soft" : "text-panel-faint"
                      }
                    >
                      <FanIcon spinning={!!latest?.fan_on} />
                    </span>
                    <span
                      className={`font-mono text-2xl font-semibold sm:text-3xl ${
                        latest?.fan_on ? "text-ok-soft" : "text-panel-faint"
                      }`}
                    >
                      {latest ? (latest.fan_on ? "ON" : "OFF") : "--"}
                    </span>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-panel-seam bg-panel-surface p-4 shadow-panel sm:p-5">
                  <span className="rivet-corner left-1.5 top-1.5" />
                  <span className="rivet-corner right-1.5 top-1.5" />
                  <span className="rivet-corner left-1.5 bottom-1.5" />
                  <span className="rivet-corner right-1.5 bottom-1.5" />
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-panel-faint">
                    Rain
                  </p>
                  <div className="flex items-center gap-3 rounded-md border border-panel-seam bg-panel-bg/60 px-3 py-3">
                    <span className="text-grain-soft">
                      <RainIcon />
                    </span>
                    <span className="font-mono text-2xl font-semibold sm:text-3xl text-grain-soft">
                      {latest?.rainStatus ?? "--"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="rounded-lg border border-panel-seam bg-panel-surface p-4 shadow-panel sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-sm font-semibold text-panel-text sm:text-base">
                Temperature &amp; humidity trend
              </h2>
              <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-grain-soft" /> Temp
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-ok-soft" /> Humidity
                </span>
              </div>
            </div>
            {loading ? (
              <ChartSkeleton />
            ) : history.length > 0 ? (
              <ReadingsChart readings={history} />
            ) : (
              <p className="py-10 text-center font-body text-sm text-panel-muted">
                No readings yet for this device.
              </p>
            )}
          </div>

          {latest && (
            <p className="text-right font-mono text-[10px] uppercase tracking-wide text-panel-faint">
              Last reading {formatClock(latest.created_at)} · {timeAgo(latest.created_at)} · page updated {timeAgo(new Date(refreshedAt).toISOString())}
            </p>
          )}
        </>
      )}
    </div>
  );
}
