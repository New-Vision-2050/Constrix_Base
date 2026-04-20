import WorkPanelIndex from "@/modules/work-panel";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function WorkPanelPage() {
    return <WorkPanelIndex />;
  },
  [
    [
      PERMISSIONS.humanResources.charts.view,
      PERMISSIONS.humanResources.procedures.view,
      PERMISSIONS.humanResources.services.view,
    ],
  ],
);
