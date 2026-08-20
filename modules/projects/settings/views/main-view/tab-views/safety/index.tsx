"use client";

import React from "react";
import { Box } from "@mui/material";
import SafetySettingsPanel from "./component/SafetySettingsPanel";
import { SettingsTabItemProps } from "../../types";

export default function SafetyView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <SafetySettingsPanel projectTypeId={projectTypeId} />
    </Box>
  );
}
