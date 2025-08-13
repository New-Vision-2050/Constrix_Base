import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import Salaries from "../components/salaries";
import PrivilegesAndAllowances from "../components/privileges-and-allowances";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const financialDataSections: UserProfileNestedTab[] = [
  {
    id: "financial-data-salaries",
    title: "الراتب",
    type: "user_salary",
    icon: <GraduationCapIcon />,
    content: <Salaries />,
  },
  {
    id: "financial-data-alternatives",
    title: "الامتيازات و البدلات",
    type: "userPrivilege",
    icon: <GraduationCapIcon />,
    content: <PrivilegesAndAllowances />,
  },
];

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetFinancialDataSections = (props: PropsT) => {
  const { handleChangeActiveSection } = props;
  const { userDataStatus } = useUserProfileCxt();

  return financialDataSections?.map((btn) => ({
    ...btn,
    valid: btn?.type
      ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
      : undefined,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
