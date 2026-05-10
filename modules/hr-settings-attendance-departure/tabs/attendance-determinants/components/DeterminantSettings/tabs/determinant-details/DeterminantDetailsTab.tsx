"use client";

import { useMemo, type ReactNode } from "react";
import { Pencil, Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import { TextField } from "@mui/material";

const WEEK_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/** Half-hour grid 00:00 … 23:30 */
const HALF_HOUR_TIMES: string[] = (() => {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30] as const) {
      out.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }
  }
  return out;
})();

function sortTimeStrings(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return ah * 60 + am - (bh * 60 + bm);
}

function normalizeClock(raw: string): string {
  const t = raw?.trim() ?? "";
  if (!t) return "09:00";
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return "09:00";
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
  const min = Math.min(59, Math.max(0, parseInt(m[2], 10)));
  const rounded = min >= 30 ? 30 : 0;
  return `${String(h).padStart(2, "0")}:${rounded === 0 ? "00" : "30"}`;
}

function firstPeriodStart(constraint: Constraint): string {
  const ws = constraint.config?.time_rules?.weekly_schedule;
  if (!ws) return "09:00";
  for (const day of WEEK_DAYS) {
    const d = ws[day];
    if (d?.enabled && d.periods?.length) {
      const p0 = d.periods[0] as { start_time?: string; from?: string };
      const raw = p0?.start_time ?? p0?.from;
      if (raw) return normalizeClock(String(raw));
    }
  }
  return "09:00";
}

function branchDisplayText(constraint: Constraint): string {
  const fromBranches =
    constraint.branches?.map((b) => b.name).filter(Boolean) ?? [];
  if (fromBranches.length) return fromBranches.join("، ");
  const fromLocs =
    constraint.branch_locations?.map((b) => b.name).filter(Boolean) ?? [];
  if (fromLocs.length) return fromLocs.join("، ");
  return "—";
}

function timeOptionsWithDefault(fallback: string): string[] {
  const set = new Set(HALF_HOUR_TIMES);
  if (!set.has(fallback)) {
    return [...HALF_HOUR_TIMES, fallback].sort(sortTimeStrings);
  }
  return [...HALF_HOUR_TIMES];
}

function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-primary/90 px-5 pb-6 pt-5 shadow-sm backdrop-blur-[2px] sm:px-6 sm:pb-7 sm:pt-6">
      <div className="mb-6 flex items-center justify-between gap-3 sm:gap-4">
        <h2 className="min-w-0 flex-1 text-sm font-semibold leading-snug tracking-tight text-foreground">
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10"
            aria-label="تعديل"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10"
            aria-label="الإعدادات"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function DeterminantDetailsTab({
  constraint,
}: {
  constraint: Constraint;
}) {
  const displayName = useMemo(() => {
    const n =
      constraint.name?.trim() || constraint.constraint_name?.trim() || "";
    return n || "—";
  }, [constraint.constraint_name, constraint.name]);

  const systemLabel = useMemo(() => {
    const t = constraint.constraint_type?.trim();
    return t || "—";
  }, [constraint.constraint_type]);

  const branchText = useMemo(() => branchDisplayText(constraint), [constraint]);

  const defaultPeriodStart = useMemo(
    () => firstPeriodStart(constraint),
    [constraint],
  );

  const timeChoices = useMemo(
    () => timeOptionsWithDefault(defaultPeriodStart),
    [defaultPeriodStart],
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <DetailsSection title="بيانات المحدد">
        <div
          dir="rtl"
          className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 md:items-start"
        >
          <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2">
            <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
              اسم المحدد
            </label>
            <TextField
              hiddenLabel
              fullWidth
              label="اسم المحدد"
              variant="outlined"
              disabled
              value={displayName}
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 48,
                  alignItems: "center",
                },
                "& .MuiInputBase-input": {
                  textAlign: "right",
                },
              }}
            />
          </div>
          <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2">
            <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
              نظام المحدد
            </label>
            <Select value={systemLabel} disabled>
              <SelectTrigger
                dir="rtl"
                className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
              >
                <SelectValue placeholder={systemLabel} />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value={systemLabel}>{systemLabel}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 md:col-span-2">
            <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
              الفرع
            </label>
            <Select value={branchText} disabled>
              <SelectTrigger
                dir="rtl"
                className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
              >
                <SelectValue placeholder={branchText} />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value={branchText}>{branchText}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DetailsSection>

      <DetailsSection title="محدد الدول">
        <div
          dir="rtl"
          className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:items-start"
        >
          <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 sm:col-span-1">
            <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
              اسم الدولة
            </label>
            <Select value="sa" disabled>
              <SelectTrigger
                dir="rtl"
                className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="sa">المملكة العربية السعودية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 sm:col-span-1">
            <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
              التوقيت الزمني
            </label>
            <Select value={defaultPeriodStart} disabled>
              <SelectTrigger
                dir="rtl"
                className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
              >
                <SelectValue placeholder={defaultPeriodStart} />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {timeChoices.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DetailsSection>
    </div>
  );
}
