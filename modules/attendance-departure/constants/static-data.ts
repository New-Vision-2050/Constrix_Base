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
  location: {
    lat: number;
    lng: number;
  };
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

export const staticAttendanceData: AttendanceRecord[] = [
  {
    id: 1,
    name: "أحمد محمود",
    date: "2024-06-25",
    employeeId: "EMP-001",
    branch: "فرع الرياض",
    department: "إدارة الموارد البشرية",
    approver: "علي حسن",
    employeeStatus: "نشط",
    attendanceStatus: "absent",
    location: { lat: 24.7136, lng: 46.6753 },
  },
  {
    id: 2,
    name: "فاطمة الزهراء",
    date: "2024-06-25",
    employeeId: "EMP-002",
    branch: "فرع جدة",
    department: "المبيعات",
    approver: "سارة إبراهيم",
    employeeStatus: "نشط",
    attendanceStatus: "present",
    location: { lat: 21.4858, lng: 39.1925 },
  },
  {
    id: 3,
    name: "علياء منصور",
    date: "2024-06-25",
    employeeId: "EMP-003",
    branch: "فرع الدمام",
    department: "التسويق",
    approver: "علي حسن",
    employeeStatus: "في إجازة",
    attendanceStatus: "late",
    location: { lat: 26.4207, lng: 50.0888 },
  },
  {
    id: 4,
    name: "خالد الغامدي",
    date: "2024-06-25",
    employeeId: "EMP-004",
    branch: "فرع الرياض",
    department: "تكنولوجيا المعلومات",
    approver: "سارة إبراهيم",
    employeeStatus: "نشط",
    attendanceStatus: "excused",
    location: { lat: 24.7742, lng: 46.7386 },
  },
  {
    id: 5,
    name: "نورة عبد العزيز",
    date: "2024-06-25",
    employeeId: "EMP-005",
    branch: "فرع جدة",
    department: "الموارد البشرية",
    approver: "علي حسن",
    employeeStatus: "نشط",
    attendanceStatus: "present",
    location: { lat: 21.5433, lng: 39.1728 },
  },
];
