"use client";
import React from "react";
import { Box } from "@mui/material";
import MaintenanceAndEmergenciesSettingsPanel from "./component/MaintenanceAndEmergenciesSettingsPanel";
import { SettingsTabItemProps } from "../types";

export default function MaintenanceAndEmergenciesView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <MaintenanceAndEmergenciesSettingsPanel projectTypeId={projectTypeId} />
    </Box>
  );
}
