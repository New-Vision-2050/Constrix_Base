import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import CommunicationSettingsView from "@/modules/content-management-system/communication-settings";

function CommunicationSettingsPage() {
    return <CommunicationSettingsView />;
}

export default withServerPermissionsPage(CommunicationSettingsPage, [
    Object.values(PERMISSIONS.CMS.communicationSettings).flatMap((p) => Object.values(p)),
]);