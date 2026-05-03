import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ClientRequestDetailsRoute from "@/modules/crm-settings/client-requests/views/details/ClientRequestDetailsRoute";

function ClientRequestDetailsPage() {
  return <ClientRequestDetailsRoute />;
}

export default withServerPermissionsPage(ClientRequestDetailsPage, [
  PERMISSIONS.clientRequest.list,
]);
