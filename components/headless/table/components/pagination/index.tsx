"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { TableState } from "../..";

// ============================================================================
// Pagination Component
// ============================================================================

export type PaginationProps<TRow> = {
  state: TableState<TRow>;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
};

export function createPaginationComponent<TRow>() {
  const PaginationComponent = ({
    state,
    showPageSize = true,
    pageSizeOptions = [5, 10, 25, 50, 100],
  }: PaginationProps<TRow>) => {
    const { pagination } = state;
    const t = useTranslations("Table");

    const renderPageButtons = () => {
      const pages: React.ReactNode[] = [];
      const MAX_VISIBLE_PAGES = 5;
      const effectiveTotalPages = Math.max(1, pagination.totalPages);

      let startPage = Math.max(
        1,
        pagination.page - Math.floor(MAX_VISIBLE_PAGES / 2),
      );
      let endPage = Math.min(
        effectiveTotalPages,
        startPage + MAX_VISIBLE_PAGES - 1,
      );

      if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
        startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
      }

      // Previous button
      pages.push(
        <Button
          key="prev"
          variant="outline"
          size="icon"
          onClick={() => pagination.setPage(Math.max(1, pagination.page - 1))}
          disabled={pagination.page === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </Button>,
      );

      if (startPage > 1) {
        pages.push(
          <Button
            key="1"
            variant={pagination.page === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => pagination.setPage(1)}
            className="h-8 w-8 px-0"
          >
            1
          </Button>,
        );
        if (startPage > 2) {
          pages.push(
            <span key="ellipsis1" className="px-1">
              ...
            </span>,
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <Button
            key={i}
            variant={pagination.page === i ? "default" : "outline"}
            size="sm"
            onClick={() => pagination.setPage(i)}
            className="h-8 w-8 px-0"
          >
            {i}
          </Button>,
        );
      }

      if (endPage < effectiveTotalPages) {
        if (endPage < effectiveTotalPages - 1) {
          pages.push(
            <span key="ellipsis2" className="px-1">
              ...
            </span>,
          );
        }
        pages.push(
          <Button
            key={effectiveTotalPages}
            variant={
              pagination.page === effectiveTotalPages ? "default" : "outline"
            }
            size="sm"
            onClick={() => pagination.setPage(effectiveTotalPages)}
            className="h-8 w-8 px-0"
          >
            {effectiveTotalPages}
          </Button>,
        );
      }

      // Next button
      pages.push(
        <Button
          key="next"
          variant="outline"
          size="icon"
          onClick={() =>
            pagination.setPage(
              Math.min(effectiveTotalPages, pagination.page + 1),
            )
          }
          disabled={pagination.page === effectiveTotalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Button>,
      );

      return pages;
    };

    return (
      <div className="relative flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex grow items-center justify-center space-x-2 rtl:space-x-reverse">
          {renderPageButtons()}
        </div>
        {showPageSize && (
          <div className="flex items-center gap-2 sm:absolute sm:end-0">
            <span className="text-sm text-muted-foreground">
              {t("RowsPerPage")}
            </span>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => pagination.setLimit(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  return PaginationComponent;
}
