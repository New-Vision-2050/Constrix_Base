"use client";

import React from "react";
import { useTheme } from "next-themes";

interface EmployeeInfoFieldProps {
  label: string;
  value?: string | number | null;
  defaultValue?: string;
  className?: string;
}

/**
 * Reusable component for displaying employee information fields with consistent styling
 */
const EmployeeInfoField: React.FC<EmployeeInfoFieldProps> = ({
  label,
  value,
  defaultValue = "-",
  className = "",
}) => {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const labelColor = isDarkMode ? "#FF3B8B" : "#D81B60";
  const valueColor = isDarkMode ? "text-white" : "text-gray-800";
  return (
    <div className={`flex gap-3 items-center ${className}`}>
      <span className="font-medium" style={{ color: labelColor }}>{label}:</span>
      <span className={valueColor}>{value || defaultValue}</span>
    </div>
  );
};

export default EmployeeInfoField;
