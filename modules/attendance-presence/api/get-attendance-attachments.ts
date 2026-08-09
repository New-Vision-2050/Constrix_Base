import { apiClient } from "@/config/axios-config";

export interface AttachmentMedia {
  id: number | string;
  name?: string;
  url: string;
  type?: string;
}

export interface AttendanceDocuments {
  passport: string | null;
  passport_start_date: string | null;
  passport_end_date: string | null;
  file_passport: AttachmentMedia[];
  identity: string | null;
  identity_start_date: string | null;
  identity_end_date: string | null;
  file_identity: AttachmentMedia[];
  border_number: string | null;
  border_number_start_date: string | null;
  border_number_end_date: string | null;
  file_border_number: AttachmentMedia[];
  entry_number: string | null;
  entry_number_start_date: string | null;
  entry_number_end_date: string | null;
  file_entry_number: AttachmentMedia[];
  work_permit: string | null;
  work_permit_start_date: string | null;
  work_permit_end_date: string | null;
  file_work_permit: AttachmentMedia[];
  industrial_safety: string | null;
  industrial_safety_start_date: string | null;
  industrial_safety_end_date: string | null;
  file_industrial_safety: AttachmentMedia[];
}

export interface AttendanceAttachmentsPayload {
  profile: {
    image_url: string | null;
  };
  documents: AttendanceDocuments;
}

type ApiResponse = {
  data?: AttendanceAttachmentsPayload;
  payload?: AttendanceAttachmentsPayload;
  message?: string;
};

const EMPTY_PAYLOAD: AttendanceAttachmentsPayload = {
  profile: { image_url: null },
  documents: {
    passport: null,
    passport_start_date: null,
    passport_end_date: null,
    file_passport: [],
    identity: null,
    identity_start_date: null,
    identity_end_date: null,
    file_identity: [],
    border_number: null,
    border_number_start_date: null,
    border_number_end_date: null,
    file_border_number: [],
    entry_number: null,
    entry_number_start_date: null,
    entry_number_end_date: null,
    file_entry_number: [],
    work_permit: null,
    work_permit_start_date: null,
    work_permit_end_date: null,
    file_work_permit: [],
    industrial_safety: null,
    industrial_safety_start_date: null,
    industrial_safety_end_date: null,
    file_industrial_safety: [],
  },
};

export async function getAttendanceAttachments(): Promise<AttendanceAttachmentsPayload> {
  const res = await apiClient.get<ApiResponse>("/hr/attendance/attachments");
  return res.data.data ?? res.data.payload ?? EMPTY_PAYLOAD;
}

export type AttachmentKey =
  | "profile"
  | "passport"
  | "identity"
  | "border_number"
  | "entry_number"
  | "work_permit"
  | "industrial_safety";

export async function updateAttendanceAttachment(
  formData: FormData
): Promise<AttendanceAttachmentsPayload> {
  const res = await apiClient.post<ApiResponse>("/hr/attendance/attachments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data ?? res.data.payload ?? EMPTY_PAYLOAD;
}

export async function deleteAttendanceAttachmentFile(
  fileId: number | string
): Promise<void> {
  await apiClient.delete(`/media/${fileId}`);
}

/**
 * entry_number (Iqama) and work_permit documents are owned by the
 * identity-data resource (edited from User Profile > Iqama Data), not by the
 * generic /hr/attendance/attachments endpoint. Use this to update them.
 */
export async function updateIdentityDataAttachment(
  formData: FormData
): Promise<void> {
  await apiClient.post("/company-users/identity-data", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
