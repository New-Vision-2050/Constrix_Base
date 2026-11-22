"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { EmployeeOption } from "../types";

/**
 * Search + checklist used by the wizard admin/member steps, the admins screen
 * and the "add employees" card. Selection lives in the caller.
 */
export default function EmployeePicker({
  search,
  onSearchChange,
  searchLabel,
  searchPlaceholder,
  filters,
  employees,
  loading,
  selectedIds,
  onToggle,
  badgeLabel,
  countLabel,
  onClearSelection,
  clearLabel,
  footer,
  emptyLabel,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  filters?: ReactNode;
  employees: EmployeeOption[];
  loading?: boolean;
  selectedIds: string[];
  onToggle: (employee: EmployeeOption) => void;
  /** Badge shown on a selected row — «أدمن» or «عضو». */
  badgeLabel: string;
  countLabel?: string;
  onClearSelection?: () => void;
  clearLabel?: string;
  footer?: ReactNode;
  emptyLabel?: string;
}) {
  const t = useTranslations("Forums.common");
  const selected = new Set(selectedIds);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          {searchLabel ?? t("searchEmployee")}
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder ?? t("searchEmployeePlaceholder")}
            className="ps-9"
          />
        </div>
      </div>

      {filters}

      {countLabel ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">
            {countLabel}
          </span>
          {onClearSelection && selectedIds.length > 0 ? (
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              {clearLabel ?? t("remove")}
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="flex max-h-[320px] flex-col gap-2 overflow-y-auto pe-1">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-lg" />
            ))
          : employees.map((employee) => {
              const isSelected = selected.has(employee.id);
              return (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => onToggle(employee)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border p-3 text-start transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/40 hover:border-primary/40",
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">
                      {employee.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {[employee.employee_number, employee.branch_name]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2 py-1 text-xs text-primary">
                        <span className="size-1.5 rounded-full bg-primary" />
                        {badgeLabel}
                      </span>
                    ) : null}
                    <Checkbox checked={isSelected} tabIndex={-1} />
                  </div>
                </button>
              );
            })}

        {!loading && employees.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {emptyLabel ?? t("noResults")}
          </p>
        ) : null}
      </div>

      {footer}
    </div>
  );
}
