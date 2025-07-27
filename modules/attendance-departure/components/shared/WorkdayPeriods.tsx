import React from "react";
import PeriodField from "./PeriodField";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

// Define a type for a period
export interface PeriodType {
  id: string | number;
  label: string;
  fromValue: string;
  fromPeriod: "AM" | "PM";
  toValue: string;
  toPeriod: "AM" | "PM";
  actualHours?: number;  // Actual hours worked during this period
  deductedHours?: number; // Hours deducted from this working period
}

interface WorkdayPeriodsProps {
  title: string;
  periods: PeriodType[];
  hours: number;
  readOnly?: boolean;
}

/**
 * Component to display a workday with multiple time periods
 * Renders as a fieldset with the day title and contains multiple period components
 */
const WorkdayPeriods: React.FC<WorkdayPeriodsProps> = ({
  title,
  periods,
  hours,
  readOnly = true
}) => {
  // Use translation hook
  const t = useTranslations("AttendanceDepartureModule.WorkdayPeriods");
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const bgColor = isDarkMode ? "#0c0c1e" : "#f8fafc";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const titleTextColor = isDarkMode ? "text-white" : "text-gray-800";
  const labelTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const valueTextColor = isDarkMode ? "text-white" : "text-gray-900";
  const accentColor = isDarkMode ? "text-pink-500" : "text-pink-600";
  return (
    <div 
      className={`border rounded-md p-4 mb-4 ${borderColor}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className={`text-lg font-medium border-b pb-2 mb-3 ${titleTextColor} ${borderColor}`}>
        {title}
      </div>
      
      <div className={`text-xs mb-3 ${labelTextColor}`}>
        {t('numberOfPeriods', {default: 'عدد الفترات:'})} <span className={`font-medium ${valueTextColor}`}>{periods.length}</span>
      </div>
      
      <div className="flex flex-col gap-4">
        {periods.map((period) => (
          <PeriodField
            key={period.id}
            label={period.label}
            fromValue={period.fromValue}
            fromPeriod={period.fromPeriod}
            toValue={period.toValue}
            toPeriod={period.toPeriod}
            actualHours={period.actualHours}
            deductedHours={period.deductedHours}
            readOnly={readOnly}
          />
        ))}
      </div>

      <div className={`text-xs mb-3 ${labelTextColor}`}>
      {t('workingHours', {default: 'عدد ساعات العمل:'})} <span className={`font-medium ${accentColor}`}>{hours}</span>
      </div>
    </div>
  );
};

export default WorkdayPeriods;
