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
    echo?.listen(
      companyChannelName,
      "resource.shared",
      pendingSharesCountQuery.refetch,
    );
    return () => {
      echo?.stopListening(companyChannelName, "resource.shared");
    };
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
