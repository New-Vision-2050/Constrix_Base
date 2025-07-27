"use client";

import React from "react";
import { useTheme } from "next-themes";

// Theme colors as constants for better maintainability
const COLORS = {
  DARK: {
    LABEL: '#FF3B8B',
    VALUE: 'text-white',
  },
  LIGHT: {
    LABEL: '#D81B60',
    VALUE: 'text-gray-800',
  }
};

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
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  

  const labelColor = isDarkMode ? COLORS.DARK.LABEL : COLORS.LIGHT.LABEL;
  const valueColor = isDarkMode ? COLORS.DARK.VALUE : COLORS.LIGHT.VALUE;
  return (
    <div className={`flex gap-3 items-center ${className}`}>
      <span className="font-medium" style={{ color: labelColor }}>{label}:</span>
      <span className={valueColor}>{value || defaultValue}</span>
    </div>
  );
};

export default EmployeeInfoField;
