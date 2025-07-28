/**
 * Converts a 24-hour format time to 12-hour format
 * @param timeString Time string in "HH:MM:SS" format
 * @returns Object containing hour and AM/PM period
 */
export interface FormattedTime {
  hour: number;
  period: "AM" | "PM";
}

/**
 * Format a date string consistently for display
 * @param dateTimeString Date string in any parsable format
 * @param includeTime Whether to include time in the formatted output
 * @returns Formatted date string
 */
export function formatDateTime(dateTimeString: string | undefined | null, includeTime: boolean = true): string {
  if (!dateTimeString) return "";
  
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString; // Return original if parsing fails
    
    // Format date: DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    let result = `${day}/${month}/${year}`;
    
    // Add time if requested
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      result += ` ${hours}:${minutes}`;
    }
    
    return result;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateTimeString; // Return original string on error
  }
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
