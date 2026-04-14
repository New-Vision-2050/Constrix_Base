"use client";

import { useProject } from "@/modules/all-project/context/ProjectContext";
import { AttachmentRequestsApi } from "@/services/api/projects/attachment-requests";
import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FolderSync } from "lucide-react";

export const DOCUMENT_CYCLE_PENDING_COUNT_QUERY_KEY =
  "attachment-requests-incoming-pending-count" as const;

function FolderSyncIconWithCount() {
  const { projectId } = useProject();

  const pendingCountQuery = useQuery({
    queryKey: [DOCUMENT_CYCLE_PENDING_COUNT_QUERY_KEY, projectId],
    queryFn: async () => {
      const res = await AttachmentRequestsApi.getCount({
        project_id: projectId!,
        page: 1,
        per_page: 1,
        type: "pending",
      });
      return res.data.count ?? 0;
    },
    enabled: !!projectId,
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
