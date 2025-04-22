import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { EditModeTabsList } from "../../constants/EditModeTabs";

export default function UserProfileTabs() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return <HorizontalTabs list={EditModeTabsList} />;
}
