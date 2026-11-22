"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { formatNumber } from "../../utils/format";

type StatCardProps = {
  label: string;
  value: number | string;
  hint?: string;
  icon: ReactNode;
  /** Tint of the icon square; defaults to the primary pink of the design. */
  tone?: "primary" | "success" | "warning" | "neutral";
};

const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/15 text-primary",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  neutral: "bg-muted-foreground/15 text-muted-foreground",
};

export default function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
}: StatCardProps) {
  const locale = useLocale();
  const display = typeof value === "number" ? formatNumber(value, locale) : value;

  return (
    <div className="flex min-w-[220px] flex-1 flex-col gap-2 rounded-xl border border-border bg-sidebar p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center justify-between gap-3">
        <span className="text-2xl font-semibold text-foreground">{display}</span>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg [&_svg]:size-5",
            TONES[tone],
          )}
        >
          {icon}
        </span>
      </div>
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}
