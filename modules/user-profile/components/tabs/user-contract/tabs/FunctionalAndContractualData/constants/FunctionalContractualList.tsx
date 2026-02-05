import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import ContractualDataTab from "../components/contractual-data";
import JobInformation from "../components/job-information";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";
export const FunctionalContractualList = (): UserProfileNestedTab[] => {
  const { can } = usePermissions();
  const t = useTranslations("UserProfile.header.placeholder");

  const tabs: (UserProfileNestedTab & { show: boolean })[] = [
    {
      id: "functional-tab-contractual-contract-data",
      title: t("contractualContractData"),
      icon: <GraduationCapIcon />,
      type: "employment_contract",
      content: <ContractualDataTab />,
      show: can([
        PERMISSIONS.profile.contractWork.view,
        PERMISSIONS.profile.jobOffer.view,
      ]),
    },
    {
      id: "functional-tab-contractual-job-data",
      title: t("contractualJobData"),
      type: "user_professional_data",
      icon: <GraduationCapIcon />,
      content: <JobInformation />,
      show: can([PERMISSIONS.profile.employmentInfo.view]),
    },
  ];

  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};
type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetFunctionalContractualList = (props: PropsT) => {
  const { handleChangeActiveSection } = props;
  const { userDataStatus } = useUserProfileCxt();

  return FunctionalContractualList()?.map((btn) => ({
    ...btn,
    valid: btn?.type
      ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
      : undefined,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
