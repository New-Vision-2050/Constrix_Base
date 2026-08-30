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
  project_id?: string;
  contractual_engagement_key?: string;
  page?: number;
  per_page?: number;
  document_type?: string;
  /** Document type / procedure filter */
  procedure_setting_id?: string;
  /** Status filter (draft / approved / …) */
  type?: string;
  end_date?: string;
  /** Optional: restrict to incoming or outgoing rows when API supports it */
  direction?: "incoming" | "outgoing";
  receiver_id?: string;
  /** Filter by receiver company ids (`receiver_company_ids[]`) */
  receiver_company_ids?: string[];
  name?: string;
}

export interface CreateAttachmentRequestData {
  name: string;
  date: string;
  project_id: string;
  receiver_company_id?: string;
  serial_number?: string;
  procedure_setting_id?: string;
  attachment_sub_type_id?: string;
  attachment_sub_sub_type_id?: string;
  /** Small files sent directly as multipart. */
  attachments?: File[];
  /** Tokens returned from the completed chunked-upload flow for large files. */
  attachment_upload_ids?: string[];
  notes?: string;
}

export interface RespondAttachmentItemPayload {
  item_id: string;
  action: "approve" | "decline";
  notes?: string;
}

/** POST `projects/attachment-requests/items/replace-media` */
export type ReplaceAttachmentItemMediaPayload =
  | { item_id: string; new_file: File; upload_id?: never }
  | { item_id: string; upload_id: string; new_file?: never };

/* ── Chunked (resumable) upload session types ───────────────────────────── */

export type ChunkedUploadStatus = "pending" | "completed" | "aborted";

export interface ChunkedUploadSession {
  upload_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  total_chunks: number;
  received_chunks: number[];
  status: ChunkedUploadStatus;
}

export interface InitChunkedUploadParams {
  file_name: string;
  file_size: number;
  total_chunks: number;
  mime_type: string;
}

export interface CompletedChunkedUpload {
  upload_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
}
