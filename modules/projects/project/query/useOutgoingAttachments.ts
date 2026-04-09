import { useQuery } from "@tanstack/react-query";
import { AttachmentRequestsApi } from "@/services/api/projects/attachment-requests";
import type {
  AttachmentRequest,
  AttachmentRequestStatus,
} from "@/services/api/projects/attachment-requests/types/response";
import type {
  DocumentRow,
  DocumentStatus,
} from "@/modules/projects/project/components/project-tabs/tabs/document-cycle/types";
import { mapAttachmentRequestFilesToDocumentAttachments } from "@/modules/projects/project/components/project-tabs/tabs/document-cycle/mapAttachmentFiles";
import { mapAttachmentRequestHistory } from "@/modules/projects/project/components/project-tabs/tabs/document-cycle/mapRequestHistory";

function mapStatus(apiStatus: AttachmentRequestStatus): DocumentStatus {
  switch (apiStatus) {
    case "approved":     return "approved";
    case "rejected":     return "rejected";
    case "semi-approved": return "semi_approved";
    case "pending":
    default:             return "pending";
  }
}

function mapToDocumentRow(item: AttachmentRequest): DocumentRow {
  const preview = item.attachments_preview ?? item.items ?? [];
  const firstFile = preview[0];
  const docCount =
    preview.length > 0
      ? preview.length
      : (item.statistics?.total_items ?? 0);

  const attachments =
    preview.length > 0
      ? mapAttachmentRequestFilesToDocumentAttachments(preview)
      : undefined;

  return {
    id: item.id,
    serialNumber: item.serial_number,
    name: item.name,
    fileSize: firstFile?.file_size_formatted ?? "—",
    documentCount: docCount,
    lastActivityUser: item.created_by?.name ?? "—",
    lastActivityDate: item.date,
    status: mapStatus(item.status),
    submissionDate: item.date,
    approvalStatus: item.status,
    project: item.project
      ? {
          id: item.project.id,
          name: item.project.name,
          serial_number: item.project.serial_number,
        }
      : undefined,
    description: item.notes?.trim() ? item.notes : undefined,
    attachments,
    history: mapAttachmentRequestHistory(item),
  };
}

function attachmentRequestsListFromBody(
  body: {
    data?: AttachmentRequest[];
    payload?: AttachmentRequest[];
  },
): AttachmentRequest[] {
  const raw = body.payload ?? body.data;
  return Array.isArray(raw) ? raw : [];
}

export interface UseOutgoingAttachmentsParams {
  projectId: string | undefined;
  page: number;
  perPage: number;
  documentType?: string;
  type?: string;
  endDate?: string;
}

export const outgoingAttachmentsQueryKey = (
  params: UseOutgoingAttachmentsParams,
) => ["outgoing-attachment-requests", params] as const;

export interface OutgoingAttachmentsResult {
  data: DocumentRow[];
  totalPages: number;
  totalItems: number;
}

export function useOutgoingAttachments(params: UseOutgoingAttachmentsParams) {
  const { projectId, page, perPage, documentType, type, endDate } = params;

  return useQuery({
    queryKey: outgoingAttachmentsQueryKey(params),
    queryFn: async (): Promise<OutgoingAttachmentsResult> => {
      const res = await AttachmentRequestsApi.getOutgoing({
        project_id: projectId!,
        page,
        per_page: perPage,
        ...(documentType ? { document_type: documentType } : {}),
        ...(type        ? { type }                          : {}),
        ...(endDate     ? { end_date: endDate }             : {}),
      });

      const body = res.data;
      const rows = attachmentRequestsListFromBody(body);

      return {
        data: rows.map(mapToDocumentRow),
        totalPages: body.pagination?.last_page ?? 1,
        totalItems: body.pagination?.result_count ?? rows.length,
      };
    },
    enabled: !!projectId,
    placeholderData: (prev) => prev,
  });
}
