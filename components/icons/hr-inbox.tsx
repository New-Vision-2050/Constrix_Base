import { Badge } from "@mui/material";
import { Inbox } from "lucide-react";
import { useApprovalInboxCounts } from "@/modules/hr-inbox/hooks/useApprovalInboxCounts";

/**
 * Sidebar inbox icon. The badge is the grand total waiting on the user:
 * employee tasks + leave requests + advance requests (shares query cache
 * with the hr-inbox page count cards/badges).
 */
function HrInboxIconWithCount() {
  const { tasksCount, leaveCount, advanceCount } = useApprovalInboxCounts();
  const count = tasksCount + leaveCount + advanceCount;

  return (
    <Badge
      badgeContent={count > 0 ? count : undefined}
      color="error"
      invisible={!count}
    >
      <Inbox />
    </Badge>
  );
}

export default HrInboxIconWithCount;
