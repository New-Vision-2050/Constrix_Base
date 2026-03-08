"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function EmployeeRequestsManagementContent() {
  const t = useTranslations("WorkPanel");

  return (
    <Box className="flex gap-6">
      <Typography variant="h6">{t("employeeRequests")}</Typography>
    </Box>
  );
}

