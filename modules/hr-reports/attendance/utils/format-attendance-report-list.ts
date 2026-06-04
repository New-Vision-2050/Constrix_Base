import type {
  attendanceReport,
  attendanceReportListResponse,
} from "@/services/api/hr-reports/attendance/types/response";
import {
  extractDateRangeFromTexts,
  formatPeriodRangeLabel,
} from "./period-display";

export type ParsedAttendanceReportList = {
  items: attendanceReport[];
  totalItems: number;
  totalPages: number;
  page: number;
};

/** Reads list rows and pagination from GET `/reports`. */
export function parseAttendanceReportListResponse(
  data: attendanceReportListResponse,
): ParsedAttendanceReportList {
  const items = Array.isArray(data.payload) ? data.payload : [];
  const pagination = data.pagination;

  const totalItems =
    typeof pagination?.result_count === "number" &&
    pagination.result_count >= 0
      ? pagination.result_count
      : items.length;

  const totalPages =
    typeof pagination?.last_page === "number"
      ? Math.max(1, pagination.last_page)
      : 1;

  const page =
    typeof pagination?.page === "number" && pagination.page >= 1
      ? pagination.page
      : 1;

  return { items, totalItems, totalPages, page };
}

export function attendanceReportListTitle(
  row: attendanceReport,
  locale: string,
): string {
  const preferAr = (locale ?? "en").split("-")[0]?.toLowerCase() === "ar";
  const primary = preferAr ? row.name_ar : row.name_en;
  const fallback = preferAr ? row.name_en : row.name_ar;
  return (
    primary?.trim() ||
    fallback?.trim() ||
    row.name?.trim() ||
    row.report_types.join(" + ")
  );
}

export function attendanceReportTypesLabel(
  row: attendanceReport,
  tReportType: (id: string) => string,
): string {
  if (!row.report_types.length) return "—";
  return row.report_types.map((id) => tReportType(id) || id).join(" + ");
}

export function attendanceReportPeriodLabel(
  row: attendanceReport,
  tMonth: (key: string) => string,
  tWizard: (key: string, values?: Record<string, string | number>) => string,
): string {
  const { period_type, month, year } = row;

  if (period_type === "yearly") {
    return String(year);
  }

  if (period_type === "monthly") {
    const m = month != null ? parseInt(String(month), 10) : NaN;
    if (Number.isFinite(m) && m >= 1 && m <= 12) {
      return `${tMonth(`m${m}`)} ${year}`;
    }
    if (month?.trim()) {
      return `${month} ${year}`;
    }
    return String(year);
  }

  if (period_type === "weekly") {
    const w = tWizard("periodWeekly");
    return w ? `${year} · ${w}` : String(year);
  }

  if (period_type === "quarterly") {
    const q = month != null ? parseInt(String(month), 10) : NaN;
    const quarter = Number.isFinite(q) ? Math.ceil(q / 3) : 1;
    return tWizard("quarterYearShort", { quarter, year });
  }

  const fromName = extractDateRangeFromTexts(
    row.name_en,
    row.name_ar,
    row.name,
  );
  if (fromName) {
    return formatPeriodRangeLabel(fromName);
  }

  if (month?.trim()) {
    return `${month} ${year}`;
  }

  return String(year);
}

export function attendanceReportExportLabel(
  exportFormat: string,
  tWizard: (key: string) => string,
): string {
  const fmt = exportFormat?.toLowerCase() ?? "";
  if (fmt === "pdf") return tWizard("fmtPdf");
  if (fmt === "excel" || fmt === "xlsx") return tWizard("fmtExcel");
  if (fmt === "csv") return tWizard("fmtCsv");
  return exportFormat || "—";
}
