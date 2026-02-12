"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function ExpiredIDsContent() {
  const t = useTranslations("WorkPanel");

  return (
    <Box className="flex gap-6">
      <Box className="flex-1">
        <Typography variant="h6">{t("expiredIDs")}</Typography>
      </Box>
    </Box>
  );
}

