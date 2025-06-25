interface AttendanceRecord {
    id: number;
    name: string;
    date: string;
    employeeId: string;
    branch: string;
    department: string;
    approver: string;
    employeeStatus: string;
    attendanceStatus: string;
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
      branch: "الفرع الرئيسي",
      department: "تكنولوجيا المعلومات",
      approver: "علي حسن",
      employeeStatus: "نشط",
      attendanceStatus: "present",
    },
    {
      id: 2,
      name: "فاطمة الزهراء",
      date: "2024-06-25",
      employeeId: "EMP-002",
      branch: "فرع الشمال",
      department: "الموارد البشرية",
      approver: "علي حسن",
      employeeStatus: "نشط",
      attendanceStatus: "absent",
    },
    {
      id: 3,
      name: "محمد عبدالله",
      date: "2024-06-25",
      employeeId: "EMP-003",
      branch: "الفرع الرئيسي",
      department: "المبيعات",
      approver: "سارة إبراهيم",
      employeeStatus: "نشط",
      attendanceStatus: "late",
    },
    {
      id: 4,
      name: "سارة علي",
      date: "2024-06-25",
      employeeId: "EMP-004",
      branch: "فرع الشرق",
      department: "التسويق",
      approver: "سارة إبراهيم",
      employeeStatus: "في إجازة",
      attendanceStatus: "excused",
    },
      {
      id: 5,
      name: "خالد وليد",
      date: "2024-06-25",
      employeeId: "EMP-005",
      branch: "الفرع الرئيسي",
      department: "تكنولوجيا المعلومات",
      approver: "علي حسن",
      employeeStatus: "نشط",
      attendanceStatus: "present",
    },
  ];
