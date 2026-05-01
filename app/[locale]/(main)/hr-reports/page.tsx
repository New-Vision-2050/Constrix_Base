import HRReportsIndex from "@/modules/hr-reports";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function HRReportsPage() {
    return <HRReportsIndex />;
  },
  [
    [
      PERMISSIONS.humanResources.charts.view,
      PERMISSIONS.humanResources.procedures.view,
      PERMISSIONS.humanResources.services.view,
    ],
  ],
);
