"use client";

import React from "react";
import { Box } from "@mui/material";
import ManagementsSettingsPanel from "./component/ManagementsSettingsPanel";
import { SettingsTabItemProps } from "../../types";

export default function ManagementsView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <ManagementsSettingsPanel projectTypeId={projectTypeId} />
    </Box>
  );
}
