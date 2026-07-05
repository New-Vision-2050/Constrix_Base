"use client";

import { Box } from "@mui/material";
import ProjectTabs from "@/modules/projects/project/components/project-tabs";
import {
  ContractualEngagementProvider,
} from "@/modules/projects/project/context/ContractualEngagementContext";
import type { ContractualEngagementKey } from "@/modules/projects/project/constants/contractualEngagementKeys";

interface UnifiedContractViewProps {
  contractualEngagementKey: ContractualEngagementKey;
}

export default function UnifiedContractView({
  contractualEngagementKey,
}: UnifiedContractViewProps) {
  return (
    <ContractualEngagementProvider
      contractualEngagementKey={contractualEngagementKey}
    >
      <Box className="w-full max-w-none p-6">
        <ProjectTabs variant="engagement" key={contractualEngagementKey} />
      </Box>
    </ContractualEngagementProvider>
  );
}
