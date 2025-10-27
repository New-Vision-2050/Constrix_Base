import HRSettingsContent from "@/modules/hr-settings";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function HRSettingsPage() {
    return <HRSettingsContent />;
  },
  [Object.values(PERMISSIONS.attendance.settings)]
);
