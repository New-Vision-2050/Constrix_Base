import { useQuery } from "@tanstack/react-query";
import { AttachmentRequestsApi } from "@/services/api/projects/attachment-requests";
import type {
  AttachmentRequestChartsFilters,
  AttachmentRequestChartsPayload,
} from "@/services/api/projects/attachment-requests/types/charts";

export const ATTACHMENT_REQUEST_CHARTS_QUERY_KEY =
  "attachment-request-charts" as const;

export type AttachmentRequestChartFilterKey = Exclude<
  keyof AttachmentRequestChartsFilters,
  "project_id" | "contractual_engagement_key"
>;

export type AttachmentRequestChartFilters = Partial<
  Pick<AttachmentRequestChartsFilters, AttachmentRequestChartFilterKey>
>;

export function attachmentRequestChartsQueryKey(
  projectId: string | undefined,
  contractualEngagementKey: string | undefined,
  filters: AttachmentRequestChartFilters,
) {
  return [
    ATTACHMENT_REQUEST_CHARTS_QUERY_KEY,
    projectId,
    contractualEngagementKey,
    filters,
  ] as const;
}

export function useAttachmentRequestCharts(
  projectId: string | undefined,
  contractualEngagementKey: string | undefined,
  filters: AttachmentRequestChartFilters,
) {
  return useQuery({
    queryKey: attachmentRequestChartsQueryKey(
      projectId,
      contractualEngagementKey,
      filters,
    ),
    queryFn: async (): Promise<AttachmentRequestChartsPayload> => {
      const params: AttachmentRequestChartsFilters = {
        ...filters,
        ...(projectId ? { project_id: projectId } : {}),
        ...(contractualEngagementKey
          ? { contractual_engagement_key: contractualEngagementKey }
          : {}),
      };
      const res = await AttachmentRequestsApi.getCharts(params);
      return res.data.payload;
    },
    enabled: !!projectId || !!contractualEngagementKey,
    placeholderData: (prev) => prev,
  });
}
