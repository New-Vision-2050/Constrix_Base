import { baseApi } from "@/config/axios/instances/base";
import {
  AttachmentRequestsListParams,
  CreateAttachmentRequestData,
  IncomingAttachmentRequestsParams,
  OutgoingAttachmentRequestsParams,
  RespondAttachmentItemPayload,
} from "./types/params";
import {
  GetAttachmentRequestsListResponse,
  GetFolderChildrenResponse,
  GetIncomingAttachmentRequestsResponse,
  GetOutgoingAttachmentRequestsResponse,
} from "./types/response";

export const AttachmentRequestsApi = {
  getFolderChildren: (parentId: string) =>
    baseApi.get<GetFolderChildrenResponse>(
      "projects/attachment-requests/folders/children",
      { params: { parent_id: parentId } },
    ),

  getOutgoing: (params: OutgoingAttachmentRequestsParams) =>
    baseApi.get<GetOutgoingAttachmentRequestsResponse>(
      "projects/attachment-requests/outgoing",
      { params },
    ),

  getIncoming: (params: IncomingAttachmentRequestsParams) =>
    baseApi.get<GetIncomingAttachmentRequestsResponse>(
      "projects/attachment-requests/incoming",
      { params },
    ),

  /** GET `projects/attachment-requests` — combined incoming + outgoing (use row `direction` / `type`) */
  getList: (params: AttachmentRequestsListParams) =>
    baseApi.get<GetAttachmentRequestsListResponse>(
      "projects/attachment-requests",
      { params },
    ),

  create: (
    data: CreateAttachmentRequestData,
    options?: {
      /** 0–100 while the multipart body is uploading */
      onUploadProgress?: (percent: number) => void;
    },
  ) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("project_id", data.project_id);
    formData.append("receiver_company_id", data.receiver_company_id);
    if (data.serial_number)
      formData.append("serial_number", data.serial_number);
    if (data.attachment_type_id)
      formData.append("attachment_type_id", data.attachment_type_id);
    if (data.attachment_sub_type_id)
      formData.append("attachment_sub_type_id", data.attachment_sub_type_id);
    if (data.attachment_sub_sub_type_id)
      formData.append(
        "attachment_sub_sub_type_id",
        data.attachment_sub_sub_type_id,
      );
    data.attachments.forEach((file) =>
      formData.append("attachments[]", file),
    );
    if (data.notes) formData.append("notes", data.notes);

    return baseApi.post<{ code: string; message: string | null }>(
      "projects/attachment-requests",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const total = e.total;
          if (total && options?.onUploadProgress) {
            options.onUploadProgress(
              Math.min(100, Math.round((e.loaded * 100) / total)),
            );
          }
        },
      },
    );
  },

  respondToItem: (body: RespondAttachmentItemPayload) =>
    baseApi.post<{ code?: string; message?: string | null }>(
      "projects/attachment-requests/items/respond",
      body,
    ),

  /** POST `projects/attachment-requests/:id/approve` */
  approveRequest: (requestId: string) =>
    baseApi.post<{ code?: string; message?: string | null }>(
      `projects/attachment-requests/${requestId}/approve`,
    ),

  /** POST `projects/attachment-requests/:id/decline` */
  declineRequest: (requestId: string) =>
    baseApi.post<{ code?: string; message?: string | null }>(
      `projects/attachment-requests/${requestId}/decline`,
    ),
};
