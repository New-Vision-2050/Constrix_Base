"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus } from "lucide-react";
import { WEEK_DAYS } from "./timing-constants";
import type { DayPeriodRow } from "./timing-types";
import { shiftPeriodLabel } from "./timing-types";

type DailyTimingSettingsProps = {
  weeklyDays: string[];
  dayPeriodRows: Record<string, DayPeriodRow[]>;
  onToggleDay: (dayId: string) => void;
  onOpenPeriodsDialog: (dayId: string, intent: "add" | "edit") => void;
};

export default function DailyTimingSettings({
  weeklyDays,
  dayPeriodRows,
  onToggleDay,
  onOpenPeriodsDialog,
}: DailyTimingSettingsProps) {
  const selectedWeekDays = WEEK_DAYS.filter((day) =>
    weeklyDays.includes(day.id),
  );

  return (
    <div className="border border-border rounded-xl px-3 py-4 md:px-4 md:py-5">
      <p className="text-right text-lg font-semibold mb-3">فترات الدوام</p>

      <div className="border border-border rounded-lg px-3 py-4">
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
                <span>{day.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="border border-border rounded-lg p-2 md:p-3 space-y-3">
          <div className="flex flex-col gap-2">
            {selectedWeekDays.length === 0 ? (
              <p className="text-sm text-muted-foreground text-right">
                لا توجد ايام محددة
              </p>
            ) : (
              selectedWeekDays.map((day) => {
                const rows = dayPeriodRows[day.id] ?? [];
                const hasPeriod = rows.length > 0;

                return (
                  <div
                    key={day.id}
                    className="border border-border rounded-lg p-2.5 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-center gap-2 lg:w-1/5 shrink-0">
                      <Checkbox
                        checked
                        onCheckedChange={() => onToggleDay(day.id)}
                        className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-md">{day.label}</span>
                    </div>

                    {hasPeriod ? (
                      <div className="flex-1 space-y-2 min-w-0">
                        {rows.map((row, idx) => (
                          <div
                            key={idx}
                            className="border border-border rounded-md p-2"
                          >
                            <p className="text-xs text-muted-foreground text-right mb-2">
                              {shiftPeriodLabel(idx)}
                            </p>
                            <p className="text-sm text-right tabular-nums">
                              من {row.from} {row.fromMeridiem} — الى {row.to}{" "}
                              {row.toMeridiem}
                              {row.endsNextDay ? (
                                <span className="text-muted-foreground">
                                  {" "}
                                  — اليوم التالي
                                </span>
                              ) : null}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1">
                        <Button
                          variant="default"
                          className="w-full h-11 gap-4"
                          type="button"
                          onClick={() => onOpenPeriodsDialog(day.id, "add")}
                        >
                          <Plus className="h-4 w-4" />
                          اضافة الفترات
                        </Button>
                      </div>
                    )}

                    {hasPeriod ? (
                      <div className="">
                        <Button
                          variant="default"
                          type="button"
                          className="w-full lg:w-auto gap-2"
                          onClick={() => onOpenPeriodsDialog(day.id, "edit")}
                        >
                          <Pencil className="h-4 w-4" />
                          تعديل الفترات
                        </Button>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="default" type="button">
          Save changes
        </Button>
      </div>
    </div>
  );
}
