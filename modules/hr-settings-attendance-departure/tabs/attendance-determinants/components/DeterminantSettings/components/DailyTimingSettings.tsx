"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import { WEEK_DAYS } from "../constants";
import type { DayPeriod } from "./timing-types";
import { DEFAULT_DAY_PERIOD } from "./timing-types";
import TimeSplitInput from "./TimeSplitInput";

type DailyTimingSettingsProps = {
  weeklyDays: string[];
  dayPeriods: Record<string, DayPeriod>;
  onToggleDay: (dayId: string) => void;
  onAddDayPeriod: (dayId: string) => void;
  onUpdateDayPeriod: <K extends keyof DayPeriod>(
    dayId: string,
    key: K,
    value: DayPeriod[K],
  ) => void;
};

export default function DailyTimingSettings({
  weeklyDays,
  dayPeriods,
  onToggleDay,
  onAddDayPeriod,
  onUpdateDayPeriod,
}: DailyTimingSettingsProps) {
  const selectedWeekDays = WEEK_DAYS.filter((day) =>
    weeklyDays.includes(day.id),
  );

  return (
    <div className="border border-border rounded-xl px-4 py-6">
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

      <div className="mt-6">
        <div className="border border-border rounded-lg p-3 space-y-4">
          <p className="text-xs text-muted-foreground text-right">
            الايام المحددة
          </p>
          <div className="flex flex-col gap-4">
            {selectedWeekDays.length === 0 ? (
              <p className="text-sm text-muted-foreground text-right">
                لا توجد ايام محددة
              </p>
            ) : (
              selectedWeekDays.map((day) => {
                const dayPeriod = dayPeriods[day.id];
                const hasPeriod = Boolean(dayPeriod);

                return (
                  <div
                    key={day.id}
                    className="border border-border rounded-lg p-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-center gap-2 lg:min-w-[96px] lg:justify-end">
                    <Checkbox
                      checked
                      onCheckedChange={() => onToggleDay(day.id)}
                      className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm">{day.label}</span>
                    </div>

                    {hasPeriod ? (
                      <div className="flex-1 max-w-[340px] lg:max-w-[340px] border border-border rounded-md p-2">
                        <p className="text-xs text-muted-foreground text-right mb-2">
                          الفترة الاولى
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <TimeSplitInput
                            label="من"
                            timeValue={dayPeriod?.from ?? DEFAULT_DAY_PERIOD.from}
                            meridiem={
                              dayPeriod?.fromMeridiem ?? DEFAULT_DAY_PERIOD.fromMeridiem
                            }
                            placeholder="09:00"
                            onTimeChange={(value) =>
                              onUpdateDayPeriod(day.id, "from", value)
                            }
                            onMeridiemChange={(value) =>
                              onUpdateDayPeriod(day.id, "fromMeridiem", value)
                            }
                          />
                          <TimeSplitInput
                            label="الى"
                            timeValue={dayPeriod?.to ?? DEFAULT_DAY_PERIOD.to}
                            meridiem={
                              dayPeriod?.toMeridiem ?? DEFAULT_DAY_PERIOD.toMeridiem
                            }
                            placeholder="02:00"
                            onTimeChange={(value) =>
                              onUpdateDayPeriod(day.id, "to", value)
                            }
                            onMeridiemChange={(value) =>
                              onUpdateDayPeriod(day.id, "toMeridiem", value)
                            }
                          />
                        </div>
                      </div>
                    ) : null}

                    <div className="">
                      <Button
                        variant="default"
                        className="w-full lg:w-auto gap-2"
                        onClick={() => {
                          if (!hasPeriod) {
                            onAddDayPeriod(day.id);
                          }
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        {hasPeriod ? "edit periods" : "add a period"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="default">Save changes</Button>
      </div>
    </div>
  );
}
