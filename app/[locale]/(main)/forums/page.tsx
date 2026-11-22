import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ForumsModule from "@/modules/forums";

export default withServerPermissionsPage(
  function ForumsPage() {
    return <ForumsModule />;
  },
  [PERMISSIONS.forum.list],
);
