import usePaginate from "@/hooks/use-paginate";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { generatePages } from "@/utils/generate-pages";

interface PaginationProps {
  totalCount: number;
}

const Pagination = ({ totalCount }: PaginationProps) => {
  const {
    currentPage,
    handlePageChange: onPageChange,
    handlePageSizeChange,
    pageSize,
    pageSizesOptions,
  } = usePaginate();
  
  const totalPages = Math.floor(totalCount / pageSize);

  const pages = generatePages(totalPages, currentPage);

  return (
    <div className="flex items-center w-full pe-8">
      <div
        className={
          "flex grow items-center justify-center gap-x-2 py-2 relative z-10"
        }
      >
        <button
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#707070]",
            currentPage === 1 && "cursor-not-allowed opacity-50"
          )}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronRight className="rotate-0 ltr:rotate-180" />
        </button>
        {pages.map((page, index) => (
          <button
            key={index}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm",
              currentPage === page
                ? "bg-primary border-primary text-white"
                : "text-[#707070] border-[#434161]"
            )}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number"}
          >
            {page}
          </button>
        ))}
        <button
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#707070]",
            currentPage === totalPages && "cursor-not-allowed opacity-50"
          )}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="rotate-0 rtl:rotate-180" />
        </button>
      </div>{" "}
      <div className="ml-4">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
          dir="rtl"
        >
          <SelectTrigger className="border-none focus:ring-transparent  px-0 [&>svg]:opacity-100 text-[#E7E3FCAD] gap-2">
            <SelectValue>الصفوف لكل صفحة {pageSize}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {pageSizesOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                لكل صفحة {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
