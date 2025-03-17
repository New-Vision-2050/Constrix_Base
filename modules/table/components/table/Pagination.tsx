import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/modules/table/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/modules/table/components/ui/select";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  itemsPerPage,
  totalPages,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {

  const t = useTranslations();

  const renderPageButtons = () => {
    const pages = [];
    const MAX_VISIBLE_PAGES = 5;
    
    // Ensure totalPages is at least 1 to prevent pagination issues
    const effectiveTotalPages = Math.max(1, totalPages);
    
    let startPage = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    let endPage = Math.min(effectiveTotalPages, startPage + MAX_VISIBLE_PAGES - 1);

    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    // Add previous button
    pages.push(
      <Button
        key="prev"
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </Button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key="1"
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(1)}
          className="h-8 w-8 px-0"
        >
          1
        </Button>
      );

      // Ellipsis if needed
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-1">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          className="h-8 w-8 px-0 "
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < effectiveTotalPages) {
      // Ellipsis if needed
      if (endPage < effectiveTotalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-1">
            ...
          </span>
        );
      }

      pages.push(
        <Button
          key={effectiveTotalPages}
          variant={currentPage === effectiveTotalPages ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(effectiveTotalPages)}
          className="h-8 w-8 px-0 "
        >
          {effectiveTotalPages}
        </Button>
      );
    }

    // Add next button
    pages.push(
      <Button
        key="next"
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(effectiveTotalPages, currentPage + 1))}
        disabled={currentPage === effectiveTotalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </Button>
    );

    return pages;
  };

  return (
    <div className="relative p-2 md:p-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center grow justify-center space-x-2 rtl:space-x-reverse order-1 sm:order-2">
        {renderPageButtons()}
      </div>{" "}
      <div className=" absolute end-10 top-1/2 -translate-y-1/2 flex items-center order-2 sm:order-1 sm:w-auto">
        <span className="text-sm text-muted-foreground me-2">
          {t("Table.RowsPerPage")}
        </span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
