"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DurationUnitOption = {
  id: string;
  name: string;
};

type DurationUnitFieldProps = {
  label: string;
  value: string;
  unit: string;
  unitOptions: DurationUnitOption[];
  placeholder?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  className?: string;
};

export default function DurationUnitField({
  label,
  value,
  unit,
  unitOptions,
  placeholder = "30",
  disabled = false,
  onValueChange,
  onUnitChange,
  className,
}: DurationUnitFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} dir="rtl">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div
        className={cn(
          "flex h-11 overflow-hidden rounded-md border border-border bg-background transition-colors",
          "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30",
          disabled && "opacity-60",
        )}
      >
        <div className="relative flex h-full w-[7.5rem] shrink-0 items-center bg-primary text-primary-foreground">
          <select
            value={unit}
            disabled={disabled}
            onChange={(e) => onUnitChange(e.target.value)}
            className="h-full w-full cursor-pointer appearance-none border-0 bg-transparent px-3 pe-8 text-sm font-medium text-primary-foreground outline-none disabled:cursor-not-allowed"
          >
            {unitOptions.map((option) => (
              <option key={option.id} value={option.id} className="text-foreground">
                {option.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute end-2 h-4 w-4 text-primary-foreground"
            aria-hidden
          />
        </div>
        <input
          type="number"
          min={0}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onValueChange(e.target.value)}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-end text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
