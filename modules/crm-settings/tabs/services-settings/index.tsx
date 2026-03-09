import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import ServicesSettingsView from "./ServicesSettingsView";

export default function ServicesSettings() {
  return (
    <Can check={[PERMISSIONS.crm.serviceSettings.list]}>
      <ServicesSettingsView />
    </Can>
  )
}