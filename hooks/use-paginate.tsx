import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useUpdateQueryParamsWithDebounce from "./use-update-query-param-with-debounce";

const usePaginate = () => {
  const s = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(s.get("page")) ? Number(s.get("page")) : 1
  );
  const [pageSize, setPageSize] = useState(
    Number(s.get("pageSize")) ? Number(s.get("pageSize")) : 10
  );
  const updateQueryParams = useUpdateQueryParamsWithDebounce();
  const pageSizesOptions = [5, 10, 20, 50, 100];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ page });
  };
  const handlePageSizeChange = (size: number) => {
    setCurrentPage(1);
    setPageSize(size);
    updateQueryParams({ page: 1, pageSize: size });
  };
  return {
    currentPage,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
    pageSizesOptions,
  };
};

export default usePaginate;
