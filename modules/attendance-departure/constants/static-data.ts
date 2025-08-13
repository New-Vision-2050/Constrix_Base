export interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  employeeId: string;
  branch: string;
  department: string;
  approver: string;
  employeeStatus: string;
  is_late: number;
  is_absent: number;
  is_holiday: number;
  status: string;
  attendanceStatus: "present" | "absent" | "late" | "excused";
  user: {
    id: string;
    name: string;
    birthdate: string;
    country: string;
    gender: string;
    email: string;
    phone: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  clock_in_time: string;
  clock_out_time: string;
}

export const UN_SPECIFIED = "غير محدد";