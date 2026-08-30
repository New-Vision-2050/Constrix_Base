import { baseApi } from "@/config/axios/instances/base";
import {
  AttachmentRequestsListParams,
  CreateAttachmentRequestData,
  IncomingAttachmentRequestsParams,
  OutgoingAttachmentRequestsParams,
  ReplaceAttachmentItemMediaPayload,
  RespondAttachmentItemPayload,
} from "./types/params";
import {
  GetAttachmentRequestsListResponse,
  GetFolderChildrenResponse,
  GetIncomingAttachmentRequestsResponse,
  GetOutgoingAttachmentRequestsResponse,
} from "./types/response";
import type { AttachmentRequest } from "./types/response";
import type {
  AttachmentRequestChartsFilters,
  AttachmentRequestChartsResponse,
} from "./types/charts";
import { ApiBaseResponse } from "@/types/common/response/base";

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
  getCount: (params: IncomingAttachmentRequestsParams) =>
    baseApi.get<{ count: number }>("projects/attachment-requests/count", {
      params,
    }),

  /** GET `projects/attachment-requests` — combined incoming + outgoing (use row `direction` / `type`) */
  getList: (params: AttachmentRequestsListParams) => {
    const { receiver_company_ids, ...rest } = params;
    return baseApi.get<GetAttachmentRequestsListResponse>(
      "projects/attachment-requests",
      {
        params: rest,
        paramsSerializer: (p) => {
          const searchParams = new URLSearchParams();
          Object.entries(p).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            searchParams.append(key, String(value));
          });
          receiver_company_ids?.forEach((id) => {
            if (id) searchParams.append("receiver_company_ids[]", id);
          });
          return searchParams.toString();
        },
      },
    );
  },

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
    if (data.receiver_company_id)
      formData.append("receiver_company_id", data.receiver_company_id);
    if (data.serial_number)
      formData.append("serial_number", data.serial_number);
    if (data.procedure_setting_id)
      formData.append("procedure_setting_id", data.procedure_setting_id);
    if (data.attachment_sub_type_id)
      formData.append("attachment_sub_type_id", data.attachment_sub_type_id);
    if (data.attachment_sub_sub_type_id)
      formData.append(
        "attachment_sub_sub_type_id",
        data.attachment_sub_sub_type_id,
      );
    data.attachments?.forEach((file) => formData.append("attachments[]", file));
    data.attachment_upload_ids?.forEach((id) =>
      formData.append("attachment_upload_ids[]", id),
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

  /**
   * POST `item_id` + either `new_file` (multipart, small files) or `upload_id`
   * (JSON, token from the completed chunked-upload flow for large files).
   * Returns updated attachment request in `payload`.
   */
  replaceItemMedia: (body: ReplaceAttachmentItemMediaPayload) => {
    if ("upload_id" in body && body.upload_id) {
      return baseApi.post<ApiBaseResponse<AttachmentRequest>>(
        "projects/attachment-requests/items/replace-media",
        { item_id: body.item_id, upload_id: body.upload_id },
      );
    }
    const formData = new FormData();
    formData.append("item_id", body.item_id);
    formData.append("new_file", (body as { new_file: File }).new_file);
    return baseApi.post<ApiBaseResponse<AttachmentRequest>>(
      "projects/attachment-requests/items/replace-media",
      formData,
    );
  },

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


  /** GET `projects/attachment-requests/charts` */
  getCharts: (params: AttachmentRequestChartsFilters) =>
    baseApi.get<AttachmentRequestChartsResponse>(
      "projects/attachment-requests/charts",
      { params },
    ),
};
