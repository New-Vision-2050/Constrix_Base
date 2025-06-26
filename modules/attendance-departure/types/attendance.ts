// Attendance status record interface for attendance tables and dialogs
export interface AttendanceStatusRecord {
  id: number;
  name: string;
  date: string;
  employeeId: string;
  branch: string;
  department: string;
  approver: string;
  employeeStatus: string;
  attendanceStatus: string;
  attendanceTime?: string;
  departureTime?: string;
}
