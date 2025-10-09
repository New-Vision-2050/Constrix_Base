import { useQuery } from "@tanstack/react-query";
import getFoldersList from "../apis/get-folders-list";

export default function useFoldersList() {
  return useQuery({
    queryKey: ["folders"], // unique to each id
    queryFn: () => getFoldersList(),
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
