/**
 * HR Settings Attendance & Departure module type definitions
 */

// Attendance Determinant type
export interface AttendanceDeterminant {
  id: string;
  name: string;
  location: string;
  status: boolean;
  active?: boolean;
}
