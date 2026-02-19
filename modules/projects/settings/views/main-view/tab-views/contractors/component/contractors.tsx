"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";

const attachmentItems = [
    {
        label: "     إظهار جميع بيانات الخاصة بالمقاولين",
        value: "file-name",
    },


];

function Contract() {
    const [activeAttachments, setActiveAttachments] = useState<string[]>([]);

    return (
        <div className="w-full">
            {/* Header with Add Button */}
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" fontWeight="bold">
                   المقاولين
                </Typography>

            </Box>

            {/* Attachment Items List */}
            <div className="space-y-2">
                {attachmentItems.map((item) => (
                    <HorizontalSwitch
                        key={item.value}
                        checked={activeAttachments.includes(item.value)}
                        onChange={(checked) => {
                            if (checked) {
                                setActiveAttachments([...activeAttachments, item.value]);
                            } else {
                                setActiveAttachments(activeAttachments.filter((i) => i !== item.value));
                            }
                        }}
                        label={item.label}
                    />
                ))}
            </div>
        </div>
    );
}

export default Contract;