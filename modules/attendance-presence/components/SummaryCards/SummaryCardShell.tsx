"use client";

import React from "react";
import { useAttendanceDirection } from "../../utils/direction";

interface SummaryCardShellProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function SummaryCardShell({
  icon,
  title,
  children,
  footer,
  className = "",
}: SummaryCardShellProps) {
  const { isRtl } = useAttendanceDirection();

  return (
    <div
      className={`bg-sidebar rounded-2xl p-4 min-h-[148px] flex flex-col border border-border ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {isRtl ? (
          <>
            <span className="text-xs text-muted-foreground leading-snug text-start">
              {title}
            </span>
            <div className="shrink-0">{icon}</div>
          </>
        ) : (
          <>
            <div className="shrink-0">{icon}</div>
            <span className="text-xs text-muted-foreground leading-snug text-end">
              {title}
            </span>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">{children}</div>

      {footer ? <div className="mt-auto pt-3">{footer}</div> : null}
    </div>
  );
}
