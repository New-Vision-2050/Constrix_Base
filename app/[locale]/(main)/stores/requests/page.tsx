import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import RequestsView from "@/modules/stores/requests/list/views";

function RequestsPage() {
  return <RequestsView />;
}

export default withServerPermissionsPage(RequestsPage, [Object.values(PERMISSIONS.ecommerce.order)]);