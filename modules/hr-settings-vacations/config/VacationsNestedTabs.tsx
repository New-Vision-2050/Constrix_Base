import React from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { CircleUser, Inbox } from "lucide-react";
import { useTranslations } from "next-intl";
import VacationPoliciesTab from "../components/tabs/VacationPolicies";
import VacationTypes from "../components/tabs/VacationTypes";
import LeavePolicyCategories from "../components/tabs/LeavePolicyCategories";
import PublicVacations from "../components/tabs/PublicVacations";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

// Tabs config for HR settings - this will be used in HRSettingsTabs component
const getHRSettingsVacationsTabs = (): SystemTab[] => {
  const t = useTranslations("HRSettingsVacations.tabs");
  const { can } = usePermissions();

  const tabs: SystemTab[] = [
    {
      id: "hr-settings-vacations-leaves-policies",
      title: t("leavesPolicies"),
      icon: <Inbox />,
      content: <VacationPoliciesTab />,
    },
    {
      id: "hr-settings-vacations-leave-policy-categories",
      title: t("leavePolicyCategories"),
      icon: <Inbox />,
      content: <LeavePolicyCategories />,
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

  return tabs.filter(
    (tab) =>
      tab.id !== "hr-settings-vacations-leave-policy-categories" ||
      can(PERMISSIONS.vacations.settings.leavePolicyCategory.list),
  );
};

export default getHRSettingsVacationsTabs;
