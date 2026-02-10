import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import Salaries from "../components/salaries";
import PrivilegesAndAllowances from "../components/privileges-and-allowances";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const financialDataSections = (): UserProfileNestedTab[] => {
  const { can } = usePermissions();

  const tabs: (UserProfileNestedTab & { show: boolean })[] = [
    {
      id: "financial-data-salaries",
      title: "الراتب",
      type: "user_salary",
      icon: <GraduationCapIcon />,
      content: <Salaries />,
      show: can([PERMISSIONS.profile.salaryInfo.view]),
    },
    {
      id: "financial-data-alternatives",
      title: "الامتيازات و البدلات",
      type: "userPrivilege",
      icon: <GraduationCapIcon />,
      content: <PrivilegesAndAllowances />,
      show: can([PERMISSIONS.profile.privileges.view]),
    },
  ];
  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetFinancialDataSections = (props: PropsT) => {
  const { handleChangeActiveSection } = props;
  const { userDataStatus } = useUserProfileCxt();
  const sections = financialDataSections();

  return sections.map((btn) => ({
    ...btn,
    valid: btn?.type
      ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
      : undefined,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
