"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { UpdateAttachmentContractSettingsArgs } from "@/services/api/projects/project-types/types/args";

const attachmentItems = [
    {
        label: "اسم الملف",
        value: "file-name",
        apiKey: "is_name" as keyof UpdateAttachmentContractSettingsArgs,
    },
    {
        label: "النوع",
        value: "type",
        apiKey: "is_type" as keyof UpdateAttachmentContractSettingsArgs,
    },
    {
        label: "الحجم",
        value: "size",
        apiKey: "is_size" as keyof UpdateAttachmentContractSettingsArgs,
    },
    {
        label: "المنشئ",
        value: "creator",
        apiKey: "is_creator" as keyof UpdateAttachmentContractSettingsArgs,
    },
    {
        label: "تاريخ الإنشاء",
        value: "creation-date",
        apiKey: "is_create_date" as keyof UpdateAttachmentContractSettingsArgs,
    },
    {
        label: "إمكانية التحميل",
        value: "downloadability",
        apiKey: "is_downloadable" as keyof UpdateAttachmentContractSettingsArgs,
    },
];

interface ContractProps {
    projectTypeId: number | null;
}

function Contract({ projectTypeId }: ContractProps) {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["attachment-contract-settings", projectTypeId],
        queryFn: async () => {
            if (!projectTypeId) return null;
            const response = await ProjectTypesApi.getAttachmentContractSettings(projectTypeId);
            return response.data.payload;
        },
        enabled: projectTypeId !== null,
    });

    const updateMutation = useMutation({
        mutationFn: async (args: UpdateAttachmentContractSettingsArgs) => {
            if (!projectTypeId) throw new Error("No project type ID");
            return ProjectTypesApi.updateAttachmentContractSettings(projectTypeId, args);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["attachment-contract-settings", projectTypeId],
            });
        },
    });

    const handleSwitchChange = (apiKey: keyof UpdateAttachmentContractSettingsArgs, checked: boolean) => {
        updateMutation.mutate({
            [apiKey]: checked ? 1 : 0,
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
                    مرفقات العقد
                </Typography>
            </Box>

            {/* Attachment Items List */}
            <div className="space-y-2">
                {attachmentItems.map((item) => (
                    <HorizontalSwitch
                        key={item.value}
                        checked={data?.[item.apiKey] === 1}
                        onChange={(checked) => handleSwitchChange(item.apiKey, checked)}
                        label={item.label}
                        disabled={updateMutation.isPending}
                    />
                ))}
            </div>
        </div>
    );
}

export default Contract;