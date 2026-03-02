"use client";
import React from "react";
import { Box } from "@mui/material";
import Calder from "./component/Calder";
import { SettingsTabItemProps } from "../types";

export default function TeamView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <Calder projectTypeId={projectTypeId} />
    </Box>
  );
}
