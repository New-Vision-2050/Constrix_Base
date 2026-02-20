"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { UpdateEmployeeContractSettingsArgs } from "@/services/api/projects/project-types/types/args";

interface CalderProps {
    projectTypeId: number | null;
}

function Calder({ projectTypeId }: CalderProps) {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["employee-contract-settings", projectTypeId],
        queryFn: async () => {
            if (!projectTypeId) return null;
            const response = await ProjectTypesApi.getEmployeeContractSettings(projectTypeId);
            return response.data.payload;
        },
        enabled: projectTypeId !== null,
    });

    const updateMutation = useMutation({
        mutationFn: async (args: UpdateEmployeeContractSettingsArgs) => {
            if (!projectTypeId) throw new Error("No project type ID");
            return ProjectTypesApi.updateEmployeeContractSettings(projectTypeId, args);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["employee-contract-settings", projectTypeId],
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
            {/* Header with Add Button */}
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" fontWeight="bold">
                    الكادر
                </Typography>
            </Box>

            {/* Attachment Items List */}
            <div className="space-y-2">
                <HorizontalSwitch
                    checked={data?.is_all_data_visible === 1}
                    onChange={handleSwitchChange}
                    label="إظهار جميع بيانات الخاصة بالكادر"
                    disabled={updateMutation.isPending}
                />
            </div>
        </div>
    );
}

export default Calder;