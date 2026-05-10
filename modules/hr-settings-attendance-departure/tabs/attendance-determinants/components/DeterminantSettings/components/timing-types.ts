export type DayPeriod = {
  from: string;
  fromMeridiem: "AM" | "PM";
  to: string;
  toMeridiem: "AM" | "PM";
};

export const DEFAULT_DAY_PERIOD: DayPeriod = {
  from: "09:00",
  fromMeridiem: "AM",
  to: "02:00",
  toMeridiem: "PM",
};
