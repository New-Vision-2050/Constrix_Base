"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Box, Tab, Tabs } from "@mui/material";
import CreateClientCompanyForm from "./company";
import LoadCompanyClientTab from "./LoadCompanyClientTab";

const TAB_LOAD = "load-company-client";
const TAB_MANUAL = "manual-company-client";

const tabsSx = {
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "4px 4px 0 0",
  },
  "& .MuiTab-root": {
    textTransform: "none",
    minHeight: 48,
  },
} as const;

export default function CreateCompanyClientSection({
  sub_entity_id,
  handleRefreshWidgetsData,
}: {
  handleRefreshWidgetsData?: () => void;
  sub_entity_id?: string;
}) {
  const t = useTranslations("ClientsModule.form");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [tabValue, setTabValue] = useState<string>(TAB_LOAD);

  return (
    <Box className="flex flex-col gap-1">
      <Tabs
        value={tabValue}
        onChange={(_, v: string) => setTabValue(v)}
        dir={isRtl ? "rtl" : "ltr"}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        indicatorColor="primary"
        textColor="primary"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          ...tabsSx,
          "& .MuiTabs-scroller": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },
        }}
      >
        <Tab label={t("companyClientNestedLoadTab")} value={TAB_LOAD} />
        <Tab label={t("companyClientNestedManualTab")} value={TAB_MANUAL} />
      </Tabs>

      <Box
        role="tabpanel"
        hidden={tabValue !== TAB_LOAD}
        sx={{ pt: 2 }}
        aria-hidden={tabValue !== TAB_LOAD}
      >
        <LoadCompanyClientTab
          handleRefreshWidgetsData={handleRefreshWidgetsData}
        />
      </Box>

      <Box
        role="tabpanel"
        hidden={tabValue !== TAB_MANUAL}
        sx={{ pt: 2 }}
        aria-hidden={tabValue !== TAB_MANUAL}
      >
        <CreateClientCompanyForm
          sub_entity_id={sub_entity_id}
          handleRefreshWidgetsData={handleRefreshWidgetsData}
        />
      </Box>
    </Box>
  );
}
