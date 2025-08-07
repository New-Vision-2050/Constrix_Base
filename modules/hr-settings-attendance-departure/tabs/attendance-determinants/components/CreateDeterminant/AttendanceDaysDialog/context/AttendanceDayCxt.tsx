"use client";
import { useFormStore } from "@/modules/form-builder";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { InitialTimeHours, PeriodHour } from "../constants/time";

//
export type AttendanceDayPeriodType = {
  index: number;
  start_time: string;
  end_time: string;
  extends_to_next_day?: boolean;
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

  // used days
  usedDays: string[];

  // min and max edges
  minEdge: string;
  maxEdge: string;

  // available hours
  dayAvsilableHours: PeriodHour[];
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
  const [dayAvsilableHours, setdayAvailableHours] = useState(InitialTimeHours);
  const [selectedDay, SetSelectedDay] = useState<string>("");
  const [dayPeriods, SetDayPeriods] = useState<AttendanceDayPeriodType[]>([]);

  // the min edge of the day
  const [minEdge, SetMinEdge] = useState<string>("");
  // the max edge of the day
  const [maxEdge, SetMaxEdge] = useState<string>("");

  useEffect(() => {
    const _n = dayPeriods.length;
    let _timeHours = InitialTimeHours;
    // make hours in periods not available
    for (let i = 0; i < _n; i++) {
      const _period = dayPeriods[i];
      const _startHour = Number(_period.start_time.split(":")[0]);
      const _endHour = Number(_period.end_time.split(":")[0]);
      for (let j = _startHour; j <= _endHour; j++) {
        _timeHours = _timeHours?.map((hour) => {
          if (+hour.value == j) {
            return { ...hour, available: false };
          }
          return hour;
        });
      }
    }
    console.log("_timeHours", _timeHours);
    dayPeriods.forEach((period) => {});
    setdayAvailableHours(_timeHours);
  }, [dayPeriods]);
  // prepare schedule data
  const _weekly_schedule = useFormStore
    ?.getState()
    .getValue("create-determinant-form", "weekly_schedule");

  const _openDialog = useFormStore
    ?.getState()
    .getValue("create-determinant-form", "show_attendance_days_dialog");

  const usedDays: string[] = useMemo(() => {
    return _weekly_schedule?.map((day: any) => day.day as string);
  }, [_weekly_schedule]);

  useEffect(() => {
    // reset selected day and day periods when dialog is closed
    if (!_openDialog) {
      SetSelectedDay("");
      SetDayPeriods([]);
      SetMinEdge("");
      SetMaxEdge("");
    }
  }, [_openDialog]);

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
  // convert string to time in minutes
  const convertStringToMinutes = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // handle update day period
  const handleUpdateDayPeriod = (_period: AttendanceDayPeriodType) => {
    // update min and max edges
    if (_period.start_time) {
      if (Boolean(minEdge)) {
        if (
          convertStringToMinutes(_period.start_time) <
          convertStringToMinutes(minEdge)
        ) {
          SetMinEdge(_period.start_time);
        }
      } else {
        SetMinEdge(_period.start_time);
      }
    }
    if (_period.end_time) {
      if (Boolean(maxEdge)) {
        if (
          convertStringToMinutes(_period.end_time) >
          convertStringToMinutes(maxEdge)
        ) {
          SetMaxEdge(_period.end_time);
        }
      } else {
        SetMaxEdge(_period.end_time);
      }
    }

    // update day periods
    SetDayPeriods(
      dayPeriods.map((period) =>
        period.index === _period.index ? _period : period
      )
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
        // used days
        usedDays,
        // min and max edges
        minEdge,
        maxEdge,
        // available hours
        dayAvsilableHours,
      }}
    >
      {children}
    </AttendanceDayCxt.Provider>
  );
};
