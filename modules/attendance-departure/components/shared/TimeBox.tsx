"use client";

import React from "react";
import { TimeBoxProps } from "../../types/attendance";
import { useTheme } from "next-themes";
import { UN_SPECIFIED } from "../../constants/static-data";

/**
 * Shared component for displaying a time box (attendance or departure)
 */
const TimeBox: React.FC<TimeBoxProps> = ({ label, time, defaultTime }) => {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const bgColor = isDarkMode ? "#101026" : "#f5f5f5";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const labelTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const valueTextColor = isDarkMode ? "text-white" : "text-gray-900";
  return (
    <div 
      className={`flex flex-col w-full border rounded-md overflow-hidden ${borderColor}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className={`text-xs p-2 pb-0 ${labelTextColor}`}>{label}</div>
      <div className={`p-3 pt-0 text-medium font-semibold ${valueTextColor}`}>
        {time || defaultTime || UN_SPECIFIED}
      </div>
    </div>
  );
};

export default TimeBox;
