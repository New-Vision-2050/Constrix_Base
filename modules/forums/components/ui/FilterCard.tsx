"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/modules/table/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** The filters panel that sits above every table in the design. */
export default function FilterCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-sidebar p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </div>
  );
}

export function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function SearchFilter({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FilterField label={label}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3" />
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 ps-9"
        />
      </div>
    </FilterField>
  );
}

export type SelectFilterOption = { value: string; label: string };

export function SelectFilter({
  label,
  value,
  onChange,
  options,
  allLabel,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectFilterOption[];
  /** Label of the "no filter" entry; omit to hide it. */
  allLabel?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const ALL = "__all__";

  return (
    <FilterField label={label}>
      <Select
        value={value === "" ? ALL : value}
        onValueChange={(next) => onChange(next === ALL ? "" : next)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? allLabel} />
        </SelectTrigger>
        <SelectContent>
          {allLabel ? <SelectItem value={ALL}>{allLabel}</SelectItem> : null}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterField>
  );
}
