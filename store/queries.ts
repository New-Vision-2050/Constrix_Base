import { tableRepository } from "@/repositories/table-repository";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetTableData = (queryKey: string, endPoint: string) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const page_size = searchParams.get("pageSize")
    ? parseInt(searchParams.get("pageSize")!)
    : 10;

  const params = { page, page_size };

  return useQuery({
    queryKey: [queryKey, params],
    queryFn: () => tableRepository.getTableData(endPoint, params),
  });
};
