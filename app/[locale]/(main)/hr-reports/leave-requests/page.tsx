import ApprovalReportPage from "@/modules/hr-reports/approval-requests/ApprovalReportPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

export default withServerPermissionsPage(
  function LeaveRequestsReportPage() {
    return <ApprovalReportPage kind="leave" />;
  },
  [[PERMISSIONS.vacations.leaveRequests.list]],
);
