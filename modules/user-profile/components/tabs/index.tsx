import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { getEditModeTabsList } from "../../constants/EditModeTabs";
import { useTranslations } from "next-intl";
import { useUserProfileCxt } from "../../context/user-profile-cxt";

export default function UserProfileTabs() {
  // declare and define component state and variables
  const { tab1 } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs");
  // declare and define component helper methods
  // return component ui.
  return (
    <HorizontalTabs
      bgStyleApproach
      list={getEditModeTabsList(t)}
      defaultValue={tab1 !== null ? tab1 : undefined}
    />
  );
}
