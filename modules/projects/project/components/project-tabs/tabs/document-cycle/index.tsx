"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import AttachmentRequestsTable from "./components/AttachmentRequestsTable";

const AttachmentRequestChartsView = dynamic(
  () => import("./components/AttachmentRequestChartsView"),
  { ssr: false },
);

export default function DocumentCycleTab() {
  const t = useTranslations("project.documentCycle");
  const [activeTab, setActiveTab] = useState<"requests" | "indicators">("requests");

  return (
    <Box sx={{ p: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab value="requests" label={t("tabs.requests")} />
        <Tab value="indicators" label={t("tabs.indicators")} />
      </Tabs>

      <Box key={activeTab}>
        {activeTab === "requests" && <AttachmentRequestsTable />}
        {activeTab === "indicators" && <AttachmentRequestChartsView />}
      </Box>
    </Box>
  );
}
