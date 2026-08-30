"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Reading } from "@/lib/types";

function TooltipCard({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-panel-seam bg-panel-surface px-3 py-2 shadow-panel">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-panel-faint">
        {label}
      </p>
      {payload.map((p: any) => (
        <p
          key={p.dataKey}
          className="font-mono text-xs"
          style={{ color: p.color }}
        >
          {p.name}: {p.value?.toFixed(1)}
          {p.dataKey === "temperature" ? "°C" : "%"}
        </p>
      ))}
    </div>
  );
}

export default function ReadingsChart({ readings }: { readings: Reading[] }) {
  const data = [...readings]
    .reverse()
    .map((r) => ({
      time: new Date(r.created_at).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: r.temperature,
      humidity: r.humidity,
    }));

  return (
    <div className="h-64 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A227" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="humFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5B9279" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#5B9279" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#3A3222" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#6E6552"
            tick={{ fill: "#A69A80", fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={{ stroke: "#3A3222" }}
            minTickGap={24}
          />
          <YAxis
            stroke="#6E6552"
            tick={{ fill: "#A69A80", fontSize: 11, fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip content={<TooltipCard />} />
          <Area
            type="monotone"
            dataKey="temperature"
            name="Temp"
            stroke="#E0C158"
            strokeWidth={2}
            fill="url(#tempFill)"
          />
          <Area
            type="monotone"
            dataKey="humidity"
            name="Humidity"
            stroke="#7FB69B"
            strokeWidth={2}
            fill="url(#humFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
