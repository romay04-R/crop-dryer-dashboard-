import type { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  unit,
  accent = "grain",
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: "grain" | "ok" | "warn" | "high";
  icon?: ReactNode;
}) {
  const accentText =
    accent === "ok"
      ? "text-ok-soft"
      : accent === "warn"
      ? "text-warn-soft"
      : accent === "high"
      ? "text-high-soft"
      : "text-grain-soft";

  return (
    <div className="relative overflow-hidden rounded-lg border border-panel-seam bg-panel-surface p-4 shadow-panel sm:p-5">
      <span className="rivet-corner left-1.5 top-1.5" />
      <span className="rivet-corner right-1.5 top-1.5" />
      <span className="rivet-corner left-1.5 bottom-1.5" />
      <span className="rivet-corner right-1.5 bottom-1.5" />

      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-panel-faint">
          {label}
        </p>
        {icon && <div className={accentText}>{icon}</div>}
      </div>

      <div className="rounded-md border border-panel-seam bg-panel-bg/60 px-3 py-3">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-mono text-3xl font-semibold tabular-nums sm:text-4xl ${accentText}`}
          >
            {value}
          </span>
          {unit && (
            <span className="font-mono text-sm text-panel-faint">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
}
