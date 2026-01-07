import React from "react";
import {
  Pagination as MuiPagination,
  Select,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import { TableState } from "../table-state/types";

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

    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing{" "}
          {pagination.paginatedData.length > 0
            ? (pagination.page - 1) * pagination.limit + 1
            : 0}{" "}
          to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.totalItems)}{" "}
          of {pagination.totalItems} results
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {showPageSize && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <Select
                value={pagination.limit}
                onChange={(e) => pagination.setLimit(Number(e.target.value))}
                size="small"
                sx={{ minWidth: 70 }}
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          )}

          <MuiPagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => pagination.setPage(page)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>
      </Stack>
    );
  };

  return PaginationComponent;
}
