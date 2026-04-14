"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import type { UpdateAttachmentContractSettingsArgs } from "@/services/api/projects/project-types/types/args";
import type { UpdateAttachmentTermsContractSettingsArgs } from "@/services/api/projects/project-types/types/args";

const FLAG_KEYS: (keyof UpdateAttachmentContractSettingsArgs)[] = [
  "is_name",
  "is_type",
  "is_size",
  "is_creator",
  "is_create_date",
  "is_downloadable",
];

function buildAllFlags(
  checked: boolean,
): UpdateAttachmentContractSettingsArgs & UpdateAttachmentTermsContractSettingsArgs {
  const v = checked ? 1 : 0;
  return {
    is_name: v,
    is_type: v,
    is_size: v,
    is_creator: v,
    is_create_date: v,
    is_downloadable: v,
  };
}

function isAllFlagsOn(
  data:
    | (Partial<Record<keyof UpdateAttachmentContractSettingsArgs, number>> & object)
    | null
    | undefined,
): boolean {
  if (!data) return false;
  return FLAG_KEYS.every((k) => data[k] === 1);
}

interface ProjectAttachmentsToggleProps {
  projectTypeId: number | null;
}

function ProjectAttachmentsToggle({ projectTypeId }: ProjectAttachmentsToggleProps) {
  const t = useTranslations("projectSettings.projectTypes.attachments");
  const queryClient = useQueryClient();

  const { data: contractData, isLoading: isLoadingContract } = useQuery({
    queryKey: ["attachment-contract-settings", projectTypeId],
    queryFn: async () => {
      if (!projectTypeId) return null;
      const response = await ProjectTypesApi.getAttachmentContractSettings(projectTypeId);
      return response.data.payload;
    },
    enabled: projectTypeId !== null,
  });

  const { data: termsData, isLoading: isLoadingTerms } = useQuery({
    queryKey: ["attachment-terms-contract-settings", projectTypeId],
    queryFn: async () => {
      if (!projectTypeId) return null;
      const response = await ProjectTypesApi.getAttachmentTermsContractSettings(projectTypeId);
      return response.data.payload;
    },
    enabled: projectTypeId !== null,
  });

  const updateMutation = useMutation({
    mutationFn: async (checked: boolean) => {
      if (!projectTypeId) throw new Error("No project type ID");
      const payload = buildAllFlags(checked);
      await Promise.all([
        ProjectTypesApi.updateAttachmentContractSettings(projectTypeId, payload),
        ProjectTypesApi.updateAttachmentTermsContractSettings(projectTypeId, payload),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attachment-contract-settings", projectTypeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attachment-terms-contract-settings", projectTypeId],
      });
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    updateMutation.mutate(checked);
  };

  if (!projectTypeId) {
    return <div className="w-full">{t("selectProjectType")}</div>;
  }

  if (isLoadingContract || isLoadingTerms) {
    return <div className="w-full">{t("loading")}</div>;
  }

  const checked =
    isAllFlagsOn(contractData) && isAllFlagsOn(termsData);

  return (
    <div className="w-full">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          {t("sectionTitle")}
        </Typography>
      </Box>

      <div className="space-y-2">
        <HorizontalSwitch
          checked={checked}
          onChange={handleSwitchChange}
          label={t("showAllProjectAttachments")}
          disabled={updateMutation.isPending}
        />
      </div>
    </div>
  );
}

export default ProjectAttachmentsToggle;
