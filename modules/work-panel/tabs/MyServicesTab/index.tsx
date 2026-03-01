"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function MyServicesTab() {
  const t = useTranslations("WorkPanel");

  return (
    <Box className="mt-6">
      <Typography variant="h6">{t("myServices")}</Typography>
    </Box>
  );
}

