import React from "react";
import { useTheme } from "next-themes";
import { UN_SPECIFIED } from "../../constants/static-data";

interface DisplayFieldProps {
  label: string;
  value: string;
  defaultValue?: string;
}

/**
 * Reusable display field component with label and formatted display area
 */
const DisplayField: React.FC<DisplayFieldProps> = ({ 
  label, 
  value, 
  defaultValue
}) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  

  const labelColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const bgColor = isDarkMode ? "#101026" : "#f5f5f5";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  return (
    <div className="flex flex-col gap-1">
      <label className={`text-xs ${labelColor}`}>{label}</label>
      <div 
        className={`border rounded-md p-3 text-right ${borderColor} ${textColor}`}
        style={{ backgroundColor: bgColor }}
      >
        {value || defaultValue || `${label} ${UN_SPECIFIED}`}
      </div>
    </div>
  );
};

export default DisplayField;
