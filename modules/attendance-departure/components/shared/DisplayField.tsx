import React from "react";

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
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div className="bg-[#101026] border border-gray-700 rounded-md p-3 text-right">
        {value || defaultValue || "غير محدد"}
      </div>
    </div>
  );
};

export default DisplayField;
