"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type MultiSelectOption = { id: string; name: string };

/** Checkbox dropdown used for the managements and projects scope pickers. */
export default function MultiSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  loading,
}: {
  label?: string;
  placeholder: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const t = useTranslations("Forums.common");
  const selected = new Set(value);
  const selectedNames = options
    .filter((option) => selected.has(option.id))
    .map((option) => option.name);

  const toggle = (id: string) => {
    onChange(
      selected.has(id) ? value.filter((item) => item !== id) : [...value, id],
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <Label className="text-xs text-muted-foreground">{label}</Label>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled || loading}
            className="h-9 w-full justify-between font-normal"
          >
            <span
              className={cn(
                "truncate",
                selectedNames.length === 0 && "text-muted-foreground",
              )}
            >
              {selectedNames.length > 0
                ? selectedNames.join("، ")
                : placeholder}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
        >
          {options.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              {t("noResults")}
            </p>
          ) : (
            options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={selected.has(option.id)}
                onCheckedChange={() => toggle(option.id)}
                onSelect={(event) => event.preventDefault()}
              >
                {option.name}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
