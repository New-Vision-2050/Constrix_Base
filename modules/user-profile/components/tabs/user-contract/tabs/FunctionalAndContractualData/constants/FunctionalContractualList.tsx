import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import ContractualDataTab from "../components/contractual-data";
import JobInformation from "../components/job-information";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const FunctionalContractualList: UserProfileNestedTab[] = [
  {
    id: "functional-tab-contractual-contract-data",
    title: "البيانات التعاقدية",
    icon: <GraduationCapIcon />,
    type:"employment_contract",
    content: <ContractualDataTab />,
  },
  {
    id: "functional-tab-contractual-job-data",
    title: "البيانات الوظيفية",
    type:"jobOffer",
    icon: <GraduationCapIcon />,
    content: <JobInformation />,
  },
];

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetFunctionalContractualList = (props: PropsT) => {
  const { handleChangeActiveSection } = props;
  const { userDataStatus } = useUserProfileCxt();

  return FunctionalContractualList?.map((btn) => ({
    ...btn,
    valid: btn?.type
      ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
      : undefined,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
