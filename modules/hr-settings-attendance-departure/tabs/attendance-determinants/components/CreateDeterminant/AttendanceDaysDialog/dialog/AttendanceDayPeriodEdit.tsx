import React from "react";
import { useTheme } from "next-themes";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../context/AttendanceDayCxt";

type PeriodEditProps = {
  period: AttendanceDayPeriodType;
};

export default function AttendanceDayPeriodEdit({ period }: PeriodEditProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog"
  );
  const { handleUpdateDayPeriod } = useAttendanceDayCxt();

  // Common styles
  const sectionClass = `rounded-lg p-4 ${
    resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
  } shadow-sm`;
  const labelClass = `text-sm ${
    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
  } font-medium mb-1`;

  // Handle time change
  const handleTimeChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      handleUpdateDayPeriod({ ...period, start_time: value });
    } else if (type === "end") {
      handleUpdateDayPeriod({ ...period, end_time: value });
    }
  };

  return (
    <div className={sectionClass}>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-pink-500" />
          <span className={labelClass}>{t("timePeriodLabel")}</span>
        </div>

        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Time */}
          <div>
            <Label htmlFor="start-time" className={labelClass}>
              {t("startTimeLabel")}
            </Label>
            <Input
              id="start-time"
              type="time"
              value={period.start_time}
              onChange={(e) => handleTimeChange("start", e.target.value)}
              className={`${
                resolvedTheme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white"
              }`}
              dir="ltr" // Time inputs are always LTR
              min="00:00"
              max="23:59"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <Label htmlFor="end-time" className={labelClass}>
              {t("endTimeLabel")}
            </Label>
            <Input
              id="end-time"
              type="time"
              value={period.end_time}
              onChange={(e) => handleTimeChange("end", e.target.value)}
              className={`${
                resolvedTheme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white"
              }`}
              dir="ltr" // Time inputs are always LTR
              min="00:00"
              max="23:59"
              required
            />
          </div>
        </div>

        {/* Validation notes */}
        <div className="text-xs italic text-gray-500 mt-1">
          {t("timeFormatError")}
        </div>
      </div>
    </div>
  );
}
