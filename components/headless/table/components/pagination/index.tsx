import React from "react";
import {
  Pagination as MuiPagination,
  Select,
  MenuItem,
  Typography,
  Stack,
  Grid,
} from "@mui/material";
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

    return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 4 }}></Grid>
        <Grid
          size={{ xs: 12, lg: 4 }}
          justifyContent={{ xs: "start", lg: "center" }}
          display="flex"
        >
          <MuiPagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => pagination.setPage(page)}
            color="primary"
            shape="rounded"
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }} justifyContent="end" display="flex">
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
        </Grid>
      </Grid>
    );
  };

  return PaginationComponent;
}
