import { SystemTab } from "@/modules/settings/types/SystemTab";
import UserStatusTab from "./nested-tabs/user-status";
import { useTranslations } from "next-intl";

export const useUserActionsTabsList = (): SystemTab[] => {
  const t = useTranslations("UserActionsTabs");

  return [
    {
      id: "user-actions-tabs-user-status",
      title: t("UserStatus"),
      content: <UserStatusTab />,
    },
    {
      id: "user-actions-tabs-sms",
      title: t("SMSMessages"),
      content: <>{t("SMSMessages")}</>, // Translate content as well
    },
    {
      id: "user-actions-tabs-social-platforms",
      title: t("SocialPlatforms"),
      content: <>{t("SocialPlatforms")}</>, // Translate content as well
    },
  ];
};
