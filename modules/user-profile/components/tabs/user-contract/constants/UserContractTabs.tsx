import { SystemTab } from "@/modules/settings/types/SystemTab";
import PersonalDataTab from "../tabs/PersonalData/PersonalData";
import AcademicAndExperience from "../tabs/AcademicAndExperience";
import FunctionalAndContractualData from "../tabs/FunctionalAndContractualData";
import FinancialBenefits from "../tabs/FinancialData";

export const GetUserContractTabsList = (
  t: (key: string) => string
): SystemTab[] => [
  {
    id: "user-contract-tab-personal-data",
    title: t("personalTab"),
    content: <PersonalDataTab />,
  },
  {
    id: "user-contract-tab-academic-experience",
    title: t("academicAndExperience"),
    content: <AcademicAndExperience />,
  },
  {
    id: "user-contract-tab-job-contract",
    title: t("employmentAndContractalData"),
    content: <FunctionalAndContractualData />,
  },
  {
    id: "user-contract-tab-financial",
    title: t("financialPrivileges"),
    content: <FinancialBenefits />,
  },
  {
    id: "user-contract-tab-contract-management",
    title: t("contractManagement"),
    content: <>ادارة العقد</>,
  },
];
