/**
 * Helper functions for working with work periods data
 */
import { PeriodType } from "../components/shared/WorkdayPeriods";
import { InputPeriodType } from "../types/attendance";
import { convertTo12HourFormat } from "./time-helpers";

/**
 * Converts InputPeriodType array to PeriodType format required by WorkdayPeriods component
 * Applies time format conversion and proper labeling
 * 
 * @param periods Raw periods data in simple time format
 * @param getTranslation Translation function to use for labels
 * @returns Formatted periods data for display
 */
/**
 * Converts InputPeriodType array to PeriodType format with optional actual and deducted hours
 * 
 * @param periods Raw periods data in simple time format
 * @param getTranslation Translation function to use for labels
 * @param actualHoursData Optional array of actual hours worked for each period
 * @param deductedHoursData Optional array of deducted hours for each period
 * @returns Formatted periods data for display
 */
export const convertToPeriodType = (
  periods: InputPeriodType[],
  getTranslation: (key: string, options?: { default: string }) => string,
  actualHoursData?: number[],
  deductedHoursData?: number[]
): PeriodType[] => {
  return periods.map((period, index) => {
    // Use helper function for time conversion
    const startFormat = convertTo12HourFormat(period.start_time);
    const endFormat = convertTo12HourFormat(period.end_time);

    return {
      id: index + 1,
      label: `${getTranslation("period")} ${index + 1}`,
      fromValue: startFormat.hour.toString(),
      fromPeriod: startFormat.period,
      toValue: endFormat.hour.toString(),
      toPeriod: endFormat.period,
      actualHours: actualHoursData ? actualHoursData[index] : undefined,
      deductedHours: deductedHoursData ? deductedHoursData[index] : undefined,
    };
  });
};

/**
 * Calculate total working hours from periods array
 * 
 * @param periods Array of work periods
 * @returns Total hours worked
 */
export const calculateTotalHours = (periods: InputPeriodType[]): number => {
  return periods.reduce((totalHours, period) => {
    const startHour = parseInt(period.start_time.split(":")[0], 10);
    const startMinute = parseInt(period.start_time.split(":")[1], 10);
    
    const endHour = parseInt(period.end_time.split(":")[0], 10);
    const endMinute = parseInt(period.end_time.split(":")[1], 10);
    
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;
    
    const periodHours = (endTimeMinutes - startTimeMinutes) / 60;
    
    return totalHours + periodHours;
  }, 0);
};
