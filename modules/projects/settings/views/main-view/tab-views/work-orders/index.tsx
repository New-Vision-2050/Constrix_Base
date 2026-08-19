"use client";

import React from "react";
import { Box } from "@mui/material";
import WorkOrdersSettingsPanel from "./component/WorkOrdersSettingsPanel";
import { SettingsTabItemProps } from "../../types";

export default function WorkOrdersView({
  thirdLevelId: projectTypeId,
}: SettingsTabItemProps) {
  return (
    <Box className="mt-6 gap-1 flex mb-8 bg-transparent">
      <WorkOrdersSettingsPanel projectTypeId={projectTypeId} />
    </Box>
  );
}

/* LEGACY — previous work orders settings UI (accordion + CRUD sub-views).
   Kept for reference; replaced by project-order-permit-settings toggle.
   See git history or work-order-types/, section/, actions/, report-forms/,
   tasks/, tasks-settings/ subfolders for the old implementation.
*/
