export interface CreateReportFormPayload {
  project_type_id: number;
  project_sharing_work_order_id: number;
  name: string;
  question: string;
  value: string;
  number_of_attachments: string;
  notes: string | null;
}

export interface UpdateReportFormPayload {
  name: string;
  question: string;
  value: string;
  number_of_attachments: string;
  notes: string | null;
}
