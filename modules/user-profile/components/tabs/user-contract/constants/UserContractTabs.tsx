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

  const tabs : (SystemTab & { show: boolean })[]= [
    {
      id: "user-contract-tab-personal-data",
      title: t("personalTab"),
      icon: <UserIcon />,
      content: <PersonalDataTab />,
      show: true,
    },
    {
      id: "user-contract-tab-academic-experience",
      title: t("academicAndExperience"),
      icon: <GraduationCap />,
      content: <AcademicAndExperience />,
      show: true,
    },
    {
      id: "user-contract-tab-job-contract",
      title: t("employmentAndContractalData"),
      icon: <BackpackIcon />,
      content: <FunctionalAndContractualData />,
      show: true,
    },
    {
      id: "user-contract-tab-financial",
      title: t("financialPrivileges"),
      icon: <CircleDollarSign />,
      content: <FinancialBenefits />,
      show: true,
    },
    {
      id: "user-contract-tab-contract-management",
      title: t("contractManagement"),
      icon: <BackpackIcon />,
      content: <>ادارة العقد</>,
      show: true,
    },
  ];

  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};
