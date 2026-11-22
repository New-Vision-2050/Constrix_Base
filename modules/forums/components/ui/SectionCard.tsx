"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Titled panel used across the forum settings, admins and members screens. */
export default function SectionCard({
  title,
  hint,
  action,
  children,
  className,
}: {
  title?: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-sidebar p-5",
        className,
      )}
    >
      {title || action ? (
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            {title ? (
              <h3 className="text-base font-semibold text-foreground">
                {title}
              </h3>
            ) : null}
            {hint ? (
              <p className="text-xs text-muted-foreground">{hint}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}
