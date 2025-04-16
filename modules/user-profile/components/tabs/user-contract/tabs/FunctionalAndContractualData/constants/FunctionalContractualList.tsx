import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import ContractualDataTab from "../components/contractual-data";
import JobInformation from "../components/job-information";

export const FunctionalContractualList: UserProfileNestedTab[] = [
  {
    id: "functional-tab-contractual-contract-data",
    title: "البيانات التعاقدية",
    icon: <GraduationCapIcon />,
    content: <ContractualDataTab />,
  },
  {
    id: "functional-tab-contractual-job-data",
    title: "البيانات الوظيفية",
    icon: <GraduationCapIcon />,
    content: <JobInformation />,
  },
];

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetFunctionalContractualList = (props: PropsT) => {
  const { handleChangeActiveSection } = props;

  return FunctionalContractualList?.map((btn) => ({
    ...btn,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
