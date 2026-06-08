"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAttendanceDayCxt } from "../../../../CreateDeterminant/AttendanceDaysDialog/context/AttendanceDayCxt";
import EmptyState from "../../../../CreateDeterminant/AttendanceDaysDialog/dialog/period/EmptyState";
import ShiftPeriodItem from "./ShiftPeriodItem";

export default function ShiftDayPeriods() {
  const { dayPeriods, handleAddDayPeriod, selectedDay } = useAttendanceDayCxt();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog",
  );

  const hasExtendedPeriod = dayPeriods.some(
    (period) => period.extends_to_next_day,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="my-1 flex items-center justify-between">
        <p className="text-lg font-semibold">{t("Dayworkhours")}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  type="button"
                  onClick={handleAddDayPeriod}
                  disabled={!selectedDay || hasExtendedPeriod}
                  className={
                    !selectedDay || hasExtendedPeriod
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }
                >
                  {t("addPeriod")}
                </Button>
              </div>
            </TooltipTrigger>
            {(!selectedDay || hasExtendedPeriod) && (
              <TooltipContent>
                <p>
                  {!selectedDay ? t("selectDayFirst") : t("cannotAddPeriod")}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {dayPeriods.length > 0 ? (
        dayPeriods.map((period) => (
          <ShiftPeriodItem
            key={`${period.index}-${period.start_time}-${period.end_time}`}
            period={period}
          />
        ))
      ) : (
        <EmptyState icon={<Clock className="h-10 w-10 text-amber-500" />} />
      )}
    </div>
  );
}
