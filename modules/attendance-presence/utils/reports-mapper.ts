import { EmployeeAttendanceReportsPayload } from "@/services/api/hr-attendance-reports";
import {
  AttendanceMonthlyReportRow,
  AttendanceReportStatus,
  ContractSummaryCardData,
} from "../types/reports";
import { CONTRACT_SUMMARY_CARDS_CONFIG } from "../constants/reports-cards-config";

function normalizeStatus(status: string): AttendanceReportStatus {
  if (status === "approved" || status === "pending" || status === "rejected") {
    return status;
  }

  return "pending";
}

export function parseApiReportMonth(monthLabel: string) {
  const parsed = new Date(`${monthLabel} 1`);

  if (Number.isNaN(parsed.getTime())) {
    return { month: 1, year: new Date().getFullYear() };
  }

  return {
    month: parsed.getMonth() + 1,
    year: parsed.getFullYear(),
  };
}

export function mapMonthlyReports(
  payload: EmployeeAttendanceReportsPayload,
): AttendanceMonthlyReportRow[] {
  return payload.monthly_reports.data.map((row, index) => {
    const { month, year } = parseApiReportMonth(row.month);

    return {
      id: `${year}-${month}-${index}`,
      month,
      year,
      monthDays: row.days_in_month,
      requiredAttendance: row.required_attendance_days,
      accruedLeaves: row.leave_balance_used,
      monthHolidays: row.month_holidays,
      requiredHours: row.required_hours,
      achievedAttendance: row.actual_attendance_days,
      usedLeaves: row.used_leaves,
      leaveBalance: row.remaining_leave_balance,
      achievedHours: row.actual_worked_hours,
      delays: row.delays,
      overtime: row.overtime,
      deductions: 0,
      status: normalizeStatus(row.status),
    };
  });
}

function getContractMetricValue(
  payload: EmployeeAttendanceReportsPayload,
  cardKey: string,
  metricKey: string,
): string | number {
  switch (cardKey) {
    case "contract":
      if (metricKey === "attendance-days") {
        return payload.contract.attendance_days;
      }
      if (metricKey === "leaves") {
        return payload.contract.leave_allowance;
      }
      if (metricKey === "holidays") {
        return 0;
      }
      if (metricKey === "required-hours") {
        return payload.contract.required_hours;
      }
      break;
    case "achieved":
      if (metricKey === "attendance-days") {
        return payload.achieved.attendance_days;
      }
      if (metricKey === "leaves") {
        return payload.achieved.used_leaves;
      }
      if (metricKey === "holidays") {
        return payload.achieved.used_holidays;
      }
      if (metricKey === "hours") {
        return payload.achieved.worked_hours;
      }
      break;
    case "remaining":
      if (metricKey === "attendance-days") {
        return payload.remaining.attendance_days;
      }
      if (metricKey === "leaves") {
        return payload.remaining.remaining_leaves;
      }
      if (metricKey === "holidays") {
        return 0;
      }
      if (metricKey === "hours") {
        return payload.remaining.worked_hours;
      }
      break;
    default:
      break;
  }

  return 0;
}

export function mapContractSummaryCards(
  payload: EmployeeAttendanceReportsPayload,
): ContractSummaryCardData[] {
  return CONTRACT_SUMMARY_CARDS_CONFIG.map((card) => ({
    ...card,
    metrics: card.metrics.map((metric) => ({
      ...metric,
      value: getContractMetricValue(payload, card.key, metric.key),
    })),
  }));
}
