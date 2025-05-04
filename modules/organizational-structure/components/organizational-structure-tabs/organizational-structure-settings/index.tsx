import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { OrganizationalStructureSettingsTabs } from "@/modules/organizational-structure/constants/organizational-structure-settings";

export default function OrganizationalStructureSettingsTab() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return <HorizontalTabs list={OrganizationalStructureSettingsTabs} />;
}
