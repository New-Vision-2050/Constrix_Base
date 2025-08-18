import React from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { CircleUser, Inbox } from "lucide-react";
import { useTranslations } from "next-intl";
import VacationPoliciesTab from "../components/tabs/VacationPolicies";
import VacationTypes from "../components/tabs/VacationTypes";
import PublicVacations from "../components/tabs/PublicVacations";

// Tabs config for HR settings - this will be used in HRSettingsTabs component
const getHRSettingsVacationsTabs = (): SystemTab[] => {
  const t = useTranslations("HRSettingsVacations.tabs");

  return [
    {
      id: "hr-settings-vacations-leaves-policies",
      title: t("leavesPolicies"),
      icon: <Inbox />,
      content: <VacationPoliciesTab />,
    },
    {
      id: "hr-settings-vacations-leaves-types",
      title: t("leavesTypes"),
      icon: <Inbox />,
      content: <VacationTypes />,
    },
    {
      id: "hr-settings-vacations-public-leaves",
      title: t("publicLeaves"),
      icon: <CircleUser />,
      content: <PublicVacations />,
    },
  ];
};

export default getHRSettingsVacationsTabs;
