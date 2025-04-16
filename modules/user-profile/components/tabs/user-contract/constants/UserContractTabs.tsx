import { SystemTab } from "@/modules/settings/types/SystemTab";
import PersonalDataTab from "../tabs/PersonalData/PersonalData";
import AcademicAndExperience from "../tabs/AcademicAndExperience";
import FunctionalAndContractualData from "../tabs/FunctionalAndContractualData";

export const UserContractTabsList: SystemTab[] = [
  {
    id: "user-contract-tab-personal-data",
    title: "البيانات الشخصية",
    content: <PersonalDataTab />,
  },
  {
    id: "user-contract-tab-academic-experience",
    title: "البيانات الاكاديمية والخبرة",
    content: <AcademicAndExperience />,
  },
  {
    id: "user-contract-tab-job-contract",
    title: "البيانات الوظيفية والتعاقدية",
    content: <FunctionalAndContractualData />,
  },
  {
    id: "user-contract-tab-financial",
    title: "البيانات المالية",
    content: <>البيانات المالية</>,
  },
  {
    id: "user-contract-tab-contract-management",
    title: "ادارة العقد",
    content: <>ادارة العقد</>,
  },
];
