import React from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { CircleUser, Inbox, Building } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";
import HRSettingsAttendanceDeparture from "@/modules/hr-settings-attendance-departure";
import { useTranslations } from "next-intl";
import HRSettingsVacations from "@/modules/hr-settings-vacations";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import InsuranceCompanyComponent from "@/modules/hr-settings/components/InsuranceCompany";

// ServiceTabs component for sub-tabs inside service
const ServiceTabs: React.FC = () => {
  const t = useTranslations("hr-settings.tabs");
  
  const serviceTabs = [
    {
      id: "insurance-company",
      title: t("insuranceCompany"),
      icon: <Building />,
      content: <InsuranceCompanyComponent />,
    },
  ];

  return <HorizontalTabs list={serviceTabs} />;
};

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
      id: "vacations",
      title: t("vacations"),
      icon: <Inbox />,
      content: <HRSettingsVacations />,
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
      content: <ServiceTabs />,
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
