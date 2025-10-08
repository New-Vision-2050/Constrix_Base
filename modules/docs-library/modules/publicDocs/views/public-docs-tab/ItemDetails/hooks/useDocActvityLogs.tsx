import { useQuery } from "@tanstack/react-query";
import getDocActivityLogs from "../api/get-doc-activities";

export default function useDocActivityLogs(docId: string) {
  return useQuery({
    queryKey: ["doc-activities-logs", docId], // unique to each id
    queryFn: () => getDocActivityLogs(docId),
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
