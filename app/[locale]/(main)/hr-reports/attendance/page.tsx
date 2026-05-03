import HRReportsAttendanceIndex from "@/modules/hr-reports/attendance";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function HRReportsAttendancePage() {
    return <HRReportsAttendanceIndex />;
  },
  [
    [
      PERMISSIONS.humanResources.charts.view,
      PERMISSIONS.humanResources.procedures.view,
      PERMISSIONS.humanResources.services.view,
    ],
  ],
);
