"use client";

import { useMemo } from "react";
import { useOptionalProject } from "@/modules/all-project/context/ProjectContext";
import { useOptionalContractualEngagement } from "@/modules/projects/project/context/ContractualEngagementContext";
import type { NotificationScope } from "@/modules/projects/project/utils/notificationScope";

export function useNotificationScope(): NotificationScope & {
  isEngagement: boolean;
  hasScope: boolean;
} {
  const engagement = useOptionalContractualEngagement();
  const project = useOptionalProject();
  const projectId = project?.projectId;
  const contractualEngagementKey = engagement?.contractualEngagementKey;

  return useMemo(
    () => ({
      projectId,
      contractualEngagementKey,
      isEngagement: !!contractualEngagementKey,
      hasScope: !!(projectId || contractualEngagementKey),
    }),
    [projectId, contractualEngagementKey],
  );
}
