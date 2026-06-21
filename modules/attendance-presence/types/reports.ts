import { LucideIcon } from "lucide-react";

export type AttendanceReportStatus = "approved" | "pending" | "rejected";

export interface AttendanceMonthlyReportRow {
  id: string;
  month: number;
  year: number;
  monthDays: number;
  requiredAttendance: number;
  accruedLeaves: number;
  monthHolidays: number;
  requiredHours: number;
  achievedAttendance: number;
  usedLeaves: number;
  leaveBalance: number;
  achievedHours: number;
  delays: number;
  overtime: number;
  deductions: number;
  status: AttendanceReportStatus;
}

export interface ContractMetricItem {
  key: string;
  labelKey: string;
  value: string | number;
  unitKey: string;
  icon: LucideIcon;
}

export interface ContractSummaryCardData {
  key: string;
  titleKey: string;
  icon: LucideIcon;
  metrics: ContractMetricItem[];
}
