"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { WorkPanelProvider } from "./context/WorkPanelContext";
import WorkPanelMainTabs from "./components/WorkPanelMainTabs";

export default function WorkPanelIndex() {
  const t = useTranslations("WorkPanel");

  return (
    <WorkPanelProvider>
      <Box className="container mx-auto p-6">
        <Box className="mb-6">
          <Typography variant="h4" className="font-bold">
            {t("title")}
          </Typography>
          <Typography variant="body1" className="text-muted-foreground mt-2">
            {t("description")}
          </Typography>
        </Box>
        <WorkPanelMainTabs />
      </Box>
    </WorkPanelProvider>
  );
}

