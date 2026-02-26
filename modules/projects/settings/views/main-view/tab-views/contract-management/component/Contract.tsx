"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";

interface ContractProps {
    projectTypeId: number | null;
}

function Contract({ projectTypeId }: ContractProps) {
    if (!projectTypeId) {
        return <div className="w-full">الرجاء اختيار نوع مشروع</div>;
    }

    return (
        <div className="w-full">
            {/* Header with Add Button */}
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" fontWeight="bold">
                    ادارات العقد
                </Typography>
            </Box>

            {/* Attachment Items List */}
            <div className="space-y-2">
                <HorizontalSwitch
                    checked={false}
                    onChange={(checked) => {
                        // TODO: Implement API integration
                        console.log("Contract management setting changed:", checked);
                    }}
                    label="إظهار جميع بيانات الخاصة بادارات العقد"
                />
            </div>
        </div>
    );
}

export default Contract;