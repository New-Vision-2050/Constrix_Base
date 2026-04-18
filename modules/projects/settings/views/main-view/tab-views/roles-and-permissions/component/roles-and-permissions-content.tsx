"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { UpdateRolesAndPermissionsSettingsArgs } from "@/services/api/projects/project-types/types/args";

interface RolesAndPermissionsContentProps {
    projectTypeId: number | null;
}

function RolesAndPermissionsContent({ projectTypeId }: RolesAndPermissionsContentProps) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["roles-and-permissions-settings", projectTypeId],
        queryFn: async () => {
            if (!projectTypeId) return null;
            try {
                const response = await ProjectTypesApi.getRolesAndPermissionsSettings(projectTypeId);
                return response.data.payload;
            } catch (error) {
                console.error("Failed to fetch roles-and-permissions settings:", error);
                return null;
            }
        },
        enabled: projectTypeId !== null,
        retry: false,
    });

    const updateMutation = useMutation({
        mutationFn: async (args: UpdateRolesAndPermissionsSettingsArgs) => {
            if (!projectTypeId) throw new Error("No project type ID");
            return ProjectTypesApi.updateRolesAndPermissionsSettings(projectTypeId, args);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["roles-and-permissions-settings", projectTypeId],
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
                    الصلاحيات والأدوار
                </Typography>
            </Box>

            <div className="space-y-2">
                <HorizontalSwitch
                    checked={data?.is_all_data_visible === 1}
                    onChange={handleSwitchChange}
                    label="إظهار جميع بيانات الخاصة بالصلاحيات والأدوار"
                    disabled={updateMutation.isPending}
                />
            </div>
        </div>
    );
}

export default RolesAndPermissionsContent;
