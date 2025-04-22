import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useEditModeTabsList } from "../../constants/EditModeTabs";
import { useTranslations } from "next-intl";

export default function UserProfileTabs() {
  // declare and define component state and variables
  const t = useTranslations('UserProfile.tabs');
  const editModeTabs = useEditModeTabsList();
  // declare and define component helper methods
  // return component ui.
  return <HorizontalTabs list={editModeTabs} />;
}
