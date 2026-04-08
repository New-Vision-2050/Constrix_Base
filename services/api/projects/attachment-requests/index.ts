import { baseApi } from "@/config/axios/instances/base";
import {
  CreateAttachmentRequestData,
  OutgoingAttachmentRequestsParams,
} from "./types/params";
import {
  GetFolderChildrenResponse,
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

  create: (data: CreateAttachmentRequestData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("date", data.date);
    formData.append("project_id", data.project_id);
    formData.append("receiver_company_id", data.receiver_company_id);
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
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
};
