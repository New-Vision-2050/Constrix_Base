import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import CommunicationMessagesClientWrapper from "@/modules/content-management-system/communication-messages/CommunicationMessagesClientWrapper";

function CommunicationContactMessagesPage() {
  return <CommunicationMessagesClientWrapper />;
}

export default withServerPermissionsPage(CommunicationContactMessagesPage, [
  Object.values(PERMISSIONS.CMS.communicationContactMessages),
]);
