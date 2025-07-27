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
