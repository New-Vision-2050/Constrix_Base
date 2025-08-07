import React from "react";
import { useTheme } from "next-themes";
import { Clock, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

// Context
import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../../context/AttendanceDayCxt";
import PeriodTimeSection from "./PeriodTimeSection";
import PeriodValidationsMsgs from "./PeriodValidationsMsgs";

type PeriodEditProps = {
  period: AttendanceDayPeriodType;
};

export default function AttendanceDayPeriodItem({ period }: PeriodEditProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog"
  );
  const { handleRemoveDayPeriod } = useAttendanceDayCxt();
  // Common styles
  const sectionClass = `rounded-lg p-4 ${
    resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
  } shadow-sm`;
  const labelClass = `text-sm ${
    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
  } font-medium mb-1`;

  return (
    <div className={sectionClass}>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-pink-500" />
            <span className={labelClass}>{t("timePeriodLabel") + " #" + period.index}</span>
          </div>
          <Trash2
            className="h-5 w-5 text-red-500 cursor-pointer"
            onClick={() => {
              handleRemoveDayPeriod(period.index);
            }}
          />
        </div>

        {/* Time inputs with MUI TimePicker */}
        <PeriodTimeSection t={t} period={period} labelClass={labelClass} />

        {/* Validation notes */}
        <PeriodValidationsMsgs t={t} period={period} />
      </div>
    </div>
  );
}
