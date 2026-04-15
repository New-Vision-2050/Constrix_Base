export interface IncomingAttachmentRequestsParams {
  project_id: string;
  page?: number;
  per_page?: number;
  document_type?: string;
  type?: string;
  end_date?: string;
}

export interface OutgoingAttachmentRequestsParams {
  project_id: string;
  page?: number;
  per_page?: number;
  document_type?: string;
  type?: string;
  end_date?: string;
}

/** GET `projects/attachment-requests` — unified incoming + outgoing list */
export interface AttachmentRequestsListParams {
  project_id: string;
  page?: number;
  per_page?: number;
  document_type?: string;
  /** Status filter (draft / approved / …) */
  type?: string;
  end_date?: string;
  /** Optional: restrict to incoming or outgoing rows when API supports it */
  direction?: "incoming" | "outgoing";
}

export interface CreateAttachmentRequestData {
  name: string;
  date: string;
  project_id: string;
  receiver_company_id: string;
  serial_number?: string;
  attachment_type_id?: string;
  attachment_sub_type_id?: string;
  attachment_sub_sub_type_id?: string;
  attachments: File[];
  notes?: string;
}

export interface RespondAttachmentItemPayload {
  item_id: string;
  action: "approve" | "decline";
  notes?: string;
}

/** POST `projects/attachment-requests/items/replace-media` (multipart) */
export interface ReplaceAttachmentItemMediaPayload {
  item_id: string;
  /** File field name expected by the API */
  new_file: File;
}
