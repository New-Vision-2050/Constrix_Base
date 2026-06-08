"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceConstraints } from "@/services/api/attendance-constraints";
import type {
  AssignConstraintShiftsBody,
  AssignConstraintShiftsWeeklyBody,
} from "@/services/api/attendance-constraints/types/params";
import AttendanceDaysDialog from "../../../CreateDeterminant/AttendanceDaysDialog";
import type { AttendanceDayEditedDay } from "../../../CreateDeterminant/AttendanceDaysDialog/context/AttendanceDayCxt";
import DailyTimingSettings from "./daily";
import WeeklyTimingSettings from "./weekly";
import type { DayPeriodRow } from "./timing-types";
import {
  buildWeeklyScheduleForDialog,
  dayPeriodRowsToEditedDay,
  editedDayToDayPeriodRows,
} from "./shift-attendance-dialog-bridge";
import {
  buildDailyShiftsRequestBody,
  buildWeeklyShiftsRequestBody,
  cloneDefaultWeeklyPeriodRows,
  hydratedShiftStateFromApiEnvelope,
  unwrapShiftsApiError,
} from "./shift-payload";

type PeriodsDialogState =
  | { mode: "daily"; dayId: string; intent: "add" | "edit" }
  | { mode: "weekly"; intent: "add" | "edit" };

export default function TimingSettingsSection({
  constraintId,
}: {
  constraintId: string;
}) {
  const tShifts = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.shifts",
  );

  const [weeklyDays, setWeeklyDays] = useState<string[]>(["sunday"]);
  const [weeklyPeriodRows, setWeeklyPeriodRows] = useState<DayPeriodRow[]>(
    () => cloneDefaultWeeklyPeriodRows(),
  );
  const [dayPeriodRows, setDayPeriodRows] = useState<
    Record<string, DayPeriodRow[]>
  >({});
  const [periodsDialog, setPeriodsDialog] =
    useState<PeriodsDialogState | null>(null);
  const [weeklyAssignError, setWeeklyAssignError] = useState<string | null>(
    null,
  );
  const [dailyAssignError, setDailyAssignError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const shiftsQuery = useQuery({
    queryKey: ["constraint-shifts", constraintId],
    queryFn: async () =>
      (
        await AttendanceConstraints.getShifts(constraintId)
      ).data as unknown,
    enabled: Boolean(constraintId),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (
      shiftsQuery.status !== "success" ||
      shiftsQuery.fetchStatus === "fetching"
    ) {
      return;
    }
    const next = hydratedShiftStateFromApiEnvelope(shiftsQuery.data);
    if (!next) return;
    setWeeklyDays(next.weeklyDays.length > 0 ? next.weeklyDays : ["sunday"]);
    setWeeklyPeriodRows(
      next.weeklyPeriodRows.length > 0
        ? next.weeklyPeriodRows
        : cloneDefaultWeeklyPeriodRows(),
    );
    setDayPeriodRows(next.dayPeriodRows ?? {});
  }, [
    shiftsQuery.data,
    shiftsQuery.dataUpdatedAt,
    shiftsQuery.status,
    shiftsQuery.fetchStatus,
    constraintId,
  ]);

  const assignShiftsMutation = useMutation({
    mutationFn: (body: AssignConstraintShiftsBody) =>
      AttendanceConstraints.assignShifts(constraintId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["constraint-shifts", constraintId],
      });
    },
  });

  const handleAssignWeeklyShifts = useCallback(async () => {
    setWeeklyAssignError(null);
    if (!weeklyDays.length) {
      const msg = tShifts("validationSelectAtLeastOneDay");
      setWeeklyAssignError(msg);
      toast.error(msg);
      return;
    }
    if (!weeklyPeriodRows.length) {
      const msg = tShifts("validationWeeklyAddPeriods");
      setWeeklyAssignError(msg);
      toast.error(msg);
      return;
    }
    let body: AssignConstraintShiftsWeeklyBody;
    try {
      body = buildWeeklyShiftsRequestBody(weeklyDays, weeklyPeriodRows);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : tShifts("validationInvalidTimes");
      setWeeklyAssignError(msg);
      toast.error(msg);
      return;
    }
    if (!body.days.length) {
      const msg = tShifts("validationWeeklyValidDays");
      setWeeklyAssignError(msg);
      toast.error(msg);
      return;
    }
    try {
      await assignShiftsMutation.mutateAsync(body);
      toast.success(tShifts("toastWeeklySaved"));
    } catch (err) {
      const msg = unwrapShiftsApiError(
        err,
        tShifts("toastWeeklyFailed"),
      ).message;
      setWeeklyAssignError(msg);
      toast.error(msg);
    }
  }, [weeklyDays, weeklyPeriodRows, assignShiftsMutation, tShifts]);

  const handleAssignDailyShifts = useCallback(async () => {
    setDailyAssignError(null);
    if (!weeklyDays.length) {
      const msg = tShifts("validationSelectAtLeastOneDay");
      setDailyAssignError(msg);
      toast.error(msg);
      return;
    }
    let body: AssignConstraintShiftsBody;
    try {
      body = buildDailyShiftsRequestBody(weeklyDays, dayPeriodRows);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : tShifts("validationInvalidTimes");
      setDailyAssignError(msg);
      toast.error(msg);
      return;
    }
    if (body.mode !== "daily" || Object.keys(body.schedule).length === 0) {
      const msg = tShifts("validationDailyAllDaysNeedPeriods");
      setDailyAssignError(msg);
      toast.error(msg);
      return;
    }
    try {
      await assignShiftsMutation.mutateAsync(body);
      toast.success(tShifts("toastDailySaved"));
    } catch (err) {
      const msg = unwrapShiftsApiError(err, tShifts("toastDailyFailed")).message;
      setDailyAssignError(msg);
      toast.error(msg);
    }
  }, [weeklyDays, dayPeriodRows, assignShiftsMutation, tShifts]);

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

  const attendanceDialogConfig = useMemo(() => {
    if (!periodsDialog) return null;

    const weeklySchedule = buildWeeklyScheduleForDialog(
      weeklyDays,
      weeklyPeriodRows,
      dayPeriodRows,
    );

    if (periodsDialog.mode === "daily") {
      const dayId = periodsDialog.dayId;
      const rows = dayPeriodRows[dayId] ?? [];
      const isEdit = periodsDialog.intent === "edit" && rows.length > 0;

      return {
        editedDay: isEdit ? dayPeriodRowsToEditedDay(dayId, rows) : null,
        initialSelectedDay: dayId,
        weeklySchedule,
        lockDaySelector: true,
        showPeriodToleranceSettings: false,
      };
    }

    const anchorDay = weeklyDays[0] ?? "sunday";
    const isEdit =
      periodsDialog.intent === "edit" && weeklyPeriodRows.length > 0;

    return {
      editedDay: isEdit
        ? dayPeriodRowsToEditedDay(anchorDay, weeklyPeriodRows)
        : null,
      initialSelectedDay: anchorDay,
      weeklySchedule,
      lockDaySelector: true,
      showPeriodToleranceSettings: false,
    };
  }, [
    periodsDialog,
    weeklyDays,
    weeklyPeriodRows,
    dayPeriodRows,
  ]);

  const handleSavePeriods = (dayConfig: AttendanceDayEditedDay) => {
    if (!periodsDialog) return;
    const rows = editedDayToDayPeriodRows(dayConfig);
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
        <div className="flex items-center justify-center mb-4">
        <TabsList className="h-auto rounded-full p-1 bg-transparent border border-border rounded-xl mx-auto justify-center gap-2">
          <TabsTrigger
            value="daily"
            className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
          >
            {tShifts("modeDaily")}
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
          >
            {tShifts("modeWeekly")}
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
            onAssignDailyShifts={() => void handleAssignDailyShifts()}
            assignDailyShiftsPending={
              assignShiftsMutation.isPending || shiftsQuery.isFetching
            }
            assignDailyShiftsError={dailyAssignError}
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
            onAssignWeeklyShifts={() => void handleAssignWeeklyShifts()}
            assignWeeklyShiftsPending={
              assignShiftsMutation.isPending || shiftsQuery.isFetching
            }
            assignWeeklyShiftsError={weeklyAssignError}
          />
        </TabsContent>
      </Tabs>

      {periodsDialog && attendanceDialogConfig ? (
        <AttendanceDaysDialog
          key={`${periodsDialog.mode}-${
            periodsDialog.mode === "daily" ? periodsDialog.dayId : "weekly"
          }-${periodsDialog.intent}`}
          isOpen
          onClose={() => setPeriodsDialog(null)}
          standaloneConfig={{
            ...attendanceDialogConfig,
            onSave: handleSavePeriods,
          }}
        />
      ) : null}
    </>
  );
}
