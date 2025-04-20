import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import ActivateUser from "./components/activate-user";
import ChangeUserPassword from "./components/change-password";

export const userStatusDataSections: UserProfileNestedTab[] = [
  {
    id: "user-status-activation",
    title: "تفعيل المستخدم",
    icon: <GraduationCapIcon />,
    content: <ActivateUser />,
  },
  {
    id: "user-status-password",
    title: "كلمة المرور",
    icon: <GraduationCapIcon />,
    content: <ChangeUserPassword />,
  },
];

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetUserStatusDataSections = (props: PropsT) => {
  const { handleChangeActiveSection } = props;

  return userStatusDataSections?.map((btn) => ({
    ...btn,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
