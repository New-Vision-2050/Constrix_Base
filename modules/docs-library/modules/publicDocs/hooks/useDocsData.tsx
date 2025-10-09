import { useQuery } from "@tanstack/react-query";
import getDocs from "../apis/get-docs";
import { SearchFormData } from "../components/search-fields";

export default function useDocsData(
  branchId?: string,
  parentId?: string,
  password?: string,
  limit?: number,
  page?: number,
  searchData?: SearchFormData
) {
  return useQuery({
    queryKey: ["docs", branchId, parentId, password, limit, page, searchData], // unique to each id
    queryFn: () => getDocs(branchId, parentId, password, limit, page, searchData),
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
