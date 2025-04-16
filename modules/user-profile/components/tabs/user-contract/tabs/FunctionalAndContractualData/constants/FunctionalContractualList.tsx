import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";

export const FunctionalContractualList: UserProfileNestedTab[] = [
  {
    id: "functional-tab-contractual-contract-data",
    title: "البيانات التعاقدية",
    icon: <GraduationCapIcon />,
    content: <>البيانات التعاقدية</>,
  },
  {
    id: "functional-tab-contractual-job-data",
    title: "البيانات الوظيفية",
    icon: <GraduationCapIcon />,
    content: <>البيانات الوظيفية</>,
  },
];
