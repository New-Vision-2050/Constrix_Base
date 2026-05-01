"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import HRReportCategoryCards from "./components/HRReportCategoryCards";

export default function HRReportsIndex() {
  const t = useTranslations("HRReports");

  return (
    <Box className="container mx-auto p-6">
      <Box className="mb-8">
        <Typography variant="h4" className="font-bold">
          {t("title")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-2 max-w-2xl leading-relaxed"
        >
          {t("description")}
        </Typography>
      </Box>
      <HRReportCategoryCards />
    </Box>
  );
}
