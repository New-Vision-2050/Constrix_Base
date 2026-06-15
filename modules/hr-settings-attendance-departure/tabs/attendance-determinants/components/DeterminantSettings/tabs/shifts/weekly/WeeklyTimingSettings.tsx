"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { WEEK_DAYS } from "../timing-constants";
import type { DayPeriodRow } from "../timing-types";

type WeeklyTimingSettingsProps = {
  weeklyDays: string[];
  periodRows: DayPeriodRow[];
  onToggleDay: (dayId: string) => void;
  onOpenPeriodsDialog: (intent: "add" | "edit") => void;
  onAssignWeeklyShifts: () => void;
  assignWeeklyShiftsPending: boolean;
  assignWeeklyShiftsError?: string | null;
};

const PERIOD_KEYS = [
  "periodFirst",
  "periodSecond",
  "periodThird",
  "periodFourth",
  "periodFifth",
  "periodSixth",
  "periodSeventh",
  "periodEighth",
] as const;

export default function WeeklyTimingSettings({
  weeklyDays,
  periodRows,
  onToggleDay,
  onOpenPeriodsDialog,
  onAssignWeeklyShifts,
  assignWeeklyShiftsPending,
  assignWeeklyShiftsError,
}: WeeklyTimingSettingsProps) {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.workPeriods",
  );

  const hasPeriods = periodRows.length > 0;

  return (
    <div className="border border-border rounded-xl px-3 py-4 md:px-4 md:py-5">
      <p className="text-right text-lg font-semibold mb-3">{t("shiftsTitle")}</p>

      <div className="border border-border rounded-lg px-3 py-4 space-y-4">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {WEEK_DAYS.map((day) => {
            const isChecked = weeklyDays.includes(day.id);
            return (
              <label
                key={day.id}
                className="inline-flex items-center gap-2 cursor-pointer select-none text-sm"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => onToggleDay(day.id)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span>{t(day.id)}</span>
              </label>
            );
          })}
        </div>

        {!hasPeriods ? (
          <Button
            type="button"
            variant="default"
            className="w-full h-11 gap-4"
            onClick={() => onOpenPeriodsDialog("add")}
          >
            <Plus className="h-4 w-4" />
            {t("addPeriods")}
          </Button>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row bg-background p-2 rounded-lg lg:items-stretch lg:justify-between lg:gap-6">
            <div className="flex-1 min-w-0 space-y-2">
              {periodRows.map((row, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-3"
                >
                  <p className="text-xs text-muted-foreground mb-2 text-right">
                    {PERIOD_KEYS[idx] ? t(PERIOD_KEYS[idx]) : String(idx + 1)}
                  </p>
                  <p className="text-sm text-right tabular-nums">
                    {t("from")} {row.from} {row.fromMeridiem} — {t("to")} {row.to}{" "}
                    {row.toMeridiem}
                    {row.endsNextDay ? (
                      <span className="text-muted-foreground">
                        {" "}
                        — {t("nextDay")}
                      </span>
                    ) : null}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex lg:items-center shrink-0">
              <Button
                variant="default"
                type="button"
                className="gap-2 w-full lg:w-auto"
                onClick={() => onOpenPeriodsDialog("edit")}
              >
                <Pencil className="h-4 w-4" />
                {t("editPeriods")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
        {assignWeeklyShiftsError ? (
          <p className="text-right text-sm text-destructive" role="alert">
            {assignWeeklyShiftsError}
          </p>
        ) : null}
        <Button
          type="button"
          variant="default"
          className="w-full h-11"
          disabled={
            assignWeeklyShiftsPending ||
            weeklyDays.length === 0 ||
            !hasPeriods
          }
          onClick={onAssignWeeklyShifts}
        >
          {assignWeeklyShiftsPending ? t("assigning") : t("assignWeekly")}
        </Button>
      </div>
    </div>
  );
}
