"use client";

import { useState, useEffect, useMemo } from "react";
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

const NewInputTimeField = ({
  value,
  period,
  onChange,
  type,
  label,
  disabled = false,
}: TimeFieldProps) => {
  // context
  const { dayAvsilableHours, isEdit, minEdgeInNextDay } = useAttendanceDayCxt();
  const [selectedHour, setSelectedHour] = useState<string>(
    value?.split(":")[0] || ""
  );
  const [selectedMinute, setSelectedMinute] = useState<string>(
    value?.split(":")[1] || ""
  );

  const _dayAvsilableHours = useMemo(() => {
    if (type !== "end" || !period.start_time) return dayAvsilableHours;

    let foundUnavailable = false;
    const startHour = parseInt(period.start_time?.split(":")[0]);

    return dayAvsilableHours?.map((hour) => {
      const currentHour = parseInt(hour.value);

      if (type === "end" && period?.extends_to_next_day) {
        if(minEdgeInNextDay){
          const _minEdgeInNextDay = convertStringToMinutes(minEdgeInNextDay);
          
          if(Number(hour.value) > Number(_minEdgeInNextDay/60)){
            return { ...hour, available: false };
          }
        }
        return { ...hour, available: true };
      }

      if (!hour.available) {
        if (currentHour >= startHour) foundUnavailable = true;
        return hour;
      }

      return {
        ...hour,
        available: currentHour > startHour && !foundUnavailable,
      };
    });
  }, [type, dayAvsilableHours, period.start_time]);

  // Cuando cambia la hora o el minuto, actualizar el valor
  useEffect(() => {
    if (selectedHour && selectedMinute) {
      const newTimeValue = `${selectedHour.padStart(2, "0")}:${selectedMinute}`;
      if (newTimeValue !== value) {
        onChange(newTimeValue);
      }
    }
  }, [selectedHour, selectedMinute, onChange, value]);

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
        {dayAvsilableHours
          ?.filter((el) => el.value === selectedHour)?.[0]
          ?.minutes?.map((minute) => (
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

  if (!isEdit)
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

  // edit view
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm text-gray-400">{label}</label>}
      <div className="flex items-center space-x-1">{value}</div>
    </div>
  );
};

export default NewInputTimeField;
