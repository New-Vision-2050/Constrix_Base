"use client";

import React from "react";

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
  return (
    <div className={`flex gap-3 items-center ${className}`}>
      <span className="text-[#FF3B8B] font-medium">{label}:</span>
      <span>{value || defaultValue}</span>
    </div>
  );
};

export default EmployeeInfoField;
