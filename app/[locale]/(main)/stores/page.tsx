import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import HomeStore from "@/modules/stores/home";

function HomeStorePage() {
  return <HomeStore />;
}


export default withServerPermissionsPage(HomeStorePage, [Object.values(PERMISSIONS.ecommerce.dashboard)]);