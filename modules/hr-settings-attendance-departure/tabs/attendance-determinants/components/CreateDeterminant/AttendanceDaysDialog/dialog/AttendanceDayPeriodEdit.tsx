import React from 'react';
import { useTheme } from "next-themes";
import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AttendanceDayPeriodType } from '../context/AttendanceDayCxt';

type PeriodEditProps = {
  period: AttendanceDayPeriodType;
  onStartTimeChange?: (time: string) => void;
  onEndTimeChange?: (time: string) => void;
};

export default function AttendanceDayPeriodEdit({
  period,
  onStartTimeChange,
  onEndTimeChange
}: PeriodEditProps) {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog"
  );
  
  // Common styles
  const sectionClass = `rounded-lg p-4 ${resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-100"} shadow-sm`;
  const labelClass = `text-sm ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium mb-1`;
  
  // Handle time change
  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    // Validate time format (HH:MM)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
      // Invalid format - can implement custom validation UI here
      return;
    }
    
    if (type === 'start' && onStartTimeChange) {
      onStartTimeChange(value);
    } else if (type === 'end' && onEndTimeChange) {
      onEndTimeChange(value);
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
              onChange={(e) => handleTimeChange('start', e.target.value)}
              className={`${resolvedTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"}`}
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
              onChange={(e) => handleTimeChange('end', e.target.value)}
              className={`${resolvedTheme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"}`}
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
