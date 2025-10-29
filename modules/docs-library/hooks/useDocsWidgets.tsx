import { useQuery } from "@tanstack/react-query";
import getDocsWidgets from "../api/get-docs-widgets";

export default function useDocsWidgets(parentId?: string) {
  return useQuery({
    queryKey: ["docs-widgets", parentId], // unique to each id
    queryFn: () => getDocsWidgets(parentId),
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
