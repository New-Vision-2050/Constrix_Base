"use client";
import React from "react";
import { Box } from "@mui/material";
import ProjectSharingContent from "./component/project-sharing-content";
import { SettingsTabItemProps } from "../../types";

export default function ProjectSharingView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <ProjectSharingContent projectTypeId={projectTypeId} />
    </Box>
  );
}
