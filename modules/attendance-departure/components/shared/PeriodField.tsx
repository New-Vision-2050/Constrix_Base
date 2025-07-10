import React from "react";
import { usePathname } from "next/navigation";
import TimeSelector from "./TimeSelector";

interface PeriodFieldProps {
  label: string;
  fromValue: string;
  fromPeriod: "AM" | "PM";
  toValue: string;
  toPeriod: "AM" | "PM";
  onFromValueChange?: (value: string) => void;
  onFromPeriodChange?: (period: "AM" | "PM") => void;
  onToValueChange?: (value: string) => void;
  onToPeriodChange?: (period: "AM" | "PM") => void;
  readOnly?: boolean;
}

/**
 * A fieldset-like component for displaying a time period with from and to times
 */
const PeriodField: React.FC<PeriodFieldProps> = ({
  label,
  fromValue,
  fromPeriod,
  toValue,
  toPeriod,
  onFromValueChange,
  onFromPeriodChange,
  onToValueChange,
  onToPeriodChange,
  readOnly = true
}) => {
  const pathname = usePathname();
  
  // Determine direction based on URL path
  // If URL contains /ar/ or starts with /ar, it's Arabic (RTL)
  const isLTR = pathname?.includes('/en/') || pathname?.startsWith('/en');
  const arrowDirection = isLTR ? '→' : '←';

  return (
    <div className="bg-[#0c0c1e] border border-gray-700 rounded-md p-3">
      <div className="text-xs text-gray-400 mb-2 border-b border-gray-700 pb-2">{label}</div>
      <div className="flex justify-around items-center">
        <TimeSelector
          label="من"
          value={fromValue}
          period={fromPeriod}
          onValueChange={onFromValueChange}
          onPeriodChange={onFromPeriodChange}
          readOnly={readOnly}
        />
        <div className="text-[#E91E63] font-bold">{arrowDirection}</div>
        <TimeSelector
          label="إلى"
          value={toValue}
          period={toPeriod}
          onValueChange={onToValueChange}
          onPeriodChange={onToPeriodChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default PeriodField;
