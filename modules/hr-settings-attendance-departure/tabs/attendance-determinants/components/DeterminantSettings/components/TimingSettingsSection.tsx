"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyTimingSettings from "./DailyTimingSettings";
import WeeklyTimingSettings from "./WeeklyTimingSettings";
import type { DayPeriod } from "./timing-types";
import { DEFAULT_DAY_PERIOD } from "./timing-types";

export default function TimingSettingsSection() {
  const [weeklyDays, setWeeklyDays] = useState<string[]>(["sunday", "monday"]);
  const [periodFrom, setPeriodFrom] = useState("09:00");
  const [periodFromMeridiem, setPeriodFromMeridiem] = useState<"AM" | "PM">(
    "AM",
  );
  const [periodTo, setPeriodTo] = useState("02:00");
  const [periodToMeridiem, setPeriodToMeridiem] = useState<"AM" | "PM">("PM");
  const [dayPeriods, setDayPeriods] = useState<Record<string, DayPeriod>>({});

  const toggleWeeklyDay = (dayId: string) => {
    setWeeklyDays((previous) => {
      const isSelected = previous.includes(dayId);
      if (isSelected) {
        setDayPeriods((old) => {
          const updated = { ...old };
          delete updated[dayId];
          return updated;
        });
        return previous.filter((value) => value !== dayId);
      }

      return [...previous, dayId];
    });
  };

  const addDayPeriod = (dayId: string) => {
    setDayPeriods((previous) => {
      if (previous[dayId]) {
        return previous;
      }
      return {
        ...previous,
        [dayId]: { ...DEFAULT_DAY_PERIOD },
      };
    });
  };

  const updateDayPeriod = <K extends keyof DayPeriod>(
    dayId: string,
    key: K,
    value: DayPeriod[K],
  ) => {
    setDayPeriods((previous) => ({
      ...previous,
      [dayId]: {
        ...(previous[dayId] ?? { ...DEFAULT_DAY_PERIOD }),
        [key]: value,
      },
    }));
  };

  return (
    <Tabs defaultValue="weekly" dir="rtl" className="gap-4">
      <TabsList className="h-auto p-1 bg-transparent border border-border rounded-xl mx-auto justify-center gap-2">
        <TabsTrigger
          value="daily"
          className="rounded-lg px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
        >
          يومي
        </TabsTrigger>
        <TabsTrigger
          value="weekly"
          className="rounded-lg px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
        >
          اسبوعي
        </TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="pt-2">
        <DailyTimingSettings
          weeklyDays={weeklyDays}
          dayPeriods={dayPeriods}
          onToggleDay={toggleWeeklyDay}
          onAddDayPeriod={addDayPeriod}
          onUpdateDayPeriod={updateDayPeriod}
        />
      </TabsContent>
      <TabsContent value="weekly" className="pt-2">
        <WeeklyTimingSettings
          weeklyDays={weeklyDays}
          periodFrom={periodFrom}
          periodFromMeridiem={periodFromMeridiem}
          periodTo={periodTo}
          periodToMeridiem={periodToMeridiem}
          onToggleDay={toggleWeeklyDay}
          onPeriodFromChange={setPeriodFrom}
          onPeriodFromMeridiemChange={setPeriodFromMeridiem}
          onPeriodToChange={setPeriodTo}
          onPeriodToMeridiemChange={setPeriodToMeridiem}
        />
      </TabsContent>
    </Tabs>
  );
}
