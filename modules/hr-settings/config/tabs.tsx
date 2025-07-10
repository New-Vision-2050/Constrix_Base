import React from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { CircleUser, Inbox } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";
import HRSettingsAttendanceDeparture from "@/modules/hr-settings-attendance-departure";
import { useTranslations } from "next-intl";

// Tabs config for HR settings - this will be used in HRSettingsTabs component
const createHRSettingsTabs = (): SystemTab[] => {
  const t = useTranslations("hr-settings.tabs");
  
  return [
    {
      id: "employee-positions",
      title: t("attendance"),
      icon: <Inbox />,
      content: <HRSettingsAttendanceDeparture />,
    },
    {
      id: "departments",
      title: t("recruitment"),
      icon: <CircleUser />,
      content: <>{t("recruitment")}</>,
    },
    {
      id: "branches",
      title: t("service"),
      icon: <BackpackIcon />,
      content: <>{t("service")}</>,
    },
    {
      id: "job-titles",
      title: t("contractManagement"),
      content: <>{t("contractManagement")}</>,
    },
  ];
};

// Export a function to get the tabs instead of the static array
export { createHRSettingsTabs as HRSettingsTabs };
