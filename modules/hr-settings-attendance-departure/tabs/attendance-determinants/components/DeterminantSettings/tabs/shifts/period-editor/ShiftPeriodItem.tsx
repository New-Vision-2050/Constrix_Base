"use client";

import { useTheme } from "next-themes";
import { Clock, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../../../../CreateDeterminant/AttendanceDaysDialog/context/AttendanceDayCxt";
import PeriodTimeSection from "../../../../CreateDeterminant/AttendanceDaysDialog/dialog/period/PeriodTimeSection";
import PeriodValidationsMsgs from "../../../../CreateDeterminant/AttendanceDaysDialog/dialog/period/PeriodValidationsMsgs";

type ShiftPeriodItemProps = {
  period: AttendanceDayPeriodType;
};

export default function ShiftPeriodItem({ period }: ShiftPeriodItemProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog",
  );
  const { handleRemoveDayPeriod } = useAttendanceDayCxt();

  const sectionClass = `rounded-lg p-4 ${
    resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
  } shadow-sm`;
  const labelClass = `text-sm ${
    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
  } font-medium mb-1`;

  return (
    <div className={sectionClass}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-pink-500" />
            <span className={labelClass}>
              {t("timePeriodLabel")} #{period.index}
            </span>
          </div>
          <Trash2
            className="h-5 w-5 cursor-pointer text-red-500"
            onClick={() => handleRemoveDayPeriod(period.index)}
          />
        </div>

        <PeriodTimeSection t={t} period={period} labelClass={labelClass} />
        <PeriodValidationsMsgs t={t} period={period} />
      </div>
    </div>
  );
}
