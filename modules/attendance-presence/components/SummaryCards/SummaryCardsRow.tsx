"use client";

import { useAttendanceDirection } from "../../utils/direction";
import CurrentPeriodCard from "./CurrentPeriodCard";
import CurrentTimeDateCard from "./CurrentTimeDateCard";
import MonthSummaryCard from "./MonthSummaryCard";
import TodayGoalCard from "./TodayGoalCard";
import TotalWorkHoursCard from "./TotalWorkHoursCard";

const SUMMARY_CARD_ITEMS = [
  { key: "totalWorkHours", Component: TotalWorkHoursCard },
  { key: "todayGoal", Component: TodayGoalCard },
  { key: "currentPeriod", Component: CurrentPeriodCard },
  { key: "currentTimeDate", Component: CurrentTimeDateCard },
  { key: "monthSummary", Component: MonthSummaryCard },
] as const;

export default function SummaryCardsRow() {
  const { dir, isRtl } = useAttendanceDirection();
  const cards = isRtl ? [...SUMMARY_CARD_ITEMS].reverse() : SUMMARY_CARD_ITEMS;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      dir={dir}
    >
      {cards.map(({ key, Component }) => (
        <Component key={key} />
      ))}
    </div>
  );
}
