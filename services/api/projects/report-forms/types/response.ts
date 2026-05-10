export interface ReportFormPayload {
  id: number;
  project_type_id: number;
  project_sharing_work_order_id: number;
  name: string;
  question: string;
  value: string;
  number_of_attachments: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListReportFormsResponse {
  code: string;
  message: string | null;
  payload: ReportFormPayload[];
}

export interface GetReportFormResponse {
  code: string;
  message: string | null;
  payload: ReportFormPayload;
}

export interface MutateReportFormResponse {
  code: string;
  message: string | null;
  payload?: ReportFormPayload;
}
