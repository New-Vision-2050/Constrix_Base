import { useQuery } from "@tanstack/react-query";
import getDocs from "../apis/get-docs";
import { SearchFormData } from "../../publicDocs/components/search-fields";

export default function useDocsData(
  branchId?: string,
  parentId?: string,
  password?: string,
  limit?: number,
  page?: number,
  searchData?: SearchFormData,
  sort?: string,
) {
  return useQuery({
    queryKey: [
      "empsDocs",
      branchId,
      parentId,
      password,
      limit,
      page,
      searchData,
      sort,
    ], // unique to each id
    queryFn: () =>
      getDocs(branchId, parentId, password, limit, page, searchData, sort),
    refetchOnWindowFocus: false, // don't refetch on tab switch
  });
}
