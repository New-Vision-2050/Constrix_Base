import Can from "@/lib/permissions/client/Can";
import { ChatSettingsTabs } from "./constants/Tabs";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ChatSettingsTab() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return (
    <Can check={[PERMISSIONS.driver.view]}>
      <HorizontalTabs list={ChatSettingsTabs} />
    </Can>
  );
}
