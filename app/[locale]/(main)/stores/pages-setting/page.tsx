import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import PagesSettingView from "@/modules/stores/pages-setting";

function PagesSettingPage() {
  return <PagesSettingView />;
}

export default withServerPermissionsPage(PagesSettingPage, [Object.values(PERMISSIONS.ecommerce.banner)]);