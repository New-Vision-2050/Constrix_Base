import withPermissionsPage from "@/lib/permissions/client/withPermissionsPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import CommunicationSettingsView from "@/modules/content-management-system/communication-settings";

function CommunicationSettingsPage() {
    return <CommunicationSettingsView />;
}

export default withPermissionsPage(CommunicationSettingsPage, [
    Object.values(PERMISSIONS.CMS.communicationSettings).flatMap((p) => Object.values(p)),
]);