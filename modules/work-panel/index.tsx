"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { WorkPanelProvider } from "./context/WorkPanelContext";
import { GetWorkPanelMainTabs } from "./constants/WorkPanelMainTabs";
import HorizontalTabs from "@/components/shared/HorizontalTabs";

export default function WorkPanelIndex() {
  const t = useTranslations("WorkPanel");

  return (
    <WorkPanelProvider>
      <Box className="container mx-auto p-6">
        <Box className="mb-6">

        </Box>
        <HorizontalTabs list={GetWorkPanelMainTabs(t)} />
      </Box>
    </WorkPanelProvider>
  );
}

