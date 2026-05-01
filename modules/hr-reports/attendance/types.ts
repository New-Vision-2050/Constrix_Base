export type AttendanceReportStatus = "present" | "late" | "absent";

export type AttendanceReportRow = {
  id: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  status: AttendanceReportStatus;
};

export type { CreatedAttendanceReport } from "@/services/api/hr-reports/attendance";
