"use client";
import { useFormStore } from "@/modules/form-builder";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { InitialTimeHours, PeriodHour } from "../constants/time";
import { DAYS_OF_WEEK } from "../constants/days";

//
export type AttendanceDayPeriodType = {
  index: number;
  start_time: string;
  end_time: string;
  early_period?: string;
  early_unit?: string;
  lateness_period?: string;
  lateness_unit?: string;
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
  handleEmptyDayPeriods: () => void;
  handleRemoveDayPeriod: (index: number) => void;
  handleUpdateDayPeriod: (_period: AttendanceDayPeriodType) => void;

  // used days
  usedDays: string[];

  // min and max edges
  minEdge: string;
  maxEdge: string;

  // available hours
  dayAvsilableHours: PeriodHour[];

  // is edit
  isEdit: boolean;

  // extends to next day message
  extendsToNextDayMsg: string;

  // min edge in next day
  minEdgeInNextDay: string;
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
  // is edit
  const [isEdit, setIsEdit] = useState(false);
  // the min edge of the day
  const [minEdge, SetMinEdge] = useState<string>("");
  // the max edge of the day
  const [maxEdge, SetMaxEdge] = useState<string>("");
  // extends to next day message
  const [extendsToNextDayMsg, SetExtendsToNextDayMsg] = useState<string>("");
  const [minEdgeInNextDay, setMinEdgeInNextDay] = useState<string>("");

  useEffect(() => {
    const _n = dayPeriods.length;
    let _timeHours = InitialTimeHours;
    // reset min and max edges
    let _minEdge = "24:00";
    let _maxEdge = "00:00";
    let _nextDayExist = false;
    // make hours in periods not available
    for (let i = 0; i < _n; i++) {
      const _period = dayPeriods[i];
      const _startHour = Number(_period.start_time?.split(":")[0]);
      let _endHour = Number(_period.end_time?.split(":")[0]);
      if (_period.extends_to_next_day) {
        _nextDayExist = true;
        _endHour = 24;
      }

      // set min and max edges
      if (Boolean(_period.start_time)) {
        const _startMinutes = convertStringToMinutes(_period.start_time);
        const _minEdgeMinutes = convertStringToMinutes(_minEdge);
        if (_startMinutes < _minEdgeMinutes) {
          _minEdge = _period.start_time;
        }
      }
      if (Boolean(_period.end_time)) {
        const _endMinutes = convertStringToMinutes(_period.end_time);
        const _maxEdgeMinutes = convertStringToMinutes(_maxEdge);
        if (_endMinutes > _maxEdgeMinutes) {
          _maxEdge = _period.end_time;
        }
      }

      // make hours in periods not available
      for (let j = _startHour; j <= _endHour; j++) {
        _timeHours = _timeHours?.map((hour) => {
          if (+hour.value == j) {
            return { ...hour, available: false };
          }
          return hour;
        });
      }
    }

    if (!_nextDayExist) {
      SetMinEdge(_minEdge);
      SetMaxEdge(_maxEdge);
    }
    setdayAvailableHours(_timeHours);
  }, [dayPeriods]);

  // handle extends to next day message
  useEffect(() => {
    // find period that extends to next day
    const _period = dayPeriods?.find((period) => period?.extends_to_next_day);

    if (_period) {
      // day after _period day
      const _periodDayIndex = DAYS_OF_WEEK.findIndex(
        (day) => day.value == selectedDay
      );
      const _periodDay = DAYS_OF_WEEK[_periodDayIndex];
      // next day name
      const _nextDayName =
        DAYS_OF_WEEK[(_periodDayIndex + 1) % DAYS_OF_WEEK.length];
      // prepare message
      const _message = `
      لقد أمتدت الفترة الى اليوم التالي لتصبح :${_periodDay.labelAr} : [${_period.start_time} - 24:00] , ${_nextDayName.labelAr} : [00:00 - ${_period.end_time}]
      `;
      SetExtendsToNextDayMsg(_message);
      // validation according next day config
      const _weekly_schedule = useFormStore
        ?.getState()
        .getValue("create-determinant-form", "weekly_schedule");
      const _nextDayConfig = _weekly_schedule?.find(
        (day: any) => day.day == _nextDayName.value
      );

      if (_nextDayConfig) {
        //validation is valid to add period? yes add else show error message
        const _nextDayPeriods: AttendanceDayPeriodType[] =
          _nextDayConfig.periods?.map((period: any) => {
            return {
              index: period.index,
              start_time: period.from,
              end_time: period.to,
              early_period: period.early_period,
              early_unit: period.early_unit,
              lateness_period: period.lateness_period,
              lateness_unit: period.lateness_unit,
              extends_to_next_day: period.extends_to_next_day,
            };
          });
        const _nextDayPeriodsCount = _nextDayPeriods.length;
        // get minEdge in next day periods
        let _nextDayPeriodsMinEdge = _nextDayPeriods?.[0]?.start_time;
        for (let i = 0; i < _nextDayPeriodsCount; i++) {
          const _nextDayPeriod = _nextDayPeriods[i];
          const _nextDayPeriodMinEdge = convertStringToMinutes(
            _nextDayPeriod.start_time
          );
          const _nextDayPeriodMaxEdge = convertStringToMinutes(
            _nextDayPeriodsMinEdge
          );
          if (_nextDayPeriodMinEdge < _nextDayPeriodMaxEdge) {
            _nextDayPeriodsMinEdge = _nextDayPeriod.start_time;
          }
        }
        setMinEdgeInNextDay(_nextDayPeriodsMinEdge);
      }
    }
  }, [dayPeriods]);

  // edited day
  const _editedDay = useFormStore
    ?.getState()
    .getValue("create-determinant-form", "editedDay");

  // prepare schedule data
  const _weekly_schedule = useFormStore
    ?.getState()
    .getValue("create-determinant-form", "weekly_schedule");

  const _openDialog = useFormStore
    ?.getState()
    .getValue("create-determinant-form", "show_attendance_days_dialog");

  const usedDays: string[] = useMemo(() => {
    if (_editedDay) {
      return DAYS_OF_WEEK.filter((day) => day.value !== _editedDay.day).map(
        (day) => day.value
      );
    }
    return _weekly_schedule?.map((day: any) => day.day as string);
  }, [_weekly_schedule, _editedDay]);

  useEffect(() => {
    // reset selected day and day periods when dialog is closed
    if (!_openDialog) {
      SetSelectedDay("");
      SetDayPeriods([]);
      SetMinEdge("");
      SetMaxEdge("");
      setIsEdit(false);
      useFormStore
        ?.getState()
        .setValue("create-determinant-form", "editedDay", null);
    } else {
      if (_editedDay) {
        setIsEdit(true);
        const _newPeriods = _editedDay.periods.map(
          (period: any, index: number) => {
            return {
              index: index + 1,
              start_time: period.from,
              end_time: period.to,
              early_period: period.early_period,
              early_unit: period.early_unit,
              lateness_period: period.lateness_period,
              lateness_unit: period.lateness_unit,
            };
          }
        );
        SetSelectedDay(_editedDay.day);
        SetDayPeriods(_newPeriods);
      }
    }
  }, [_openDialog, _editedDay]);

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
    if (!timeString) return 0;
    const [hours, minutes] = timeString?.split(":")?.map(Number);
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

  // handle empty day periods
  const handleEmptyDayPeriods = () => {
    setIsEdit(false);
    SetDayPeriods([]);
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
        handleEmptyDayPeriods,
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
        // is edit
        isEdit,
        // extends to next day message
        extendsToNextDayMsg,
        // min edge in next day
        minEdgeInNextDay,
      }}
    >
      {children}
    </AttendanceDayCxt.Provider>
  );
};
