"use client";

import { useOptionalProject } from "@/modules/all-project/context/ProjectContext";
import { useOptionalContractualEngagement } from "@/modules/projects/project/context/ContractualEngagementContext";
import { AttachmentRequestsApi } from "@/services/api/projects/attachment-requests";
import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FolderSync } from "lucide-react";

export const DOCUMENT_CYCLE_PENDING_COUNT_QUERY_KEY =
  "attachment-requests-incoming-pending-count" as const;

function FolderSyncIconWithCount() {
  const project = useOptionalProject();
  const engagement = useOptionalContractualEngagement();
  const projectId = project?.projectId;
  const engagementKey = engagement?.contractualEngagementKey;

  const pendingCountQuery = useQuery({
    queryKey: [
      DOCUMENT_CYCLE_PENDING_COUNT_QUERY_KEY,
      projectId,
      engagementKey,
    ],
    queryFn: async () => {
      if (engagementKey) {
        const res = await AttachmentRequestsApi.getList({
          contractual_engagement_key: engagementKey,
          page: 1,
          per_page: 1,
          type: "pending",
        });
        const body = res.data;
        return body.total ?? body.pagination?.result_count ?? 0;
      }

      const res = await AttachmentRequestsApi.getCount({
        project_id: projectId!,
        page: 1,
        per_page: 1,
        type: "pending",
      });
      return res.data.count ?? 0;
    },
    enabled: !!projectId || !!engagementKey,
    staleTime: 30_000,
  });

  const count = pendingCountQuery.data ?? 0;

  return (
    <Badge badgeContent={count} color="error" invisible={!count}>
      <FolderSync className="w-4 h-4" />
    </Badge>
  );
}

export default FolderSyncIconWithCount;
