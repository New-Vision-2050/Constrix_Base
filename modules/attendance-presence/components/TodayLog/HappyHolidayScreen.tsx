"use client";

import React from "react";
import { TODAY_LOG_COLORS } from "./TodayLogUi";

function HolidayIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="36"
        cy="36"
        r="34"
        stroke="#FF2D78"
        strokeWidth="2"
        opacity="0.35"
      />
      <path
        d="M36 18C27.2 18 20 25.2 20 34C20 44 36 54 36 54C36 54 52 44 52 34C52 25.2 44.8 18 36 18Z"
        fill="#FF2D78"
        opacity="0.9"
      />
      <circle cx="36" cy="32" r="6" fill="#FFD700" />
      <path
        d="M24 48L20 56M48 48L52 56M18 30L10 28M54 30L62 28"
        stroke="#FFD700"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface HappyHolidayScreenProps {
  title: string;
  message: string;
  reason?: string;
}

export default function HappyHolidayScreen({
  title,
  message,
  reason,
}: HappyHolidayScreenProps) {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl px-6 py-10 text-center"
      style={{ backgroundColor: TODAY_LOG_COLORS.card }}
    >
      <HolidayIcon />
      <h4 className="mt-5 text-xl font-semibold text-[#FF2D78]">{title}</h4>
      <p className="mt-2 text-sm text-foreground/90">{message}</p>
      {reason ? (
        <p className="mt-3 max-w-xs text-xs text-muted-foreground">{reason}</p>
      ) : null}
    </div>
  );
}
