"use client";
import { useFormStore } from "@/modules/form-builder";
// types
import type { ReactNode } from "react";

// import packages
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
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

export type AttendanceDaySchedulePeriod = {
  index?: number;
  from: string;
  to: string;
  early_period?: string;
  early_unit?: string;
  lateness_period?: string;
  lateness_unit?: string;
  extends_to_next_day?: boolean;
};

export type AttendanceDayEditedDay = {
  day: string;
  periods: AttendanceDaySchedulePeriod[];
};

export type AttendanceDaysStandaloneConfig = {
  isOpen: boolean;
  onClose: () => void;
  editedDay?: AttendanceDayEditedDay | null;
  initialSelectedDay?: string;
  weeklySchedule?: AttendanceDayEditedDay[];
  onSave: (dayConfig: AttendanceDayEditedDay) => void;
  lockDaySelector?: boolean;
  showPeriodToleranceSettings?: boolean;
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

  lockDaySelector: boolean;

  showPeriodToleranceSettings: boolean;

  onSaveStandalone?: (dayConfig: AttendanceDayEditedDay) => void;
  onCloseStandalone?: () => void;

  // extends to next day message
  extendsToNextDayMsg: string;

  // min edge in next day
  minEdgeInNextDay: string;

  // end time of extended period from previous day (blocks hours before this)
  previousDayExtendedEndTime: string;

  // next day has conflicting periods - cannot extend
  nextDayHasConflict: boolean;
  nextDayConflictMsg: string;
};

export const AttendanceDayCxt = createContext<AttendanceDayCxtType>(
  {} as AttendanceDayCxtType,
);

// ** create a custom hook to use the context
export const useAttendanceDayCxt = () => {
  const context = useContext(AttendanceDayCxt);
  if (!context) {
    throw new Error(
      "useAttendanceDayCxt must be used within a AttendanceDayCxtProvider",
    );
  }
  return context;
};

function mapEditedPeriodsToDialogPeriods(
  periods: AttendanceDaySchedulePeriod[] | undefined,
): AttendanceDayPeriodType[] {
  return (periods ?? []).map((period, index) => ({
    index: period.index ?? index + 1,
    start_time: period.from,
    end_time: period.to,
    early_period: period.early_period,
    early_unit: period.early_unit,
    lateness_period: period.lateness_period,
    lateness_unit: period.lateness_unit,
    extends_to_next_day: period.extends_to_next_day,
  }));
}

export const AttendanceDayCxtProvider = (
  props: React.PropsWithChildren<{
    standaloneConfig?: AttendanceDaysStandaloneConfig;
  }>,
) => {
  // ** declare and define component state and variables
  const { children, standaloneConfig } = props;
  const isStandalone = Boolean(standaloneConfig);
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
  // end time of extended period from previous day
  const [previousDayExtendedEndTime, setPreviousDayExtendedEndTime] =
    useState<string>("");
  // next day has conflicting periods - cannot extend
  const [nextDayHasConflict, setNextDayHasConflict] = useState<boolean>(false);
  const [nextDayConflictMsg, setNextDayConflictMsg] = useState<string>("");

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
        (day) => day.value == selectedDay,
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
      const _weekly_schedule = isStandalone
        ? (standaloneConfig?.weeklySchedule ?? [])
        : useFormStore
            ?.getState()
            .getValue("create-determinant-form", "weekly_schedule");
      const _nextDayConfig = _weekly_schedule?.find(
        (day: any) => day.day == _nextDayName.value,
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
            _nextDayPeriod.start_time,
          );
          const _nextDayPeriodMaxEdge = convertStringToMinutes(
            _nextDayPeriodsMinEdge,
          );
          if (_nextDayPeriodMinEdge < _nextDayPeriodMaxEdge) {
            _nextDayPeriodsMinEdge = _nextDayPeriod.start_time;
          }
        }
        setMinEdgeInNextDay(_nextDayPeriodsMinEdge);
      }
    } else {
      // Reset extends message when no period extends to next day
      SetExtendsToNextDayMsg("");
      setMinEdgeInNextDay("");
    }
  }, [dayPeriods, selectedDay]);

  // Check if next day has any periods that would conflict with extension
  useEffect(() => {
    if (!selectedDay) {
      setNextDayHasConflict(false);
      setNextDayConflictMsg("");
      return;
    }

    // Get next day
    const currentDayIndex = DAYS_OF_WEEK.findIndex(
      (d) => d.value === selectedDay,
    );
    const nextDayIndex = (currentDayIndex + 1) % DAYS_OF_WEEK.length;
    const nextDayValue = DAYS_OF_WEEK[nextDayIndex].value;
    const nextDayName = DAYS_OF_WEEK[nextDayIndex].labelAr;

    // Get weekly schedule
    const _weekly_schedule = isStandalone
      ? (standaloneConfig?.weeklySchedule ?? [])
      : useFormStore
          ?.getState()
          .getValue("create-determinant-form", "weekly_schedule");

    // Find next day config
    const nextDayConfig = _weekly_schedule?.find(
      (day: any) => day.day === nextDayValue,
    );

    if (nextDayConfig && nextDayConfig.periods?.length > 0) {
      // Next day has periods - check if any start from 00:00 or early morning
      // which would conflict with an extended period
      const hasConflictingPeriod = nextDayConfig.periods.some((period: any) => {
        const startTime = period.from || "";
        // If any period starts before or at the potential extended end time,
        // there's a conflict. We check if any period exists that starts early.
        // The extended period would occupy 00:00 to end_time on next day
        return startTime !== ""; // Any period on next day is a potential conflict
      });

      if (hasConflictingPeriod) {
        setNextDayHasConflict(true);
        setNextDayConflictMsg(
          `لا يمكن التمديد لليوم التالي (${nextDayName}) لأنه يحتوي على فترات عمل قد تتعارض مع الفترة الممتدة`,
        );
      } else {
        setNextDayHasConflict(false);
        setNextDayConflictMsg("");
      }
    } else {
      // No periods on next day - no conflict
      setNextDayHasConflict(false);
      setNextDayConflictMsg("");
    }
  }, [selectedDay, isStandalone, standaloneConfig?.weeklySchedule]);

  const dialogIsOpen = isStandalone
    ? Boolean(standaloneConfig?.isOpen)
    : Boolean(
        useFormStore
          ?.getState()
          .getValue("create-determinant-form", "show_attendance_days_dialog"),
      );

  const editedDay = isStandalone
    ? (standaloneConfig?.editedDay ?? null)
    : (useFormStore
        ?.getState()
        .getValue("create-determinant-form", "editedDay") as
        | AttendanceDayEditedDay
        | null
        | undefined);

  const weeklyScheduleSource: AttendanceDayEditedDay[] = isStandalone
    ? (standaloneConfig?.weeklySchedule ?? [])
    : ((useFormStore
        ?.getState()
        .getValue("create-determinant-form", "weekly_schedule") ??
        []) as AttendanceDayEditedDay[]);

  const usedDays: string[] = useMemo(() => {
    if (editedDay?.day) {
      return (
        weeklyScheduleSource
          ?.filter((day) => day.day !== editedDay.day)
          ?.map((day) => day.day as string) || []
      );
    }
    return weeklyScheduleSource?.map((day) => day.day as string) || [];
  }, [weeklyScheduleSource, editedDay]);

  // Check if previous day has a period that extends to current day
  useEffect(() => {
    if (!selectedDay || !weeklyScheduleSource?.length) {
      setPreviousDayExtendedEndTime("");
      return;
    }

    // Get previous day
    const currentDayIndex = DAYS_OF_WEEK.findIndex(
      (d) => d.value === selectedDay,
    );
    const previousDayIndex =
      (currentDayIndex - 1 + DAYS_OF_WEEK.length) % DAYS_OF_WEEK.length;
    const previousDayValue = DAYS_OF_WEEK[previousDayIndex].value;

    // Find previous day config in weekly schedule
    const previousDayConfig = weeklyScheduleSource?.find(
      (day) => day.day === previousDayValue,
    );

    if (previousDayConfig) {
      // Check if any period extends to next day
      const extendedPeriod = previousDayConfig.periods?.find(
        (period) => period.extends_to_next_day,
      );

      if (extendedPeriod) {
        // Set the end time of the extended period - this blocks hours before it
        setPreviousDayExtendedEndTime(extendedPeriod.to || "");
      } else {
        setPreviousDayExtendedEndTime("");
      }
    } else {
      setPreviousDayExtendedEndTime("");
    }
  }, [selectedDay, weeklyScheduleSource]);

  useLayoutEffect(() => {
    // reset selected day and day periods when dialog is closed
    if (!dialogIsOpen) {
      SetSelectedDay("");
      SetDayPeriods([]);
      SetMinEdge("");
      SetMaxEdge("");
      setIsEdit(false);
      if (!isStandalone) {
        useFormStore
          ?.getState()
          .setValue("create-determinant-form", "editedDay", null);
      }
    } else {
      if (editedDay?.day) {
        setIsEdit(true);
        SetSelectedDay(editedDay.day);
        SetDayPeriods(mapEditedPeriodsToDialogPeriods(editedDay.periods));
      } else if (standaloneConfig?.initialSelectedDay) {
        setIsEdit(false);
        SetSelectedDay(standaloneConfig.initialSelectedDay);
        SetDayPeriods([]);
      } else {
        setIsEdit(false);
      }
    }
  }, [
    dialogIsOpen,
    editedDay,
    isStandalone,
    standaloneConfig?.initialSelectedDay,
  ]);

  // ** declare and define component helper methods
  const handleDayChange = useMemo(() => {
    return (day: string) => {
      if (isStandalone && standaloneConfig?.lockDaySelector) return;
      const edited = isStandalone
        ? standaloneConfig?.editedDay
        : (useFormStore
            ?.getState()
            .getValue("create-determinant-form", "editedDay") as
            | { day?: string }
            | null
            | undefined);
      const isDev = (process.env.NEXT_PUBLIC_API_BASE_URL || "").includes(
        "dev",
      );
      if (edited?.day && !isDev) return;
      SetSelectedDay(day);
    };
  }, [isStandalone, standaloneConfig?.editedDay, standaloneConfig?.lockDaySelector]);

  const addMinuteToTime = (timeString?: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return "";

    const totalMinutes = hours * 60 + minutes + 1;
    if (totalMinutes > 24 * 60) return "";

    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
  };

  //  handle add day period
  const handleAddDayPeriod = () => {
    const lastPeriod = dayPeriods[dayPeriods.length - 1];
    let nextStartTime = "";

    if (lastPeriod?.end_time) {
      // If there's a previous period, start after it
      nextStartTime = addMinuteToTime(lastPeriod.end_time);
    } else if (dayPeriods.length === 0 && previousDayExtendedEndTime) {
      // If it's the first period and previous day has extended period, start after it
      nextStartTime = addMinuteToTime(previousDayExtendedEndTime);
    }

    SetDayPeriods([
      ...dayPeriods,
      {
        index: dayPeriods.length + 1,
        start_time: nextStartTime,
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
        period.index === _period.index ? _period : period,
      ),
    );
  };

  // handle edit day periods - switch to edit mode without clearing periods
  const handleEmptyDayPeriods = () => {
    setIsEdit(false);
    // Don't clear periods - keep them for editing
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
        lockDaySelector: Boolean(
          isStandalone && standaloneConfig?.lockDaySelector,
        ),
        showPeriodToleranceSettings: isStandalone
          ? (standaloneConfig?.showPeriodToleranceSettings ?? true)
          : true,
        onSaveStandalone: isStandalone
          ? standaloneConfig?.onSave
          : undefined,
        onCloseStandalone: isStandalone
          ? standaloneConfig?.onClose
          : undefined,
        // extends to next day message
        extendsToNextDayMsg,
        // min edge in next day
        minEdgeInNextDay,
        // end time of extended period from previous day
        previousDayExtendedEndTime,
        // next day has conflicting periods
        nextDayHasConflict,
        nextDayConflictMsg,
      }}
    >
      {children}
    </AttendanceDayCxt.Provider>
  );
};
