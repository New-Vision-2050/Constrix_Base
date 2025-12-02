import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useGetEditModeTabsList } from "../../constants/EditModeTabs";
import { useTranslations } from "next-intl";
import { useUserProfileCxt } from "../../context/user-profile-cxt";

export default function UserProfileTabs({ userId, companyId }: { userId: string, companyId: string }) {
  // declare and define component state and variables
  const { tab1, setTab1 } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs");
  // declare and define component helper methods
  // return component ui.
  return (
    <HorizontalTabs
      bgStyleApproach
      onTabClick={(tab) => {
        setTab1(tab.id);
      }}
      list={useGetEditModeTabsList(t, userId, companyId)}
      defaultValue={tab1 !== null ? tab1 : undefined}
    />
  );
}
