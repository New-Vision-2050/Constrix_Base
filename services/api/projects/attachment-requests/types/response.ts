export type AttachmentRequestStatus =
  | "pending"
  | "approved"
  | "semi-approved"
  | "rejected";

export interface AttachmentRequest {
  id: string;
  serial_number: string;
  name: string;
  date: string;
  project_id: string;
  status: AttachmentRequestStatus;
  created_at: string;
  responded_at: string | null;
}

export interface AttachmentFolder {
  id: string;
  name: string;
  parent_id: string | null;
}

export interface GetFolderChildrenResponse {
  data: AttachmentFolder[];
}

export interface GetOutgoingAttachmentRequestsResponse {
  data: AttachmentRequest[];
  pagination?: {
    page: number;
    next_page: number;
    last_page: number;
    result_count: number;
  };
}
