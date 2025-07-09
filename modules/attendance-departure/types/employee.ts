// Employee details interface for attendance map
export interface EmployeeDetails {
  id: string;
  name: string;
  phone: string;
  department: string;
  email: string;
  branch: string;
  gender: string;
  birthDate: string;
  nationality: string;
  attendanceStatus: string;
  employeeStatus: string;
  checkInTime?: string;
  checkOutTime?: string;
  avatarUrl?: string;
  clock_in_time?: string;
  clock_out_time?: string;
}

// Employee details component props interface
export interface EmployeeDetailsProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  employee: EmployeeDetails | null;
}
