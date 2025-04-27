import { SystemTab } from "@/modules/settings/types/SystemTab";
import PersonalDataTab from "../tabs/PersonalData/PersonalData";
import AcademicAndExperience from "../tabs/AcademicAndExperience";
import FunctionalAndContractualData from "../tabs/FunctionalAndContractualData";
import FinancialBenefits from "../tabs/FinancialData";
import { CircleDollarSign, GraduationCap, UserIcon } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";

export const GetUserContractTabsList = (
  t: (key: string) => string
): SystemTab[] => [
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
