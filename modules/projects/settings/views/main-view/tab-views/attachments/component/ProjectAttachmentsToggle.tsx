"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";

interface ProjectAttachmentsToggleProps {
  projectTypeId: number | null;
}

function ProjectAttachmentsToggle({ projectTypeId }: ProjectAttachmentsToggleProps) {
  const t = useTranslations("projectSettings.projectTypes.attachments");
  const queryClient = useQueryClient();

  const { data: archiveLibraryData, isLoading } = useQuery({
    queryKey: ["archive-library-settings", projectTypeId],
    queryFn: async () => {
      if (!projectTypeId) return null;
      const response = await ProjectTypesApi.getArchiveLibrarySettings(projectTypeId);
      return response.data.payload;
    },
    enabled: projectTypeId !== null,
  });

  const updateMutation = useMutation({
    mutationFn: async (checked: boolean) => {
      if (!projectTypeId) throw new Error("No project type ID");
      await ProjectTypesApi.updateArchiveLibrarySettings(projectTypeId, {
        is_all_data_visible: checked ? 1 : 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["archive-library-settings", projectTypeId],
      });
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    updateMutation.mutate(checked);
  };

  if (!projectTypeId) {
    return <div className="w-full">{t("selectProjectType")}</div>;
  }

  if (isLoading) {
    return <div className="w-full">{t("loading")}</div>;
  }

  const checked = archiveLibraryData?.is_all_data_visible === 1;

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
