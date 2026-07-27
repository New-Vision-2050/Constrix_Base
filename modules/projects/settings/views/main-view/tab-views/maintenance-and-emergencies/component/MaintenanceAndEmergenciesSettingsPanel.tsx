"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { UpdateMaintenanceAndEmergenciesSettingsArgs } from "@/services/api/projects/project-types/types/args";
import SiteStatusTypesTab from "@/modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/site-status-types";

interface MaintenanceAndEmergenciesSettingsPanelProps {
  projectTypeId: number | null;
}

function MaintenanceAndEmergenciesSettingsPanel({
  projectTypeId,
}: MaintenanceAndEmergenciesSettingsPanelProps) {
  const t = useTranslations(
    "Projects.Settings.projectTypes.maintenanceAndEmergencies",
  );
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["maintenance-emergency-settings", projectTypeId],
    queryFn: async () => {
      if (!projectTypeId) return null;
      const response = await ProjectTypesApi.getMaintenanceAndEmergenciesSettings(
        projectTypeId,
      );
      return response.data.payload;
    },
    enabled: projectTypeId !== null,
  });

  const updateMutation = useMutation({
    mutationFn: async (args: UpdateMaintenanceAndEmergenciesSettingsArgs) => {
      if (!projectTypeId) throw new Error("No project type ID");
      return ProjectTypesApi.updateMaintenanceAndEmergenciesSettings(
        projectTypeId,
        args,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maintenance-emergency-settings", projectTypeId],
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
          checked={data?.is_shown === 1}
          onChange={handleSwitchChange}
          label={t("showAllData")}
          disabled={updateMutation.isPending}
        />
      </div>

      <Box className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Typography variant="h6" fontWeight="bold" className="mb-4">
          {t("siteStatusTypes")}
        </Typography>
        {projectTypeId ? (
          <SiteStatusTypesTab projectTypeId={projectTypeId} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t("selectProjectType")}
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default MaintenanceAndEmergenciesSettingsPanel;
