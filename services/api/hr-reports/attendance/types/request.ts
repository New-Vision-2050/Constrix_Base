import type {
  AttendancePatternId,
  AttendanceRateMinId,
  DelayLimitMinutesId,
  MinOvertimeId,
  ReportWizardPayload,
} from "@/modules/hr-reports/attendance/components/report-wizard/types";

/** Body for `POST /reports` and `POST /reports/templates`. */
export type CreateReportApiBody = {
  name: { ar: string; en: string };
  template_id: null;
  config: {
    step1: {
      reportTypeIds: string[];
      periodType: ReportWizardPayload["step1"]["periodType"];
      year: number;
      month: number | null;
      week: number | null;
      quarter: number | null;
      dateFrom?: string | null;
      dateTo?: string | null;
      exportFormat: ReportWizardPayload["step1"]["exportFormat"];
      reportLanguage: ReportWizardPayload["step1"]["reportLanguage"];
      paperSize: ReportWizardPayload["step1"]["paperSize"];
      printOrientation: ReportWizardPayload["step1"]["printOrientation"];
    };
    step2: {
      employee_scope: ReportWizardPayload["step2"]["employeeScope"];
      employee_user_ids: string[];
      branch_id: string | null;
      management_id: string | null;
      department: string | null;
      job_title: string | null;
      contractTypeIds: string[];
      nationality: string | null;
      gender: string | null;
    };
    step3: {
      attendanceDataTypeIds: string[];
      display_mode: ReportWizardPayload["step3"]["displayMode"];
      includeEntryExitTime: boolean;
      includeShiftName: boolean;
      includeAttendanceNotes: boolean;
      calculateTotalWorkHours: boolean;
      showPreviousMonthComparison: boolean;
      attendancePattern: AttendancePatternId;
      attendanceRateMin: AttendanceRateMinId;
      delayLimitMinutes: DelayLimitMinutesId;
      minOvertime: MinOvertimeId;
    };
  };
};
