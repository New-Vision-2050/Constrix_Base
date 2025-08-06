"use client";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useMemo, useState } from "react";

//
export type AttendanceDayPeriodType = {
  index: number;
  start_time: string;
  end_time: string;
};

// declare context types
type AttendanceDayCxtType = {
  // selected day
  selectedDay: string;
  handleDayChange: (day: string) => void;
  // day periods
  dayPeriods: AttendanceDayPeriodType[];
  handleAddDayPeriod: () => void;
  handleRemoveDayPeriod: (index: number) => void;
  handleUpdateDayPeriod: (_period: AttendanceDayPeriodType) => void;
};

export const AttendanceDayCxt = createContext<AttendanceDayCxtType>(
  {} as AttendanceDayCxtType
);

// ** create a custom hook to use the context
export const useAttendanceDayCxt = () => {
  const context = useContext(AttendanceDayCxt);
  if (!context) {
    throw new Error(
      "useAttendanceDayCxt must be used within a AttendanceDayCxtProvider"
    );
  }
  return context;
};

export const AttendanceDayCxtProvider = (props: React.PropsWithChildren) => {
  // ** declare and define component state and variables
  const { children } = props;
  // ** handle side effects
  const [selectedDay, SetSelectedDay] = useState<string>("");
  const [dayPeriods, SetDayPeriods] = useState<AttendanceDayPeriodType[]>([]);

  // ** declare and define component helper methods
  const handleDayChange = useMemo(() => {
    return (day: string) => {
      SetSelectedDay(day);
    };
  }, []);

  //  handle add day period
  const handleAddDayPeriod = () => {
    SetDayPeriods([
      ...dayPeriods,
      {
        index: dayPeriods.length + 1,
        start_time: "",
        end_time: "",
      },
    ]);
  };
  // handle remove day period
  const handleRemoveDayPeriod = (index: number) => {
    // Filter based on the period's index property, not the array position
    const newDayPeriods = dayPeriods.filter((period) => period.index !== index);
    SetDayPeriods(newDayPeriods);
  };
  // handle update day period
  const handleUpdateDayPeriod = (_period: AttendanceDayPeriodType) => {
    SetDayPeriods(
      dayPeriods.map((period, i) => (i === _period.index ? _period : period))
    );
  };

  // ** return component ui
  return (
    <AttendanceDayCxt.Provider
      value={{
        // selected day
        selectedDay,
        handleDayChange,
        // day periods
        dayPeriods,
        handleAddDayPeriod,
        handleRemoveDayPeriod,
        handleUpdateDayPeriod,
      }}
    >
      {children}
    </AttendanceDayCxt.Provider>
  );
};
