"use client";
import React from "react";
import { Box } from "@mui/material";
import Contract from "./component/Contract";
import { SettingsTabItemProps } from "../../types";

export default function ContractManagementView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <Contract projectTypeId={projectTypeId} />
    </Box>
  );
}
