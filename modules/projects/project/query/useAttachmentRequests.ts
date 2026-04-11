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

export const ATTACHMENT_REQUESTS_QUERY_KEY = "attachment-requests" as const;

function mapStatus(apiStatus: AttachmentRequestStatus): DocumentStatus {
  switch (apiStatus) {
    case "draft":
      return "draft";
    case "approved":
      return "approved";
    case "rejected":
    case "declined":
      return "declined";
    case "semi-approved":
      return "semi_approved";
    case "pending":
      return "pending";
    default:
      return "pending";
  }
}

/** API may expose flow as `direction` or as `type` (incoming | outgoing). */
type AttachmentRequestWithFlow = AttachmentRequest & { type?: string };

function resolveFlow(item: AttachmentRequestWithFlow): "incoming" | "outgoing" {
  const d = item.direction;
  if (d === "incoming" || d === "outgoing") return d;
  const t = item.type?.toLowerCase();
  if (t === "incoming" || t === "outgoing") return t;
  return "outgoing";
}

function resolveSenderName(item: AttachmentRequest): string {
  return (
    item.sender_company?.name?.trim() ||
    item.created_by?.name?.trim() ||
    "—"
  );
}

function resolveReceiverName(item: AttachmentRequest): string {
  return item.receiver_company?.name?.trim() || "—";
}

function mapToDocumentRow(item: AttachmentRequestWithFlow): DocumentRow {
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

  const flow = resolveFlow(item);

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
    flow,
    senderName: resolveSenderName(item),
    receiverName: resolveReceiverName(item),
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

function attachmentRequestsListFromBody(body: {
  data?: AttachmentRequest[];
  payload?: AttachmentRequest[];
}): AttachmentRequest[] {
  const raw = body.payload ?? body.data;
  return Array.isArray(raw) ? raw : [];
}

export interface UseAttachmentRequestsParams {
  projectId: string | undefined;
  page: number;
  perPage: number;
  documentType?: string;
  type?: string;
  endDate?: string;
  direction?: "" | "incoming" | "outgoing";
}

export const attachmentRequestsQueryKey = (params: UseAttachmentRequestsParams) =>
  [ATTACHMENT_REQUESTS_QUERY_KEY, params] as const;

export interface AttachmentRequestsResult {
  data: DocumentRow[];
  totalPages: number;
  totalItems: number;
}

export function useAttachmentRequests(params: UseAttachmentRequestsParams) {
  const {
    projectId,
    page,
    perPage,
    documentType,
    type,
    endDate,
    direction,
  } = params;

  return useQuery({
    queryKey: attachmentRequestsQueryKey(params),
    queryFn: async (): Promise<AttachmentRequestsResult> => {
      const res = await AttachmentRequestsApi.getList({
        project_id: projectId!,
        page,
        per_page: perPage,
        ...(documentType ? { document_type: documentType } : {}),
        ...(type ? { type } : {}),
        ...(endDate ? { end_date: endDate } : {}),
        ...(direction === "incoming" || direction === "outgoing"
          ? { direction }
          : {}),
      });

      const body = res.data;
      const rows = attachmentRequestsListFromBody(body);

      return {
        data: rows.map((r) => mapToDocumentRow(r as AttachmentRequestWithFlow)),
        totalPages: body.pagination?.last_page ?? 1,
        totalItems: body.pagination?.result_count ?? rows.length,
      };
    },
    enabled: !!projectId,
    placeholderData: (prev) => prev,
  });
}
