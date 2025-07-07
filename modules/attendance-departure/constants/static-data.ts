export interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  employeeId: string;
  branch: string;
  department: string;
  approver: string;
  employeeStatus: string;
  attendanceStatus: "present" | "absent" | "late" | "excused";
  user: {
    id: string;
    name: string;
    birthdate: string;
    country: string;
    gender: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  clock_in_time: string;
  clock_out_time: string;
}

export const staticBranches = [
  { value: "main", label: "الفرع الرئيسي" },
  { value: "north", label: "فرع الشمال" },
  { value: "east", label: "فرع الشرق" },
];

export const staticDepartments = [
  { value: "it", label: "تكنولوجيا المعلومات" },
  { value: "hr", label: "الموارد البشرية" },
  { value: "sales", label: "المبيعات" },
  { value: "marketing", label: "التسويق" },
];

export const staticApprovers = [
  { value: "ali_hassan", label: "علي حسن" },
  { value: "sara_ibrahim", label: "سارة إبراهيم" },
];