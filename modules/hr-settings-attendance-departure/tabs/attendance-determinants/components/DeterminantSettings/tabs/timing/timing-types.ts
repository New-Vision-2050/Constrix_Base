export type DayPeriod = {
  from: string;
  fromMeridiem: "AM" | "PM";
  to: string;
  toMeridiem: "AM" | "PM";
};

export const DEFAULT_DAY_PERIOD: DayPeriod = {
  from: "09:00",
  fromMeridiem: "AM",
  to: "05:30",
  toMeridiem: "PM",
};

/** Single shift row including optional “spills to next calendar day”. */
export type DayPeriodRow = DayPeriod & {
  endsNextDay: boolean;
};

export const DEFAULT_DAY_PERIOD_ROW: DayPeriodRow = {
  ...DEFAULT_DAY_PERIOD,
  endsNextDay: false,
};

/** Defaults when opening “اضافة الفترات” with no saved periods (matches design mock). */
export const FIRST_ADD_PERIOD_ROW: DayPeriodRow = {
  from: "02:00",
  fromMeridiem: "AM",
  to: "09:00",
  toMeridiem: "PM",
  endsNextDay: false,
};

const SHIFT_PERIOD_LABELS = [
  "الفترة الأولى",
  "الفترة الثانية",
  "الفترة الثالثة",
  "الفترة الرابعة",
  "الفترة الخامسة",
  "الفترة السادسة",
  "الفترة السابعة",
  "الفترة الثامنة",
];

export function shiftPeriodLabel(index: number): string {
  return SHIFT_PERIOD_LABELS[index] ?? `الفترة ${index + 1}`;
}
