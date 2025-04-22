import { SystemTab } from "@/modules/settings/types/SystemTab";
import UserContractTab from "../components/tabs/user-contract";
import UserProfileTab from "../components/tabs/user-profile";
import UserActionsTabs from "../components/tabs/user-actions";
import { useTranslations } from "next-intl";

export const useEditModeTabsList = (): SystemTab[] => {
  const t = useTranslations("EditModeTabs");

  return [
    {
      id: "edit-mode-tabs-profile",
      title: t("Profile"),
      content: <UserProfileTab />,
    },
    {
      id: "edit-mode-tabs-contract",
      title: t("WorkContract"),
      content: <UserContractTab />,
    },
    {
      id: "edit-mode-tabs-attendance",
      title: t("AttendancePolicy"),
      content: <>{t("AttendancePolicy")}</>, // Also translate content if it's just text
    },
    {
      id: "edit-mode-tabs-logs",
      title: t("UserActions"),
      content: <UserActionsTabs />,
    },
  ];
};
