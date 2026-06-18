import { WorkPeriod } from "../types";

export const MOCK_WORK_PERIODS: WorkPeriod[] = [
  {
    id: "period-1",
    label: "period1",
    startTime: "08:30 ص",
    endTime: "05:30 م",
    startMinutes: 8 * 60 + 30,
    endMinutes: 17 * 60 + 30,
    goalHours: 9,
  },
  {
    id: "period-2",
    label: "period2",
    startTime: "02:00 م",
    endTime: "10:00 م",
    startMinutes: 14 * 60,
    endMinutes: 22 * 60,
    goalHours: 8,
  },
  {
    id: "period-3",
    label: "period3",
    startTime: "10:00 م",
    endTime: "06:00 ص",
    startMinutes: 22 * 60,
    endMinutes: 6 * 60,
    goalHours: 8,
    endsNextDay: true,
  },
];
