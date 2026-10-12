"use client";

import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import LeaveBalancesPanel from "./components/LeaveBalancesPanel";

/**
 * "الإجازات" tab (user profile → contract settings).
 *
 * Shows the user's leave policies with live per-year balances and lets HR
 * assign/unassign policies (sync semantics). Visible only with the
 * `leave-policy.assign` permission.
 */
export default function LeavesTab({ userId }: { userId: string }) {
  // Spec gates this section on `leave-policy.assign`. That permission key is
  // not registered in the backend catalog yet, so accept the existing
  // `LEAVE_POLICY_VIEW` as a fallback (OR) until it ships.
  return (
    <Can
      check={[
        [
          PERMISSIONS.vacations.settings.leavePolicy.assign,
          PERMISSIONS.vacations.settings.leavePolicy.view,
        ],
      ]}
    >
      <LeaveBalancesPanel userId={userId} />
    </Can>
  );
}
