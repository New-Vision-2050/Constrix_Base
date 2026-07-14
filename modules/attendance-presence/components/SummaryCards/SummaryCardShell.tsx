"use client";

import React from "react";
import { useAttendanceDirection } from "../../utils/direction";

interface SummaryCardShellProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Accent color (hex) used for the icon chip and ambient glow. */
  accent?: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function SummaryCardShell({
  icon,
  title,
  children,
  footer,
  className = "",
  accent = "#EC1E8C",
}: SummaryCardShellProps) {
  const { isRtl } = useAttendanceDirection();

  return (
    <div
      className={`group relative flex min-h-[152px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-sidebar p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 ${className}`}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 14px 34px -20px rgba(0,0,0,0.7)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.75)}, transparent)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-14 h-36 w-36 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-70"
        style={{
          background: hexToRgba(accent, 0.6),
          insetInlineEnd: "-2.5rem",
        }}
      />

      <div className="relative z-10 mb-3 flex items-start justify-between gap-3">
        {isRtl ? (
          <>
            <span className="text-start text-xs leading-snug text-muted-foreground">
              {title}
            </span>
            <IconChip accent={accent}>{icon}</IconChip>
          </>
        ) : (
          <>
            <IconChip accent={accent}>{icon}</IconChip>
            <span className="text-end text-xs leading-snug text-muted-foreground">
              {title}
            </span>
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center">
        {children}
      </div>

      {footer ? <div className="relative z-10 mt-auto pt-3">{footer}</div> : null}
    </div>
  );
}

function IconChip({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110"
      style={{
        color: accent,
        backgroundColor: hexToRgba(accent, 0.14),
        boxShadow: `inset 0 0 0 1px ${hexToRgba(accent, 0.28)}`,
      }}
    >
      {children}
    </div>
  );
}
