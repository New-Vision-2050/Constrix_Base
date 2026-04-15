"use client";
import React from "react";
import { Box } from "@mui/material";
import AttachmentCycleSettingsPanel from "./component/AttachmentCycleSettingsPanel";
import { SettingsTabItemProps } from "../types";

export default function DocumentCycleView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <AttachmentCycleSettingsPanel projectTypeId={projectTypeId} />
    </Box>
  );
}
