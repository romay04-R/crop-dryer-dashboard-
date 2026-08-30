import type { AlarmLevel } from "@/lib/types";

const STYLES: Record<
  AlarmLevel,
  { bg: string; text: string; dot: string; label: string }
> = {
  OK: { bg: "bg-ok-dim", text: "text-ok-soft", dot: "bg-ok", label: "OK" },
  WARN: {
    bg: "bg-warn-dim",
    text: "text-warn-soft",
    dot: "bg-warn",
    label: "WARN",
  },
  HIGH: {
    bg: "bg-high-dim",
    text: "text-high-soft",
    dot: "bg-high",
    label: "HIGH",
  },
};

export default function AlarmBadge({
  alarm,
  size = "md",
}: {
  alarm: AlarmLevel;
  size?: "sm" | "md";
}) {
  const s = STYLES[alarm] ?? STYLES.OK;
  const pulse = alarm === "HIGH";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide ${
        s.bg
      } ${s.text} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${s.dot} ${
          pulse ? "animate-blink" : ""
        }`}
      />
      {s.label}
    </span>
  );
}
