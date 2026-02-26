"use client";
import React from "react";
import { Box } from "@mui/material";
import Contractors from "./component/contractors";
import { SettingsTabItemProps } from "../../types";

export default function ContractorsView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <Contractors projectTypeId={projectTypeId} />
    </Box>
  );
}
