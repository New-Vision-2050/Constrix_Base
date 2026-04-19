import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ClientRequestsList from "@/modules/crm-settings/client-requests";

function ClientRequestsPage() {
  return <ClientRequestsList />;
}
export default withServerPermissionsPage(ClientRequestsPage, [
  PERMISSIONS.clientRequest.list,
]);
