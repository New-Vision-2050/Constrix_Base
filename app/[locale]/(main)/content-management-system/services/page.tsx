import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ServicesView from "@/modules/content-management-system/services";

function MainSettingsPage() {
  return <ServicesView />;
}

export default withServerPermissionsPage(MainSettingsPage, [
  Object.values(PERMISSIONS.CMS.services),
]);
