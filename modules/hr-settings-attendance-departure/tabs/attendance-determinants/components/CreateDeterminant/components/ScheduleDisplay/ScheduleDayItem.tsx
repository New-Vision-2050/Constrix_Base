import React from "react";
import { useTheme } from "next-themes";
import { CalendarDays, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { WeeklyScheduleDayConfig } from ".";

// Types
type PeriodType = {
  from: string;
  to: string;
  extends_to_next_day?: boolean;
  id?: string;
};

type DayPeriodProps = {
  dayConfig: WeeklyScheduleDayConfig
};

const dayNames = {
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
};

/**
 * Component for displaying a single day with its periods in the weekly schedule
 */
export const ScheduleDayItem: React.FC<DayPeriodProps> = ({
  dayConfig,
}) => {
  const { resolvedTheme } = useTheme();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog"
  );
  // Common styles
  const sectionClass = `rounded-lg p-4 mb-3 ${
    resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
  } shadow-sm`;
  const labelClass = `text-sm ${
    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
  } font-medium mb-1`;
  const periodClass = `flex items-center p-2 rounded-md ${
    resolvedTheme === "dark" ? "bg-gray-700" : "bg-white"
  } shadow-sm mb-2`;

  return (
    <div className={sectionClass}>
      {/* Day Header */}
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="h-5 w-5 text-blue-500" />
        <span className="font-medium text-base">{dayNames[dayConfig.day as keyof typeof dayNames]}</span>
      </div>

      {/* Periods List */}
      <div className="pl-2">
        <span className={labelClass}>{t("periods")}</span>
        <div className="mt-2 space-y-2">
          {dayConfig?.periods?.map((period, index) => (
            <div key={index} className={periodClass}>
              <Clock className="h-4 w-4 text-pink-500 mr-2" />
              <span>
                {period.from} - {period.to}
              </span>
              {period.extends_to_next_day && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-amber-500/30 text-amber-700 dark:text-amber-300">
                  {t("extendsToNextDay")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
