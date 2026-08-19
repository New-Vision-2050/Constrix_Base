"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { UpdateConstructionSettingsArgs } from "@/services/api/projects/project-types/types/args";
import { isSettingShown } from "@/modules/projects/settings/utils/is-setting-shown";

interface ConstructionsSettingsPanelProps {
  projectTypeId: number | null;
}

function ConstructionsSettingsPanel({
  projectTypeId,
}: ConstructionsSettingsPanelProps) {
  const t = useTranslations("Projects.Settings.projectTypes.constructions");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["construction-settings", projectTypeId],
    queryFn: async () => {
      if (!projectTypeId) return null;
      const response = await ProjectTypesApi.getConstructionSettings(
        projectTypeId,
      );
      return response.data.payload;
    },
    enabled: projectTypeId !== null,
  });

  const updateMutation = useMutation({
    mutationFn: async (args: UpdateConstructionSettingsArgs) => {
      if (!projectTypeId) throw new Error("No project type ID");
      return ProjectTypesApi.updateConstructionSettings(projectTypeId, args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["construction-settings", projectTypeId],
      });
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    updateMutation.mutate({
      is_shown: checked ? 1 : 0,
    });
  };

  if (!projectTypeId) {
    return <div className="w-full">{t("selectProjectType")}</div>;
  }

  if (isLoading) {
    return <div className="w-full">{t("loading")}</div>;
  }

  return (
    <div className="w-full">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          {t("sectionTitle")}
        </Typography>
      </Box>

      <div className="space-y-2">
        <HorizontalSwitch
          checked={isSettingShown(data?.is_shown)}
          onChange={handleSwitchChange}
          label={t("showAllData")}
          disabled={updateMutation.isPending}
        />
      </div>
    </div>
  );
}

export default ConstructionsSettingsPanel;
