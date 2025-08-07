import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";
import AttendanceDayPeriodItem from "./period";
import EmptyState from "./period/EmptyState";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";

export default function AttendanceDayPeriods() {
  const { dayPeriods, handleAddDayPeriod, selectedDay } = useAttendanceDayCxt();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog"
  );
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center my-1">
        <p className="text-lg font-semibold">فترات عمل اليوم</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  onClick={handleAddDayPeriod} 
                  disabled={!selectedDay} 
                  className={!selectedDay ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {t("addPeriod")}
                </Button>
              </div>
            </TooltipTrigger>
            {!selectedDay && (
              <TooltipContent>
                <p>{t("selectDayFirst") || "يجب اختيار اليوم أولا"}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {dayPeriods.length > 0 ? (
        dayPeriods.map((period, index) => (
          <AttendanceDayPeriodItem key={index} period={period} />
        ))
      ) : (
        <EmptyState 
          icon={<Clock className="h-10 w-10 text-amber-500" />} 
        />
      )}
    </div>
  );
}
