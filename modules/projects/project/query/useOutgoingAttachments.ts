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
  return {
    id: item.id,
    name: item.name,
    fileSize: "—",
    documentCount: 0,
    lastActivityUser: "—",
    lastActivityDate: item.responded_at ?? item.created_at,
    status: mapStatus(item.status),
    submissionDate: item.date,
    approvalStatus: item.status,
  };
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
      const rows = Array.isArray(body.data) ? body.data : [];

      return {
        data: rows.map(mapToDocumentRow),
        totalPages: body.pagination?.last_page   ?? 1,
        totalItems: body.pagination?.result_count ?? rows.length,
      };
    },
    enabled: !!projectId,
    placeholderData: (prev) => prev,
  });
}
