import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";
import AttendanceDayPeriodItem from "./period";
import EmptyState from "./period/EmptyState";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";

export default function AttendanceDayPeriods() {
  const { dayPeriods, handleAddDayPeriod, selectedDay } = useAttendanceDayCxt();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog",
  );

  // Check if any period extends to next day
  const hasExtendedPeriod = dayPeriods.some(
    (period) => period.extends_to_next_day,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center my-1">
        <p className="text-lg font-semibold">فترات عمل اليوم</p>
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={handleAddDayPeriod}
                    disabled={!selectedDay || hasExtendedPeriod}
                    className={
                      !selectedDay || hasExtendedPeriod
                        ? "opacity-50 cursor-not-allowed"
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
                    {!selectedDay
                      ? t("selectDayFirst") || "يجب اختيار اليوم أولا"
                      : "لا يمكن إضافة فترة جديدة عند وجود فترة ممتدة لليوم التالي"}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {dayPeriods.length > 0 ? (
        dayPeriods.map((period) => (
          <AttendanceDayPeriodItem
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
