import { useTheme } from "next-themes";
import { Clock, ArrowRight, CalendarCheck, ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type PeriodDataProps = {
  start_time?: string;
  end_time?: string;
};

export default function AttendanceDayPeriodPreview({
  start_time = "08:00",
  end_time = "16:00",
}: PeriodDataProps) {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog"
  );

  // Calculate period duration
  const calculateDuration = () => {
    if (!start_time || !end_time) return "--:--";

    // Parse hours and minutes
    const [startHour, startMinute] = start_time.split(":").map(Number);
    const [endHour, endMinute] = end_time.split(":").map(Number);

    // Calculate total minutes
    let startTotalMinutes = startHour * 60 + startMinute;
    let endTotalMinutes = endHour * 60 + endMinute;

    // Check if period extends to next day
    const isNextDay = endTotalMinutes <= startTotalMinutes;

    // Adjust end time if period extends to next day
    if (isNextDay) {
      endTotalMinutes += 24 * 60; // Add 24 hours
    }

    // Calculate duration in minutes
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    // Convert back to hours and minutes
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Check if period extends to next day
  const isNextDay = () => {
    if (!start_time || !end_time) return false;

    const [startHour, startMinute] = start_time.split(":").map(Number);
    const [endHour, endMinute] = end_time.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    return endTotalMinutes <= startTotalMinutes;
  };

  // Common styles
  const cardClass = `rounded-lg p-4 ${
    resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
  }  shadow-sm`;
  const timeClass = `text-lg font-bold ${
    resolvedTheme === "dark" ? "text-white" : "text-gray-800"
  }`;
  const labelClass = `text-sm ${
    resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
  }`;

  return (
    <div className={cardClass}>
      <div className="flex flex-col gap-3">
        {/* Time period */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-pink-500" />
            <span className={labelClass}>{t("timePeriodLabel")}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className={labelClass}>{t("startTimeLabel")}</span>
              <span className={timeClass}>{start_time}</span>
            </div>

            {!isRtl ? (
              <ArrowRight
                className={`h-5 w-5 ${
                  resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
            ) : (
              <ArrowLeft
                className={`h-5 w-5 ${
                  resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
            )}

            <div className="flex flex-col items-center">
              <span className={labelClass}>{t("endTimeLabel")}</span>
              <span className={timeClass}>{end_time}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          {/* Duration */}
          <div className="flex items-center gap-2">
            <span className={labelClass}>{t("durationLabel")}</span>
            <span className={`${timeClass} text-pink-500`}>
              {calculateDuration()}
            </span>
            <span className={labelClass}>{t("hours")}</span>
          </div>

          {/* Next day indicator */}
          <div className="flex items-center gap-2">
            <CalendarCheck
              className={`h-5 w-5 ${
                isNextDay() ? "text-pink-500" : "text-gray-400"
              }`}
            />
            <span
              className={`${labelClass} ${isNextDay() ? "font-medium" : ""}`}
            >
              {t("extendsToNextDay")}
            </span>
            <div
              className={`h-4 w-4 rounded-sm border ${
                isNextDay() ? "bg-pink-500 border-pink-600" : "border-gray-400"
              }`}
            >
              {isNextDay() && (
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white">
                  <path
                    fill="currentColor"
                    d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
