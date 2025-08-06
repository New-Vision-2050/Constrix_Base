import { SystemTab } from "@/modules/settings/types/SystemTab";
import PersonalDataTab from "../tabs/PersonalData/PersonalData";
import AcademicAndExperience from "../tabs/AcademicAndExperience";
import FunctionalAndContractualData from "../tabs/FunctionalAndContractualData";
import FinancialBenefits from "../tabs/FinancialData";
import { CircleDollarSign, GraduationCap, UserIcon } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const GetUserContractTabsList = (
  t: (key: string) => string
): SystemTab[] => {
  // declare and define component state and variables
  const { can } = usePermissions();
  const showenTabs: string[] = [];

  // check permissions
  if (can(PERMISSIONS.profile.personalInfo.view))
    showenTabs.push("user-contract-tab-personal-data");
  if (can(PERMISSIONS.profile.education.view))
    showenTabs.push("user-contract-tab-academic-experience");
  if (can(PERMISSIONS.profile.employmentInfo.view))
    showenTabs.push("user-contract-tab-job-contract");
  if (can(PERMISSIONS.profile.salaryInfo.view))
    showenTabs.push("user-contract-tab-financial");

  const tabs = [
    {
      id: "user-contract-tab-personal-data",
      title: t("personalTab"),
      icon: <UserIcon />,
      content: <PersonalDataTab />,
    },
    {
      id: "user-contract-tab-academic-experience",
      title: t("academicAndExperience"),
      icon: <GraduationCap />,
      content: <AcademicAndExperience />,
    },
    {
      id: "user-contract-tab-job-contract",
      title: t("employmentAndContractalData"),
      icon: <BackpackIcon />,
      content: <FunctionalAndContractualData />,
    },
    {
      id: "user-contract-tab-financial",
      title: t("financialPrivileges"),
      icon: <CircleDollarSign />,
      content: <FinancialBenefits />,
    },
    {
      id: "user-contract-tab-contract-management",
      title: t("contractManagement"),
      icon: <BackpackIcon />,
      content: <>ادارة العقد</>,
    },
  ];

  return tabs.filter((tab) => showenTabs.includes(tab.id));
};
