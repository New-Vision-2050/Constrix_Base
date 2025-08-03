import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import Salaries from "../components/salaries";
import PrivilegesAndAllowances from "../components/privileges-and-allowances";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const financialDataSections = (): UserProfileNestedTab[] =>{
  const {can} = usePermissions();
  const shownTabs:string[] = [];

  if(can(Object.values(PERMISSIONS.profile.salaryInfo)))
    shownTabs.push("financial-data-salaries");
  if(can(Object.values(PERMISSIONS.profile.privileges.view)))
    shownTabs.push("financial-data-alternatives");

  const tabs = [
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
  ]

  return tabs.filter(tab => shownTabs.includes(tab.id));
};

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetFinancialDataSections = (props: PropsT) => {
  const { handleChangeActiveSection } = props;
  const { userDataStatus } = useUserProfileCxt();

  return financialDataSections().map((btn) => ({
    ...btn,
    valid: btn?.type
      ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
      : undefined,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
