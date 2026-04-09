export type AttachmentRequestStatus =
  | "pending"
  | "approved"
  | "semi-approved"
  | "rejected";

export interface AttachmentRequestItem {
  id: string;
  attachment_request_id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_type: string;
  file_size: number;
  file_size_formatted: string;
  status: string;
  response_notes: string | null;
  responded_by: { id: string; name: string } | null;
  responded_at: string | null;
  created_at: string;
}

export interface AttachmentRequestActor {
  id: string;
  name: string;
  email?: string;
}

export interface AttachmentRequestCompany {
  id: string;
  name: string;
  serial_number: string | null;
}

export interface AttachmentRequestProject {
  id: string;
  name: string;
  serial_number: string;
}

export interface AttachmentRequestStatistics {
  total_items: number;
  approved_items: number;
  declined_items: number;
  pending_items: number;
  update_requested_items: number;
}

export interface AttachmentRequestHistoryEntry {
  id: string;
  action: string;
  description: string;
  user?: AttachmentRequestActor | null;
  timestamp: string;
  metadata?: Record<string, unknown> | null;
}

export interface AttachmentRequest {
  id: string;
  serial_number: string;
  name: string;
  date: string;
  project_id: string;
  status: AttachmentRequestStatus;
  attachment_type_id: string | null;
  attachment_sub_type_id: string | null;
  attachment_sub_sub_type_id: string | null;
  notes: string | null;
  created_at: string;
  responded_at: string | null;
  project?: AttachmentRequestProject | null;
  sender_company?: AttachmentRequestCompany | null;
  receiver_company?: AttachmentRequestCompany | null;
  created_by?: AttachmentRequestActor | null;
  responded_by?: AttachmentRequestActor | null;
  items?: AttachmentRequestItem[];
  attachments_preview?: AttachmentRequestItem[];
  statistics?: AttachmentRequestStatistics | null;
  history?: AttachmentRequestHistoryEntry[];
}

export interface AttachmentFolder {
  id: string;
  name: string;
  parent_id: string | null;
}

export interface GetFolderChildrenResponse {
  payload: AttachmentFolder[];
}

/** Backend may return the list as `data` or `payload`. */
export interface GetOutgoingAttachmentRequestsResponse {
  data?: AttachmentRequest[];
  payload?: AttachmentRequest[];
  pagination?: {
    page: number;
    next_page: number;
    last_page: number;
    result_count: number;
  };
}

export interface GetIncomingAttachmentRequestsResponse {
  data?: AttachmentRequest[];
  payload?: AttachmentRequest[];
  pagination?: {
    page: number;
    next_page: number;
    last_page: number;
    result_count: number;
  };
}
