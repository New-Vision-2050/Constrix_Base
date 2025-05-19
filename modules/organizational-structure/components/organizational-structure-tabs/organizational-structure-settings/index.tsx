import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { OrganizationalStructureSettingsTabs } from "@/modules/organizational-structure/constants/organizational-structure-settings";
import { useTranslations } from "next-intl";

export default function OrganizationalStructureSettingsTab() {
  // declare and define component state and variables
  const t = useTranslations(
      "CompanyStructure.tabs.mainTabs.organizational-structure-main-tab-2.tabs"
    );
  // declare and define component helper methods
  // return component ui.
  return <HorizontalTabs list={OrganizationalStructureSettingsTabs(t)} />;
}
