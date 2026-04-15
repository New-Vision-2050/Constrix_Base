"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { UpdateAttachmentCycleSettingsArgs } from "@/services/api/projects/project-types/types/args";

interface AttachmentCycleSettingsPanelProps {
  projectTypeId: number | null;
}

function AttachmentCycleSettingsPanel({ projectTypeId }: AttachmentCycleSettingsPanelProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["attachment-cycle-settings", projectTypeId],
    queryFn: async () => {
      if (!projectTypeId) return null;
      const response = await ProjectTypesApi.getAttachmentCycleSettings(projectTypeId);
      return response.data.payload;
    },
    enabled: projectTypeId !== null,
  });

  const updateMutation = useMutation({
    mutationFn: async (args: UpdateAttachmentCycleSettingsArgs) => {
      if (!projectTypeId) throw new Error("No project type ID");
      return ProjectTypesApi.updateAttachmentCycleSettings(projectTypeId, args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attachment-cycle-settings", projectTypeId],
      });
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    updateMutation.mutate({
      is_all_data_visible: checked ? 1 : 0,
    });
  };

  if (!projectTypeId) {
    return <div className="w-full">الرجاء اختيار نوع مشروع</div>;
  }

  if (isLoading) {
    return <div className="w-full">جاري التحميل...</div>;
  }

  return (
    <div className="w-full">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          دورة الوثائق
        </Typography>
      </Box>

      <div className="space-y-2">
        <HorizontalSwitch
          checked={data?.is_all_data_visible === 1}
          onChange={handleSwitchChange}
          label="إظهار جميع البيانات الخاصة بدورة الوثائق"
          disabled={updateMutation.isPending}
        />
      </div>
    </div>
  );
}

export default AttachmentCycleSettingsPanel;
