/**
 * Converts a 24-hour format time to 12-hour format
 * @param timeString Time string in "HH:MM:SS" format
 * @returns Object containing hour and AM/PM period
 */
export interface FormattedTime {
  hour: number;
  period: "AM" | "PM";
}

export function convertTo12HourFormat(timeString: string): FormattedTime {
  // Use a fixed date to ensure conversion focuses only on the time
  const time = new Date(`2023-01-01T${timeString}`);
  
  const hour = time.getHours();
  const period = hour >= 12 ? "PM" : "AM";
  
  // Convert hour to 12-hour format
  // If hour is 0 (midnight), display as 12 AM
  // If hour > 12, subtract 12 (e.g., 13 becomes 1 PM)
  // Otherwise use the hour as is
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return {
    hour: hour12,
    period
  };
}
