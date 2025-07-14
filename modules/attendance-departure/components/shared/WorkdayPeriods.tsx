import React from "react";
import PeriodField from "./PeriodField";
import { useTranslations } from "next-intl";

// Define a type for a period
export interface PeriodType {
  id: string | number;
  label: string;
  fromValue: string;
  fromPeriod: "AM" | "PM";
  toValue: string;
  toPeriod: "AM" | "PM";
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
  // استخدام hook الترجمة
  const t = useTranslations("AttendanceDepartureModule.WorkdayPeriods");
  return (
    <div className="bg-[#0c0c1e] border border-gray-700 rounded-md p-4 mb-4">
      <div className="text-lg text-white font-medium border-b border-gray-700 pb-2 mb-3">
        {title}
      </div>
      
      <div className="text-xs text-gray-400 mb-3">
        {t('numberOfPeriods', {default: 'عدد الفترات:'})} <span className="text-white font-medium">{periods.length}</span>
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
            readOnly={readOnly}
          />
        ))}
      </div>

      <div className="text-xs text-gray-400 mb-3">
      {t('workingHours', {default: 'عدد ساعات العمل:'})} <span className="text-pink-500 font-medium">{hours}</span>
      </div>
    </div>
  );
};

export default WorkdayPeriods;
