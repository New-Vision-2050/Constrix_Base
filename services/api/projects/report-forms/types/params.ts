export interface CreateReportFormPayload {
  project_type_id: number;
  order_permit_procedure_id: number;
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
