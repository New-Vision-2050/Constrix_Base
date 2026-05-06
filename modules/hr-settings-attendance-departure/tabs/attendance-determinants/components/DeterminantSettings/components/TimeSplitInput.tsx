"use client";

import { Clock3 } from "lucide-react";

interface TimeSplitInputProps {
  label: string;
  timeValue: string;
  meridiem: "AM" | "PM";
  placeholder: string;
  onTimeChange: (value: string) => void;
  onMeridiemChange: (value: "AM" | "PM") => void;
}

export default function TimeSplitInput({
  label,
  timeValue,
  meridiem,
  placeholder,
  onTimeChange,
  onMeridiemChange,
}: TimeSplitInputProps) {
  return (
    <div>
      <label className="text-xs text-muted-foreground block mb-1">{label}</label>
      <div className="h-10 rounded-md border border-input overflow-hidden flex">
        <div className="flex-1 bg-background px-2 flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={timeValue}
            onChange={(event) => onTimeChange(event.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <select
          value={meridiem}
          onChange={(event) => onMeridiemChange(event.target.value as "AM" | "PM")}
          className="w-16 bg-primary text-primary-foreground text-sm text-center focus:outline-none"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
