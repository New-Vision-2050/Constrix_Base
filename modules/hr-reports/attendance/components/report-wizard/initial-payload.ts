import type { ReportWizardPayload } from "./types";
import { STEP2_FILTER_UNSET } from "./constants-step2";

export function createInitialReportWizardPayload(): ReportWizardPayload {
  return {
    step1: {
      reportTypeIds: [],
      periodType: "quarterly",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      week: null,
      quarter: Math.ceil((new Date().getMonth() + 1) / 3),
      exportFormat: "pdf",
      reportLanguage: "en",
      paperSize: "A4",
      printOrientation: "landscape",
    },
    step2: {
      employeeStatus: "all",
      location: STEP2_FILTER_UNSET,
      management: STEP2_FILTER_UNSET,
      department: STEP2_FILTER_UNSET,
      jobTitle: STEP2_FILTER_UNSET,
      contractTypeIds: [],
      nationality: STEP2_FILTER_UNSET,
      gender: "all",
    },
    step3: {
      attendanceDataTypeIds: [],
      attendancePattern: "all",
      attendanceRateMin: "seventy",
      delayLimitMinutes: "five_min_or_more",
      minOvertime: "one_hour_or_more",
      includeEntryExitTime: true,
      includeShiftName: true,
      includeAttendanceNotes: true,
      calculateTotalWorkHours: true,
      showPreviousMonthComparison: true,
    },
    step4: {
      salaryComponentIds: [],
      deductionIds: [],
      disbursementStatus: "disbursed",
      netSalaryOnly: false,
      compareWithPreviousMonth: true,
      employeeDetailsSeparatePage: false,
      addTotalSummaryEnd: true,
    },
    step5: {
      mainSortBy: "department",
      sortDirection: "asc",
      groupBy: "branch",
      employeesPerPage: "50",
      visualElementIds: [],
      autoEmail: true,
      copyToManager: true,
      monthlyScheduling: false,
      companyHeaderFooter: true,
      digitalSignature: true,
      recipientEmails: "",
    },
  };
}
