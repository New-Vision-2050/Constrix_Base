"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddPeriodsDialog from "./AddPeriodsDialog";
import DailyTimingSettings from "./DailyTimingSettings";
import WeeklyTimingSettings from "./WeeklyTimingSettings";
import type { DayPeriodRow } from "./timing-types";
import { DEFAULT_DAY_PERIOD_ROW } from "./timing-types";

const INITIAL_WEEKLY_ROWS: DayPeriodRow[] = [
  {
    ...DEFAULT_DAY_PERIOD_ROW,
    to: "06:00",
    toMeridiem: "PM",
  },
];

type PeriodsDialogState =
  | { mode: "daily"; dayId: string; intent: "add" | "edit" }
  | { mode: "weekly"; intent: "add" | "edit" };

export default function TimingSettingsSection() {
  const [weeklyDays, setWeeklyDays] = useState<string[]>(["sunday"]);
  const [weeklyPeriodRows, setWeeklyPeriodRows] =
    useState<DayPeriodRow[]>(INITIAL_WEEKLY_ROWS);
  const [dayPeriodRows, setDayPeriodRows] = useState<
    Record<string, DayPeriodRow[]>
  >({});
  const [periodsDialog, setPeriodsDialog] =
    useState<PeriodsDialogState | null>(null);

  const toggleWeeklyDay = (dayId: string) => {
    setWeeklyDays((previous) => {
      const isSelected = previous.includes(dayId);
      if (isSelected) {
        setDayPeriodRows((old) => {
          const updated = { ...old };
          delete updated[dayId];
          return updated;
        });
        return previous.filter((value) => value !== dayId);
      }

      return [...previous, dayId];
    });
  };

  const dialogInitialRows = useMemo((): DayPeriodRow[] => {
    if (!periodsDialog) return [];
    if (periodsDialog.mode === "daily") {
      return dayPeriodRows[periodsDialog.dayId] ?? [];
    }
    return weeklyPeriodRows;
  }, [periodsDialog, dayPeriodRows, weeklyPeriodRows]);

  const dialogTitle = useMemo(() => {
    if (!periodsDialog) return "اضافة الفترات";
    return periodsDialog.intent === "edit"
      ? "تعديل الفترات"
      : "اضافة الفترات";
  }, [periodsDialog]);

  const handleSavePeriods = (rows: DayPeriodRow[]) => {
    if (!periodsDialog) return;
    if (periodsDialog.mode === "daily") {
      setDayPeriodRows((previous) => ({
        ...previous,
        [periodsDialog.dayId]: rows,
      }));
    } else {
      setWeeklyPeriodRows(rows);
    }
    setPeriodsDialog(null);
  };

  return (
    <>
      <Tabs defaultValue="weekly" dir="rtl" className="gap-4">
        <div className="flex w-full justify-center">
          <TabsList className="h-auto p-1 bg-transparent border rounded-full border-border gap-2">
            <TabsTrigger
              value="daily"
              className="rounded-3xl px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              يومي
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="rounded-3xl px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              اسبوعي
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="pt-2">
          <DailyTimingSettings
            weeklyDays={weeklyDays}
            dayPeriodRows={dayPeriodRows}
            onToggleDay={toggleWeeklyDay}
            onOpenPeriodsDialog={(dayId, intent) =>
              setPeriodsDialog({ mode: "daily", dayId, intent })
            }
          />
        </TabsContent>
        <TabsContent value="weekly" className="pt-2">
          <WeeklyTimingSettings
            weeklyDays={weeklyDays}
            periodRows={weeklyPeriodRows}
            onToggleDay={toggleWeeklyDay}
            onOpenPeriodsDialog={(intent) =>
              setPeriodsDialog({ mode: "weekly", intent })
            }
          />
        </TabsContent>
      </Tabs>

      <AddPeriodsDialog
        key={
          periodsDialog
            ? `${periodsDialog.mode}-${
                periodsDialog.mode === "daily"
                  ? periodsDialog.dayId
                  : "weekly"
              }`
            : "closed"
        }
        open={periodsDialog !== null}
        onOpenChange={(open) => {
          if (!open) setPeriodsDialog(null);
        }}
        title={dialogTitle}
        initialRows={dialogInitialRows}
        onSave={handleSavePeriods}
      />
    </>
  );
}
