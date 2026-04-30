/** API `config.step1.reportTypeIds` values (wizard checkboxes). */
export type ReportTypeId =
  | "attendance_absence"
  | "leaves"
  | "overtime"
  | "monthly_performance"
  | "salaries"
  | "lateness"
  | "deductions"
  | "branches_comparison";

export type EmployeeStatusFilter =
  | "all"
  | "active"
  | "inactive"
  | "on_leave"
  | "dismissed";

/** Contract / employment type checkbox ids (step 2). */
export type EmployeeContractTypeId =
  | "full_time"
  | "part_time"
  | "temporary"
  | "intern"
  | "external_consultant"
  | "seasonal";

export type ReportWizardStep2 = {
  employeeStatus: EmployeeStatusFilter;
  location: string;
  management: string;
  department: string;
  jobTitle: string;
  contractTypeIds: EmployeeContractTypeId[];
  nationality: string;
  gender: string;
};

/** Attendance metric row ids (step 3, section 1). */
export type AttendanceDataTypeId =
  | "attendance_days"
  | "delays"
  | "taken_leaves"
  | "unpaid_leave"
  | "absence_days"
  | "overtime"
  | "sick_leaves"
  | "early_departure";

/** API `config.step3.attendanceRateMin` — backend `ATT_RATE_*`. */
export type AttendanceRateMinId =
  | "no_filter"
  | "fifty"
  | "seventy"
  | "ninety";

/** Backend `ATT_PATTERN_*`. */
export type AttendancePatternId =
  | "all"
  | "absentees_only"
  | "late_only"
  | "overtime_only"
  | "present_only";

/** Backend `DELAY_*`. */
export type DelayLimitMinutesId =
  | "no_filter"
  | "five_min_or_more"
  | "fifteen_min_or_more"
  | "thirty_min_or_more"
  | "sixty_min_or_more";

/** Backend `OT_*`. */
export type MinOvertimeId =
  | "no_filter"
  | "half_hour_or_more"
  | "one_hour_or_more"
  | "two_hours_or_more"
  | "four_hours_or_more";

export type ReportWizardStep3 = {
  attendanceDataTypeIds: AttendanceDataTypeId[];
  attendancePattern: AttendancePatternId;
  attendanceRateMin: AttendanceRateMinId;
  delayLimitMinutes: DelayLimitMinutesId;
  minOvertime: MinOvertimeId;
  includeEntryExitTime: boolean;
  includeShiftName: boolean;
  includeAttendanceNotes: boolean;
  calculateTotalWorkHours: boolean;
  showPreviousMonthComparison: boolean;
};

/** Salary component checkbox ids (step 4, section 1). */
export type SalaryComponentId =
  | "basic_salary"
  | "transportation"
  | "phone"
  | "overtime_allowance"
  | "housing"
  | "food"
  | "representation"
  | "bonuses";

/** Deduction checkbox ids (step 4, section 2). */
export type SalaryDeductionId =
  | "absence_deduction"
  | "social_insurance"
  | "disciplinary"
  | "delay_deduction"
  | "advances_loans"
  | "income_tax";

export type SalaryDisbursementStatus =
  | "all"
  | "disbursed"
  | "pending_approval"
  | "suspended";

export type ReportWizardStep4 = {
  salaryComponentIds: SalaryComponentId[];
  deductionIds: SalaryDeductionId[];
  disbursementStatus: SalaryDisbursementStatus;
  netSalaryOnly: boolean;
  compareWithPreviousMonth: boolean;
  employeeDetailsSeparatePage: boolean;
  addTotalSummaryEnd: boolean;
};

/** Chart / visual element ids (step 5, section 2). */
export type VisualElementId =
  | "attendance_pct_chart"
  | "weekly_delays_chart"
  | "executive_summary_table"
  | "salary_distribution_chart"
  | "branch_comparison_chart"
  | "attendance_heatmap";

/** Backend `SORT_BY_*`. */
export type ReportMainSortById =
  | "employee_name_alpha"
  | "employee_code"
  | "department"
  | "branch"
  | "job_title"
  | "hire_date";

export type ReportSortDirectionId = "asc" | "desc";

/** Backend `GROUP_BY_*`. */
export type ReportGroupById =
  | "none"
  | "branch"
  | "department"
  | "management"
  | "job_title";

export type ReportEmployeesPerPageId = "10" | "25" | "50" | "100";

export type ReportWizardStep5 = {
  mainSortBy: ReportMainSortById;
  sortDirection: ReportSortDirectionId;
  groupBy: ReportGroupById;
  employeesPerPage: ReportEmployeesPerPageId;
  visualElementIds: VisualElementId[];
  autoEmail: boolean;
  copyToManager: boolean;
  monthlyScheduling: boolean;
  companyHeaderFooter: boolean;
  digitalSignature: boolean;
  recipientEmails: string;
};

export type ReportWizardStep1 = {
  /** Selected report type option ids (checkboxes). */
  reportTypeIds: ReportTypeId[];
  periodType: ReportPeriodType;
  year: number;
  /** 1–12; used for monthly period and as fallback for quarterly/week derivation. */
  month: number;
  /** ISO-style week when `periodType` is `weekly` (backend field). */
  week?: number | null;
  /** 1–4 when `periodType` is `quarterly`; if omitted, derived from `month`. */
  quarter?: number | null;
  exportFormat: ReportExportFormat;
  reportLanguage: ReportLanguage;
  paperSize: ReportPaperSize;
  printOrientation: ReportPrintOrientation;
};

export type ReportPeriodType =
  | "monthly"
  | "weekly"
  | "quarterly"
  | "yearly";

export type ReportExportFormat = "pdf" | "excel" | "csv";

export type ReportLanguage = "ar" | "en";

export type ReportPaperSize = "A4" | "Letter" | "A3";

export type ReportPrintOrientation = "portrait" | "landscape";

/** Single payload collected across all wizard steps (final submit). */
export type ReportWizardPayload = {
  step1: ReportWizardStep1;
  step2: ReportWizardStep2;
  step3: ReportWizardStep3;
  step4: ReportWizardStep4;
  step5: ReportWizardStep5;
};
