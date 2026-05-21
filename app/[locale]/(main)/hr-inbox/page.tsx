import HrInboxPageView from "@/modules/hr-inbox/HrInboxPageView";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function HrInboxPage() {
    return <HrInboxPageView />;
  },
  [
    [
      PERMISSIONS.humanResources.charts.view,
      PERMISSIONS.humanResources.procedures.view,
      PERMISSIONS.humanResources.services.view,
    ],
  ],
);
