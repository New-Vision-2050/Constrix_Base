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

// Props for the TimeBox component
export interface TimeBoxProps {
  label: string;
  time: string | undefined;
  defaultTime?: string;
}

// Props for the DialogContainer component
export interface DialogContainerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

// Props for the EmployeeInfoSection component
export interface EmployeeInfoSectionProps {
  record: AttendanceStatusRecord;
}

// Props for the AttendanceStatusBadge component
export interface AttendanceStatusBadgeProps {
  status: string;
  record: AttendanceStatusRecord;
}

// Props for the ApproverBadge component
export interface ApproverBadgeProps {
  approver: string;
  record: AttendanceStatusRecord;
}
