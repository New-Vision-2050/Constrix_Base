"use client";
import React from "react";
import { Box } from "@mui/material";
import RolesAndPermissionsContent from "./component/roles-and-permissions-content";
import { SettingsTabItemProps } from "../../types";

export default function RolesAndPermissionsView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <RolesAndPermissionsContent projectTypeId={projectTypeId} />
    </Box>
  );
}
