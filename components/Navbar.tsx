"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDevice } from "./DeviceContext";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/alerts", label: "Alerts" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { deviceId, setDeviceId } = useDevice();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-panel-seam bg-panel-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-md border border-panel-seam bg-panel-surface shadow-rivet">
            <span className="h-2 w-2 rounded-full bg-grain animate-blink" />
            <span className="rivet-corner left-0.5 top-0.5" />
            <span className="rivet-corner bottom-0.5 right-0.5" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold tracking-wide text-panel-text sm:text-base">
              CROP DRYER
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-panel-faint">
              Control Panel
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 font-body text-sm transition-colors ${
                  active
                    ? "bg-panel-surface2 text-grain-soft"
                    : "text-panel-muted hover:bg-panel-surface hover:text-panel-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-panel-faint">
            Device
          </label>
          <input
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="all devices"
            className="w-36 rounded-md border border-panel-seam bg-panel-surface px-2.5 py-1.5 font-mono text-xs text-panel-text placeholder:text-panel-faint focus:border-grain lg:w-44"
          />
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-panel-seam bg-panel-surface text-panel-text md:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span className="h-0.5 w-4 bg-panel-text" />
            <span className="h-0.5 w-4 bg-panel-text" />
            <span className="h-0.5 w-4 bg-panel-text" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-panel-seam bg-panel-surface px-4 py-3 md:hidden">
          <nav className="mb-3 flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2 font-body text-sm ${
                    active
                      ? "bg-panel-surface2 text-grain-soft"
                      : "text-panel-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-panel-faint">
            Device filter
          </label>
          <input
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="all devices"
            className="w-full rounded-md border border-panel-seam bg-panel-surface2 px-2.5 py-2 font-mono text-xs text-panel-text placeholder:text-panel-faint focus:border-grain"
          />
        </div>
      )}
    </header>
  );
}
