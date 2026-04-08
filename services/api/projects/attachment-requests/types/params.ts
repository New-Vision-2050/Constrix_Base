export interface OutgoingAttachmentRequestsParams {
  project_id: string;
  page?: number;
  per_page?: number;
  document_type?: string;
  type?: string;
  end_date?: string;
}

export interface CreateAttachmentRequestData {
  name: string;
  date: string;
  project_id: string;
  receiver_company_id: string;
  attachment_type_id?: string;
  attachment_sub_type_id?: string;
  attachment_sub_sub_type_id?: string;
  attachments: File[];
  notes?: string;
}
