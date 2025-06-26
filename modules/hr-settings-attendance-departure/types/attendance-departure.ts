/**
 * HR Settings Attendance & Departure module type definitions
 */

// Attendance Determinant type
export interface DeterminantDetails {
  title: string;
  systemType: string;
  systemStatus: string;
  workHours: number;
  workDays: string[];
  branches: string[];
}

export interface AttendanceDeterminant {
  id: string;
  name: string;
  location: string;
  status: boolean;
  active?: boolean;
  details?: DeterminantDetails;
}
