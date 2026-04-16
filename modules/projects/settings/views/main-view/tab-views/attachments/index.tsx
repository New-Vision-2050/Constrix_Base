"use client";

import React from "react";
import { Box } from "@mui/material";
import ProjectAttachmentsToggle from "./component/ProjectAttachmentsToggle";
import { SettingsTabItemProps } from "../../types";

export default function AttachmentsView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <ProjectAttachmentsToggle projectTypeId={projectTypeId} />
    </Box>
  );
}
