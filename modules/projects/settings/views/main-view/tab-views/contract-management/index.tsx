"use client";
import React from "react";
import {Box,} from "@mui/material";
import Contract from "./component/Contract";

interface ContractManagementViewProps {
    projectTypeId: number | null;
}

export default function ContractManagementView({ projectTypeId }: ContractManagementViewProps) {
  return (
      <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
        <Contract projectTypeId={projectTypeId} />
      </Box>
  );
}

