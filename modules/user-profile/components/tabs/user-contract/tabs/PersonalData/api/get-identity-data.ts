import { apiClient } from "@/config/axios-config";
import { MediaFile } from "@/types/media-file";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import {
  getAttendanceAttachments,
  AttachmentMedia,
} from "@/modules/attendance-presence/api/get-attendance-attachments";

export type UserIdentityInformationT = {
  border_number: string;
  entry_number: string;
  file_border_number: MediaFile[];
  file_entry_number: MediaFile[];
  file_identity: MediaFile[];
  file_passport: MediaFile[];
  identity: string;
  passport: string;
  passport_start_date: string;
  identity_start_date: string;
  border_number_start_date: string;
  entry_number_start_date: string;
  passport_end_date: string;
  identity_end_date: string;
  border_number_end_date: string;
  entry_number_end_date: string;
  work_permit: string;
  work_permit_start_date: string;
  work_permit_end_date: string;
  file_work_permit: MediaFile[];
};

type ResponseT = {
  code: string;
  message: string;
  payload: UserIdentityInformationT;
};

/** Keys the attendance-attachments store shares with the identity-data store. */
const SHARED_DOC_KEYS = [
  "passport", "passport_start_date", "passport_end_date", "file_passport",
  "identity", "identity_start_date", "identity_end_date", "file_identity",
  "border_number", "border_number_start_date", "border_number_end_date", "file_border_number",
  "entry_number", "entry_number_start_date", "entry_number_end_date", "file_entry_number",
  "work_permit", "work_permit_start_date", "work_permit_end_date", "file_work_permit",
] as const;

const isEmptyValue = (v: unknown) =>
  v === null ||
  v === undefined ||
  v === "" ||
  (Array.isArray(v) && v.length === 0);

const toMediaFile = (m: AttachmentMedia): MediaFile =>
  ({
    id: Number(m.id) || 0,
    mime_type: "",
    name: m.name ?? "",
    type: m.type ?? "",
    url: m.url,
  }) as MediaFile;

/**
 * The attachments page writes to /hr/attendance/attachments, while this screen
 * reads /company-users/show-identity-data — two separate stores. Fill any
 * empty identity field from the attendance store so documents saved from the
 * attachments cards are visible in the profile too.
 */
function mergeWithAttendanceAttachments(
  identity: UserIdentityInformationT,
  documents: Record<string, unknown>,
): UserIdentityInformationT {
  const merged: Record<string, unknown> = { ...identity };

  for (const key of SHARED_DOC_KEYS) {
    const incoming = documents[key];
    if (!isEmptyValue(merged[key]) || isEmptyValue(incoming)) continue;
    merged[key] = key.startsWith("file_")
      ? (incoming as AttachmentMedia[]).map(toMediaFile)
      : incoming;
  }

  return merged as unknown as UserIdentityInformationT;
}

export default async function GetUserIdentityData(userId?: string) {
  const res = await apiClient.get<ResponseT>(
    `/company-users/show-identity-data${Boolean(userId) ? "/" + userId : ""}`
  );
  const identity = res.data.payload;

  // The attendance attachments endpoint returns the *logged-in* user's docs,
  // so only merge when this profile belongs to that same user — otherwise an
  // employee viewing a colleague's profile would see their own documents.
  const authUserId = useAuthStore.getState().user?.id;
  const isSelf =
    !userId ||
    (authUserId != null && String(userId) === String(authUserId));
  if (!isSelf) return identity;

  try {
    const attendance = await getAttendanceAttachments();
    return mergeWithAttendanceAttachments(
      identity,
      attendance.documents as unknown as Record<string, unknown>,
    );
  } catch {
    return identity;
  }
}
