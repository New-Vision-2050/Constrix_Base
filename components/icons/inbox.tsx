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

  const Echo = useEcho();

  useEffect(() => {
    Echo?.echo
      ?.channel(Echo?.companyChannelName)
      .listen(".resource.shared", () => {
        pendingSharesCountQuery.refetch();
        console.log(
          "resource.shared event received, refetching pending shares count",
        );
      });
  }, [Echo?.echo, Echo?.companyChannelName]);

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
