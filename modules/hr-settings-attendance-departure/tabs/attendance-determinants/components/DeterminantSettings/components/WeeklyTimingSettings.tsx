"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WEEK_DAYS } from "../constants";
import TimeSplitInput from "./TimeSplitInput";

type WeeklyTimingSettingsProps = {
  weeklyDays: string[];
  periodFrom: string;
  periodFromMeridiem: "AM" | "PM";
  periodTo: string;
  periodToMeridiem: "AM" | "PM";
  onToggleDay: (dayId: string) => void;
  onPeriodFromChange: (value: string) => void;
  onPeriodFromMeridiemChange: (value: "AM" | "PM") => void;
  onPeriodToChange: (value: string) => void;
  onPeriodToMeridiemChange: (value: "AM" | "PM") => void;
};

export default function WeeklyTimingSettings({
  weeklyDays,
  periodFrom,
  periodFromMeridiem,
  periodTo,
  periodToMeridiem,
  onToggleDay,
  onPeriodFromChange,
  onPeriodFromMeridiemChange,
  onPeriodToChange,
  onPeriodToMeridiemChange,
}: WeeklyTimingSettingsProps) {
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
        <div className="w-full max-w-sm border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-3 text-right">
            الفترة الاولى
          </p>
          <div className="grid grid-cols-2 gap-2">
            <TimeSplitInput
              label="من"
              timeValue={periodFrom}
              meridiem={periodFromMeridiem}
              placeholder="09:00"
              onTimeChange={onPeriodFromChange}
              onMeridiemChange={onPeriodFromMeridiemChange}
            />
            <TimeSplitInput
              label="الى"
              timeValue={periodTo}
              meridiem={periodToMeridiem}
              placeholder="02:00"
              onTimeChange={onPeriodToChange}
              onMeridiemChange={onPeriodToMeridiemChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="default">Save changes</Button>
      </div>
    </div>
  );
}
