import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import MainSettings from "@/modules/content-management-system/main-settings";

function MainSettingsPage() {
    return <MainSettings />
}

export default withServerPermissionsPage(MainSettingsPage, [
    Object.values(PERMISSIONS.CMS.mainSettings)
]);