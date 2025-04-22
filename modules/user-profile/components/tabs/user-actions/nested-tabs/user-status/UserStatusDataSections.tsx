import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import ActivateUser from "./components/activate-user";
import ChangeUserPassword from "./components/change-password";
import { useTranslations } from "next-intl";

const userStatusDataSectionsBase: Omit<UserProfileNestedTab, 'title'>[] = [
  {
    id: "user-status-activation",
    icon: <GraduationCapIcon />,
    content: <ActivateUser />,
    ignoreValidation: true,
  },
  {
    id: "user-status-password",
    icon: <GraduationCapIcon />,
    content: <ChangeUserPassword />,
    ignoreValidation: true,
  },
];

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetUserStatusDataSections = (props: PropsT) => {
  const { handleChangeActiveSection } = props;
  const t = useTranslations("UserStatusDataSections");

  return userStatusDataSectionsBase.map((btn) => {
    let titleKey: string | null = null; // Use string type instead
    if (btn.id === "user-status-activation") {
      titleKey = "ActivateUser";
    } else if (btn.id === "user-status-password") {
      titleKey = "Password";
    }

    return {
      ...btn,
      title: titleKey ? t(titleKey) : '',
      onClick: () => handleChangeActiveSection({ ...btn, title: titleKey ? t(titleKey) : '' }),
    };
  }) as UserProfileNestedTab[];
};
