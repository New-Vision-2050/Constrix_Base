import { useEcho } from "@/hooks/use-echo";
import { SharesApi } from "@/services/api/shares";
import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { useEffect } from "react";

function InboxIconWithCount() {
  const pendingSharesCountQuery = useQuery({
    queryKey: ["pendingSharesCount"],
    queryFn: async () => {
      const res = await SharesApi.getPendingCount();
      return res.data.payload.count;
    },
  });

  const { echo, companyChannelName } = useEcho();

  useEffect(() => {
    echo?.channel(companyChannelName).listen(".resource.shared", () => {
      pendingSharesCountQuery.refetch();
      console.log(
        "resource.shared event received, refetching pending shares count",
      );
    });
  }, [echo, companyChannelName]);

  return (
    <Badge
      badgeContent={pendingSharesCountQuery.data}
      color="error"
      invisible={!pendingSharesCountQuery.data}
    >
      <Inbox />
    </Badge>
  );
}

export default InboxIconWithCount;
