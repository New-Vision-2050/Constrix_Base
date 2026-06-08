import type { AttendanceDayEditedDay } from "../../../CreateDeterminant/AttendanceDaysDialog/context/AttendanceDayCxt";
import {
  hm24ToClockAndMeridiem,
  to24HourHm,
} from "./shift-payload";
import type { DayPeriodRow } from "./timing-types";

export function dayPeriodRowsToEditedDay(
  dayId: string,
  rows: DayPeriodRow[],
): AttendanceDayEditedDay {
  return {
    day: dayId,
    periods: rows.map((row, index) => ({
      index: index + 1,
      from: to24HourHm(row.from, row.fromMeridiem),
      to: to24HourHm(row.to, row.toMeridiem),
      extends_to_next_day: row.endsNextDay,
    })),
  };
}

export function editedDayToDayPeriodRows(
  dayConfig: AttendanceDayEditedDay,
): DayPeriodRow[] {
  return dayConfig.periods.map((period) => {
    const start = hm24ToClockAndMeridiem(period.from);
    const end = hm24ToClockAndMeridiem(period.to);
    return {
      from: start.clock,
      fromMeridiem: start.meridiem,
      to: end.clock,
      toMeridiem: end.meridiem,
      endsNextDay: Boolean(period.extends_to_next_day),
    };
  });
}

export function buildWeeklyScheduleForDialog(
  weeklyDays: string[],
  weeklyPeriodRows: DayPeriodRow[],
  dayPeriodRows: Record<string, DayPeriodRow[]>,
): AttendanceDayEditedDay[] {
  const fromDaily = Object.entries(dayPeriodRows)
    .filter(([, rows]) => rows.length > 0)
    .map(([day, rows]) => dayPeriodRowsToEditedDay(day, rows));

  if (fromDaily.length > 0) return fromDaily;

  if (weeklyPeriodRows.length === 0 || weeklyDays.length === 0) return [];

  const shared = dayPeriodRowsToEditedDay(
    weeklyDays[0],
    weeklyPeriodRows,
  ).periods;

  return weeklyDays.map((day) => ({
    day,
    periods: shared.map((period) => ({ ...period })),
  }));
}
