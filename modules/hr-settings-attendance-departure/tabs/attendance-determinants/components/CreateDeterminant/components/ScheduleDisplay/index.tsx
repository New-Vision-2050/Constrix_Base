import React from "react";
import { ScheduleDayItem } from "./ScheduleDayItem";

// Types
type PeriodType = {
  from: string;
  to: string;
  extends_to_next_day?: boolean;
  id?: string;
};

export type WeeklyScheduleDayConfig = {
  day: string;
  periods: PeriodType[];
};

export type WeeklyScheduleDays = {
  [key: string]: WeeklyScheduleDayConfig;
};

type ScheduleDisplayProps = {
  t?: (key: string, defaultText: string) => string;
  weeklySchedule: WeeklyScheduleDays;
};

/**
 * Component for displaying the weekly schedule with all days and their periods
 */
export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({
  t,
  weeklySchedule,
}) => {
  // If there's no schedule or it's empty, show a message
  if (!weeklySchedule || Object.keys(weeklySchedule).length === 0) {
    return (
      <div className="text-gray-500">
        {t ? t("noScheduledDays", "No scheduled days") : "No scheduled days"}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(weeklySchedule).map(([day, dayConfig], index) => (
        <ScheduleDayItem key={`${day}-${index}`} dayConfig={dayConfig} />
      ))}
    </div>
  );
};
