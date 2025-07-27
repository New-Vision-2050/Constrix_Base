/**
 * Formats a number of minutes into hours and minutes format (e.g. "2h 30m")
 * @param minutes Total minutes to format
 * @returns Formatted string in hours and minutes
 */
export const formatMinutesToHoursAndMinutes = (minutes: number): string => {
  if (!minutes && minutes !== 0) return '-';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
};

/**
 * Calculates the total hours and minutes between two time points in a timeRange string
 * Format example: "2025-07-27 09:00 - 2025-07-27 14:30"
 * @param timeRangeString The time range string to parse
 * @returns Total hours and minutes in "2h 30m" format
 */
export const calculateHoursFromTimeRange = (timeRangeString: string): string => {
  // Handle special case for "total_hours"
  if (timeRangeString === 'total_hours') {
    return '';
  }
  
  try {
    // Split the string by the dash separator
    const parts = timeRangeString.split(' - ');
    
    if (parts.length !== 2) {
      console.error('Invalid time range format:', timeRangeString);
      return '-';
    }

    // Parse using regular expressions to handle potential format issues
    const parseTimeString = (timeStr: string) => {
      // Regular expression to match date and time: YYYY-MM-DD HH:MM
      const match = timeStr.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})$/);
      
      if (!match) {
        throw new Error(`Invalid time format: ${timeStr}`);
      }
      
      const [_, dateStr, hourStr, minuteStr] = match;
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      
      // Create date object
      const date = new Date(dateStr);
      date.setHours(hour, minute, 0, 0);
      
      return date;
    };
    
    // Parse the start and end times
    const startDateTime = parseTimeString(parts[0]);
    const endDateTime = parseTimeString(parts[1]);
    
    // Make sure end time is not before start time (handle 24-hour format issues)
    let diffMs = endDateTime.getTime() - startDateTime.getTime();
    
    // If the difference is negative, it could mean the end time is in the next day
    if (diffMs < 0) {
      console.warn('End time appears to be before start time, adjusting:', timeRangeString);
      // For now, let's assume that no shift is more than 12 hours
      // So if diffMs is negative, we'll assume the intended time is within 12 hours
      diffMs = Math.abs(diffMs);
    }
    
    // Convert to minutes
    const minutes = Math.floor(diffMs / 60000);
    
    return formatMinutesToHoursAndMinutes(minutes);
  } catch (error) {
    console.error('Error parsing time range:', timeRangeString, error);
    return '-';
  }
};
