"use client";

import { useState } from "react";
import { Alert, Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import SafetyVisitsView from "./components/SafetyVisitsView";

const TABS = [
  { id: "safetyReports", labelKey: "safetyReports" },
  { id: "visits", labelKey: "visits" },
  { id: "reports", labelKey: "reports" },
  { id: "indicators", labelKey: "indicators" },
] as const;

export default function SafetyTab() {
  const t = useTranslations("project.safetyTab");
  const [activeTab, setActiveTab] = useState<string>("visits");

  return (
    <Box sx={{ p: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.id} value={tab.id} label={t(`tabs.${tab.labelKey}`)} />
        ))}
      </Tabs>

      {activeTab === "visits" && <SafetyVisitsView />}
      {(activeTab === "safetyReports" ||
        activeTab === "reports" ||
        activeTab === "indicators") && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="info">{t("comingSoon")}</Alert>
        </Box>
      )}
    </Box>
  );
}
