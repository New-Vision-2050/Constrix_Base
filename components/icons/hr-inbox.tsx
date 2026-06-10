import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { apiClient } from "@/config/axios-config";

export const HR_INBOX_COUNT_QUERY_KEY = ["hr-inbox-total-count"];

function HrInboxIconWithCount() {
  const countQuery = useQuery({
    queryKey: HR_INBOX_COUNT_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get("/admin/employee-tasks/inbox-counts");
      const payload = res.data?.payload || res.data;
      return payload?.total ?? 0;
    },
  });

  const count = countQuery.data ?? 0;

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
