"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../../context/AttendanceDayCxt";

interface TimeFieldProps {
  value: string;
  onChange: (value: string) => void;
  period: AttendanceDayPeriodType;
  type: "start" | "end";
  label?: string;
  disabled?: boolean;
}

// convert string to time in minutes
const convertStringToMinutes = (timeString: string) => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString?.split(":")?.map(Number);
  return hours * 60 + minutes;
};

const normalizeTimeValue = (input?: string) => {
  if (!input) {
    return { hour: "", minute: "" };
  }

  const parts = String(input).split(":");
  const hourPart = parts[0];
  const minutePart = parts[1] ?? "00";

  // Don't pad hour - it should match InitialTimeHours values ("0", "1", "2", ... "23")
  const normalizedHour = Number.isNaN(Number(hourPart))
    ? ""
    : String(parseInt(hourPart, 10));
  const normalizedMinute = minutePart.padStart(2, "0");

  return { hour: normalizedHour, minute: normalizedMinute };
};

const NewInputTimeField = ({
  value,
  period,
  onChange,
  type,
  label,
  disabled = false,
}: TimeFieldProps) => {
  // context
  const {
    dayAvsilableHours,
    minEdgeInNextDay,
    dayPeriods,
    previousDayExtendedEndTime,
  } = useAttendanceDayCxt();
  const initialTime = normalizeTimeValue(value);
  const [selectedHour, setSelectedHour] = useState<string>(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState<string>(
    initialTime.minute,
  );

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const isInternalUpdate = useRef(false);
  const lastSentValue = useRef(value);

  // Sync state with value prop when it changes (for edit mode)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const normalized = normalizeTimeValue(value);
    setSelectedHour(normalized.hour);
    setSelectedMinute(normalized.minute);
    lastSentValue.current = value;
  }, [value]);

  const previousPeriod = useMemo(() => {
    if (type !== "start") return null;
    return dayPeriods?.find((item) => item.index === period.index - 1) ?? null;
  }, [dayPeriods, period.index, type]);

  const otherPeriods = useMemo(() => {
    return dayPeriods?.filter((item) => item.index !== period.index) ?? [];
  }, [dayPeriods, period.index]);

  const baseHours = useMemo(() => {
    return (
      dayAvsilableHours?.map((hour) => ({
        ...hour,
        available: true,
      })) ?? []
    );
  }, [dayAvsilableHours]);

  const _dayAvsilableHours = useMemo(() => {
    // For start time: check if previous day has extended period that blocks early hours
    if (type === "start" && period.index === 1 && previousDayExtendedEndTime) {
      const [extEndHour, extEndMinute] = previousDayExtendedEndTime
        .split(":")
        .map(Number);

      return baseHours?.map((hour) => {
        const currentHour = Number(hour.value);
        if (currentHour < extEndHour) {
          return { ...hour, available: false };
        }
        if (currentHour !== extEndHour) return hour;
        if (Number.isNaN(extEndHour) || Number.isNaN(extEndMinute)) return hour;
        if (extEndMinute >= 59) return { ...hour, available: false };
        return { ...hour, available: true };
      });
    }

    if (type === "start" && previousPeriod?.end_time) {
      const [endHour, endMinute] = previousPeriod.end_time
        .split(":")
        .map(Number);

      return baseHours?.map((hour) => {
        const currentHour = Number(hour.value);
        if (currentHour < endHour) {
          return { ...hour, available: false };
        }
        if (Number(hour.value) !== endHour) return hour;
        if (Number.isNaN(endHour) || Number.isNaN(endMinute)) return hour;
        if (endMinute >= 59) return { ...hour, available: false };
        return { ...hour, available: true };
      });
    }

    if (type !== "end" || !period.start_time) return baseHours;

    let foundUnavailable = false;
    const startHour = parseInt(period.start_time?.split(":")[0]);

    return baseHours?.map((hour) => {
      const currentHour = parseInt(hour.value);

      if (type === "end" && period?.extends_to_next_day) {
        if (minEdgeInNextDay) {
          const _minEdgeInNextDay = convertStringToMinutes(minEdgeInNextDay);

          if (Number(hour.value) > Number(_minEdgeInNextDay / 60)) {
            return { ...hour, available: false };
          }
        }
        return { ...hour, available: true };
      }

      const isUnavailableByOtherPeriod = otherPeriods.some((item) => {
        if (!item.start_time || !item.end_time) return false;
        const itemStartHour = Number(item.start_time.split(":")[0]);
        let itemEndHour = Number(item.end_time.split(":")[0]);
        if (item.extends_to_next_day) itemEndHour = 24;
        return currentHour >= itemStartHour && currentHour <= itemEndHour;
      });

      if (isUnavailableByOtherPeriod) {
        if (currentHour > startHour) {
          foundUnavailable = true;
          return { ...hour, available: false };
        }
        return { ...hour, available: currentHour === startHour };
      }

      // Allow same hour or greater (end time can be 1 minute after start)
      return {
        ...hour,
        available: currentHour >= startHour && !foundUnavailable,
      };
    });
  }, [
    type,
    baseHours,
    period.start_time,
    period.index,
    period?.extends_to_next_day,
    minEdgeInNextDay,
    previousPeriod?.end_time,
    previousDayExtendedEndTime,
    otherPeriods,
  ]);

  // When extends_to_next_day is enabled, keep the current selection or allow user to choose
  // Don't force reset to 00:00 - let user select end time on next day

  // Cuando cambia la hora o el minuto, actualizar el valor
  useEffect(() => {
    if (selectedHour && selectedMinute) {
      const newTimeValue = `${selectedHour.padStart(2, "0")}:${selectedMinute}`;
      if (newTimeValue !== lastSentValue.current) {
        lastSentValue.current = newTimeValue;
        isInternalUpdate.current = true;
        onChangeRef.current(newTimeValue);
      }
    }
  }, [selectedHour, selectedMinute]);

  // Componente de selección de hora
  const hourSelect = (
    <Select
      disabled={disabled}
      value={selectedHour}
      defaultValue={value?.split(":")[0] || ""}
      onValueChange={(val) => setSelectedHour(val)}
    >
      <SelectTrigger className="w-[70px] bg-gray-800 border-gray-700">
        <SelectValue placeholder="HH" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700 text-white">
        {_dayAvsilableHours?.map((hour) => (
          <SelectItem
            key={hour.value}
            value={hour.value}
            disabled={!hour.available}
            className="text-white hover:bg-gray-700"
          >
            {hour.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // Get available minutes - filter based on start time when end time is same hour
  const availableMinutes = useMemo(() => {
    const hourMinutes =
      dayAvsilableHours?.filter((el) => el.value === selectedHour)?.[0]
        ?.minutes || [];

    // For first period: check if previous day has extended period that blocks early minutes
    if (
      type === "start" &&
      period.index === 1 &&
      previousDayExtendedEndTime &&
      selectedHour
    ) {
      const [extEndHour, extEndMinute] = previousDayExtendedEndTime
        .split(":")
        .map(Number);
      const currentHour = parseInt(selectedHour);

      if (currentHour < extEndHour) {
        return hourMinutes.map((minute) => ({
          ...minute,
          available: false,
        }));
      }

      if (currentHour === extEndHour) {
        return hourMinutes.map((minute) => ({
          ...minute,
          available: minute.available && parseInt(minute.value) > extEndMinute,
        }));
      }
    }

    if (type === "start" && previousPeriod?.end_time && selectedHour) {
      const [endHour, endMinute] = previousPeriod.end_time
        .split(":")
        .map(Number);
      const currentHour = parseInt(selectedHour);

      if (currentHour < endHour) {
        return hourMinutes.map((minute) => ({
          ...minute,
          available: false,
        }));
      }

      if (currentHour === endHour) {
        return hourMinutes.map((minute) => ({
          ...minute,
          available: minute.available && parseInt(minute.value) > endMinute,
        }));
      }
    }

    // If this is end time and same hour as start, only show minutes after start minute
    if (type === "end" && period.start_time) {
      const startHour = parseInt(period.start_time.split(":")[0]);
      const startMinute = parseInt(period.start_time.split(":")[1]);

      if (parseInt(selectedHour) === startHour) {
        return hourMinutes.map((minute) => ({
          ...minute,
          available: minute.available && parseInt(minute.value) > startMinute,
        }));
      }
    }

    return hourMinutes;
  }, [
    dayAvsilableHours,
    selectedHour,
    type,
    period.index,
    period.start_time,
    previousPeriod?.end_time,
    previousDayExtendedEndTime,
  ]);

  // Componente de selección de minuto
  const minuteSelect = (
    <Select
      disabled={disabled || !selectedHour}
      value={selectedMinute}
      onValueChange={(val) => setSelectedMinute(val)}
    >
      <SelectTrigger className="w-[70px] bg-gray-800 border-gray-700">
        <SelectValue placeholder="MM" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700 text-white">
        {availableMinutes?.map((minute) => (
          <SelectItem
            key={minute.value}
            value={minute.value}
            disabled={!minute.available}
            className="text-white hover:bg-gray-700"
          >
            {minute.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // Show editable dropdowns in both create and edit modes
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm text-gray-400">{label}</label>}
      <div className="flex items-center space-x-1">
        {hourSelect}
        <span className="text-gray-400">:</span>
        {minuteSelect}
      </div>
    </div>
  );
};

export default NewInputTimeField;
