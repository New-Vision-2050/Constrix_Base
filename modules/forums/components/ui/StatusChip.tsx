"use client";

import { cn } from "@/lib/utils";

export type ChipTone = "success" | "draft" | "muted" | "danger" | "info";

const TONES: Record<ChipTone, string> = {
  success: "text-emerald-400",
  draft: "text-amber-400",
  muted: "text-muted-foreground",
  danger: "text-rose-400",
  info: "text-sky-400",
};

/** Plain coloured label used in every status column of the design. */
export default function StatusChip({
  label,
  tone = "muted",
  className,
}: {
  label: string;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span className={cn("text-sm font-medium", TONES[tone], className)}>
      {label}
    </span>
  );
}

/** Pill variant used next to the forum title in the forum header. */
export function StatusPill({
  label,
  tone = "muted",
}: {
  label: string;
  tone?: ChipTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-sidebar px-3 py-1.5 text-xs font-medium",
        TONES[tone],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
