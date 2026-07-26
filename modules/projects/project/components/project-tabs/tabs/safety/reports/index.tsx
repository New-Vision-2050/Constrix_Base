"use client";

import { Alert, Box } from "@mui/material";
import { useTranslations } from "next-intl";

export default function SafetyReportsTabView() {
  const t = useTranslations("project.safetyTab");

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Alert severity="info">{t("comingSoon")}</Alert>
    </Box>
  );
}
