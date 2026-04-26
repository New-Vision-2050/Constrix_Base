import { EchoContext } from "@/providers/echo-provider";
import { SharesApi } from "@/services/api/shares";
import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { useContext, useEffect } from "react";

function InboxIconWithCount() {
  const ctx = useContext(EchoContext);
  const { echo, companyChannelName } = ctx ?? {};

  const pendingSharesCountQuery = useQuery({
    queryKey: ["pendingSharesCount"],
    queryFn: async () => {
      const res = await SharesApi.getPendingCount();
      return res.data.payload.count;
    },
    enabled: !!ctx,
  });

  useEffect(() => {
    if (!echo || !companyChannelName) return;
    echo.channel(companyChannelName).listen(".resource.shared", () => {
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
