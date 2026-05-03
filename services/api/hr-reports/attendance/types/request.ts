import type { ReportWizardPayload } from "@/modules/hr-reports/attendance/components/report-wizard/types";

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
      exportFormat: ReportWizardPayload["step1"]["exportFormat"];
      reportLanguage: ReportWizardPayload["step1"]["reportLanguage"];
      paperSize: ReportWizardPayload["step1"]["paperSize"];
      printOrientation: ReportWizardPayload["step1"]["printOrientation"];
    };
    step2: {
      employeeStatus: ReportWizardPayload["step2"]["employeeStatus"];
      location: string | null;
      management: string | null;
      department: string | null;
      jobTitle: string | null;
      contractTypeIds: string[];
      nationality: string | null;
      gender: string | null;
    };
    step3: ReportWizardPayload["step3"];
    step4: ReportWizardPayload["step4"];
    step5: ReportWizardPayload["step5"];
  };
};
