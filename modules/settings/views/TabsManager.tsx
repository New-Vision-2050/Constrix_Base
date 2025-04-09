import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { SystemSettingTabs } from "../constants/Tabs";

export default function TabsManager() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return <HorizontalTabs list={SystemSettingTabs} />;
}
