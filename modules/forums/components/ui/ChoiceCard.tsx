"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Selectable card with a trailing radio dot: used for the visibility scope and
 * for the "who can send" options.
 */
export default function ChoiceCard({
  title,
  hint,
  selected,
  onSelect,
  children,
  disabled,
}: {
  title: string;
  hint?: string;
  selected: boolean;
  onSelect: () => void;
  /** Extra content rendered inside the card while it is selected. */
  children?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onSelect()}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors",
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-background/40 hover:border-primary/40",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">{title}</span>
          {hint ? (
            <span className="text-xs text-muted-foreground">{hint}</span>
          ) : null}
        </div>
        <span
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-primary" : "border-muted-foreground",
          )}
        >
          {selected ? (
            <span className="size-2 rounded-full bg-primary" />
          ) : null}
        </span>
      </div>
      {selected ? children : null}
    </div>
  );
}
