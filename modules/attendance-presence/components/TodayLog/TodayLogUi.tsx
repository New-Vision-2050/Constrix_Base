"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const TODAY_LOG_COLORS = {
  magenta: "#FF2D78",
  yellow: "#FFD700",
  green: "#4CAF50",
  track: "#2A2A45",
  card: "#1C1C35",
} as const;

export const TODAY_LOG_ACCENTS = {
  checkIn: "text-[#FF2D78]",
  checkOut: "text-[#FFD700]",
  workHours: "text-[#4CAF50]",
  highlight: "text-[#FFD700]",
} as const;

export function TodayLogActionButtonContent({
  label,
  icon,
  className,
}: {
  label: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex w-full items-center justify-center px-10",
        className,
      )}
    >
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
        {icon}
      </span>
      <span className="text-center">{label}</span>
    </span>
  );
}

export function ElapsedTimeDisplay({
  minutes,
  hoursShort,
  isRtl,
}: {
  minutes: number;
  hoursShort: string;
  isRtl: boolean;
}) {
  const hours = Math.floor(Math.max(0, minutes) / 60);
  const mins = Math.max(0, minutes) % 60;
  const time = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

  if (isRtl) {
    return (
      <span
        className="inline-flex items-baseline gap-0.5 text-[1.75rem] font-bold leading-none text-foreground"
        dir="ltr"
      >
        <span className="text-base font-bold">{hoursShort}</span>
        <span>{time}</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-baseline gap-0.5 text-[1.75rem] font-bold leading-none text-foreground"
      dir="ltr"
    >
      <span>{time}</span>
      <span className="text-base font-bold">{hoursShort}</span>
    </span>
  );
}

function StatIconShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center [&_svg]:h-[22px] [&_svg]:w-[22px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CheckInBracketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 4v16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 12h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckOutBracketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M19 4v16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 12H5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 7 4 12l5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckInStatIcon() {
  return (
    <StatIconShell className={TODAY_LOG_ACCENTS.checkIn}>
      <CheckInBracketIcon />
    </StatIconShell>
  );
}

export function CheckOutStatIcon() {
  return (
    <StatIconShell className={TODAY_LOG_ACCENTS.checkOut}>
      <CheckOutBracketIcon />
    </StatIconShell>
  );
}

export function WorkHoursStatIcon() {
  return (
    <StatIconShell className={TODAY_LOG_ACCENTS.workHours}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8.25"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 7.75V12l2.75 1.75"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </StatIconShell>
  );
}

export function CheckInActionIcon() {
  return <CheckInBracketIcon className="h-5 w-5" />;
}

export function CheckOutActionIcon() {
  return <CheckOutBracketIcon className="h-5 w-5" />;
}

export function RequestPermissionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 15.5 15.5 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13 8.5h2.5V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
