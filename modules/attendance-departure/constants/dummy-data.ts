/**
 * Dummy data used for development and testing purposes
 * This will be replaced with real API data in production
 */
import { InputPeriodType } from "../types/attendance";

/**
 * Standard work periods dummy data
 * Representing a typical workday with morning and afternoon shifts
 */
export const DUMMY_WORK_PERIODS: InputPeriodType[] = [
  { start_time: "09:00", end_time: "12:00" }, // Morning period
  { start_time: "13:00", end_time: "17:00" }  // Afternoon period
];
