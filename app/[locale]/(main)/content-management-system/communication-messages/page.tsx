import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import CommunicationMessagesView from "@/modules/content-management-system/communication-messages";

function CommunicationContactMessagesPage() {
    return <CommunicationMessagesView />;
}

export default withServerPermissionsPage(CommunicationContactMessagesPage,[Object.values(PERMISSIONS.CMS.communicationContactMessages)]);