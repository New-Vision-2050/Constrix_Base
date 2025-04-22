import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import ContractualDataTab from "../components/contractual-data";
import JobInformation from "../components/job-information";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useTranslations } from "next-intl";

const FunctionalContractualListBase: Omit<UserProfileNestedTab, 'title' | 'valid' | 'onClick'>[] = [
  {
    id: "functional-tab-contractual-contract-data",
    icon: <GraduationCapIcon />,
    type:"employment_contract",
    content: <ContractualDataTab />,
  },
  {
    id: "functional-tab-contractual-job-data",
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
  const tContract = useTranslations("UserContractTabs");
  const tJob = useTranslations("JobInformation");

  const titleMap: Record<string, string> = { // Use string for simplicity, assuming keys match
    "functional-tab-contractual-contract-data": tContract("ContractualData"),
    "functional-tab-contractual-job-data": tJob("JobData"),
  };

  return FunctionalContractualListBase.map((btn) => {
    const title = titleMap[btn.id] || ''; // Provide a default empty string

    return {
      ...btn,
      title,
      valid: btn?.type
        ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
        : undefined,
      onClick: () => handleChangeActiveSection({ ...btn, title }), // Pass the translated title
    };
  }) as UserProfileNestedTab[];
};
