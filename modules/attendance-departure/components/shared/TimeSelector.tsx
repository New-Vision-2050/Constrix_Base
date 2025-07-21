import React from "react";
import { useTheme } from "next-themes";

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
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const bgColor = isDarkMode ? "#101026" : "#f5f5f5";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const labelTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const accentBgColor = isDarkMode ? "#E91E63" : "#D81B60";
  return (
    <div className="flex flex-col items-start gap-2">
      <span className={`text-xs mx-1 ${labelTextColor}`}>{label}</span>
      <div className="flex">
        <div 
          className={`border rounded-r-md p-2 text-center w-12 ${borderColor} ${textColor}`}
          style={{ backgroundColor: bgColor }}
        >
          {readOnly ? (
            value
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onValueChange?.(e.target.value)}
              className={`bg-transparent w-full outline-none text-center ${textColor}`}
            />
          )}
        </div>
        <div 
          className="text-white p-2 rounded-l-md cursor-pointer"
          style={{ backgroundColor: accentBgColor }}
          onClick={() => !readOnly && onPeriodChange?.(period === "AM" ? "PM" : "AM")}
        >
          {period}
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
