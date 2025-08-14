import AttendanceDepartureIndex from "@/modules/attendance-departure";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function AttendanceDeparturePage() {
    return <AttendanceDepartureIndex />;
  },
  [Object.values(PERMISSIONS.attendance.attendance_departure)]
);
