"use client";
import Contract from "./component/Contract";
import Items from "./component/Items";
import React from "react";
import {Box,} from "@mui/material";

interface AttachmentsViewProps {
    projectTypeId: number | null;
}

export default function AttachmentsView({ projectTypeId }: AttachmentsViewProps) {
    return (
        <Box>
            <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
                <Contract projectTypeId={projectTypeId} />
            </Box>

            <Box className="mt-6 gap-5 flex bg-transparent">
                <Items projectTypeId={projectTypeId} />
            </Box>
        </Box>
    );
}

