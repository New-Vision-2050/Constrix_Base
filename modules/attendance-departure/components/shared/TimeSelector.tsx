import React from "react";

interface TimeSelectorProps {
  label: string;
  value: string;
  period: "AM" | "PM";
  onValueChange?: (value: string) => void;
  onPeriodChange?: (period: "AM" | "PM") => void;
  readOnly?: boolean;
}

/**
 * Reusable time selector component with hour input and AM/PM toggle
 */
const TimeSelector: React.FC<TimeSelectorProps> = ({
  label,
  value,
  period,
  onValueChange,
  onPeriodChange,
  readOnly = true
}) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs mx-1">{label}</span>
      <div className="flex">
        <div className="bg-[#101026] border border-gray-700 rounded-r-md p-2 text-center w-12">
          {readOnly ? (
            value
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onValueChange?.(e.target.value)}
              className="bg-transparent w-full outline-none text-center"
            />
          )}
        </div>
        <div 
          className="bg-[#E91E63] text-white p-2 rounded-l-md cursor-pointer"
          onClick={() => !readOnly && onPeriodChange?.(period === "AM" ? "PM" : "AM")}
        >
          {period}
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
