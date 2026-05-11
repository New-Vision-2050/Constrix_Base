import type { ReportWizardPayload } from "./types";
import { STEP1_ATTENDANCE_WIZARD_REPORT_TYPE_IDS } from "./constants-step1";
import { STEP2_FILTER_UNSET } from "./constants-step2";
import { STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS } from "./constants-step3";
import { defaultCalendarMonthRange } from "./step1-date-range";

export function createInitialReportWizardPayload(): ReportWizardPayload {
  const dm = defaultCalendarMonthRange();
  return {
    step1: {
      reportTypeIds: [...STEP1_ATTENDANCE_WIZARD_REPORT_TYPE_IDS],
      periodType: "range",
      dateFrom: dm.dateFrom,
      dateTo: dm.dateTo,
      year: dm.year,
      month: dm.month,
      week: null,
      quarter: null,
      exportFormat: "pdf",
      reportLanguage: "en",
      paperSize: "A4",
      printOrientation: "landscape",
    },
    step2: {
      employeeScope: "all",
      employeeUserIds: [],
      branchId: STEP2_FILTER_UNSET,
      managementId: STEP2_FILTER_UNSET,
      department: STEP2_FILTER_UNSET,
      jobTitleId: STEP2_FILTER_UNSET,
      contractTypeIds: [],
      nationality: STEP2_FILTER_UNSET,
      gender: "all",
    },
    step3: {
      attendanceDataTypeIds: [...STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS],
      displayMode: "employee_per_page",
      includeEntryExitTime: true,
      includeShiftName: true,
      includeAttendanceNotes: true,
      calculateTotalWorkHours: true,
      showPreviousMonthComparison: true,
    },
  };
}
