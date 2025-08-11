/**
 * Pagination Component
 * Displays navigation for paginated content with RTL support
 */
import React from "react";
import { PaginationProps } from "./types";
import PaginationButton from "./PaginationButton";
import PageNumber from "./PageNumber";
import { useLocale, useTranslations } from "next-intl";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  // New props with default values
  currentLimit = 10,
  limitOptions = [5, 10, 25, 50, 100],
  onLimitChange,
}) => {
  // get locale
  const locale = useLocale();
  const isRtl = locale === "ar";
  // Get translations
  const t = useTranslations("common");
  // Generate page numbers to display with ellipsis for many pages
  const getPageNumbers = () => {
    // Always show first and last page, and 1-2 pages around current
    const pageNumbers: number[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Complex logic for more pages with ellipsis
      pageNumbers.push(1); // Always show first page

      if (currentPage > 3) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(-2); // -2 represents second ellipsis
      }

      pageNumbers.push(totalPages); // Always show last page
    }

    return pageNumbers;
  };

  return (
    <div className={`flex items-center justify-between gap-1 ${className}`}>
      {/* Limit selector */}
      {onLimitChange && (
        <div className={`flex items-center gap-2 text-sm absolute left-[3%] ${!isRtl ? "left-[85%]" : "left-[3%]"}`}>
          <span className="text-gray-400">
            {t("itemsPerPage", { defaultValue: "عناصر في الصفحة" })}
          </span>
          <select
            value={currentLimit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white outline-none focus:border-pink-500 rtl:text-right"
            aria-label={t("selectItemsPerPage", {
              defaultValue: "اختر عدد العناصر في الصفحة",
            })}
          >
            {limitOptions.map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center justify-center gap-1">
        {/* Previous button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          ariaLabel="Previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </PaginationButton>

        {/* Page numbers */}
        <div className="flex items-center space-x-1 mx-2">
          {getPageNumbers().map((pageNumber, index) =>
            pageNumber < 0 ? (
              // Render ellipsis
              <span
                key={`ellipsis-${index}`}
                className="w-10 text-center text-gray-400"
              >
                ...
              </span>
            ) : (
              // Render page number
              <PageNumber
                key={`page-${pageNumber}`}
                page={pageNumber}
                isActive={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
              />
            )
          )}
        </div>

        {/* Next button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          ariaLabel="Next page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </PaginationButton>
      </div>
    </div>
  );
};

export default Pagination;
