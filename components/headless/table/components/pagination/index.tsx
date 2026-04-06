"use client";
import React from "react";
import {
  Pagination as MuiPagination,
  Select,
  MenuItem,
  Typography,
  Stack,
  Grid,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
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
    const locale = useLocale();
    console.log("Locale from table pagination component", locale);

    return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 4 }}></Grid>
        <Grid
          size={{ xs: 12, lg: 4 }}
          justifyContent={{ xs: "start", lg: "center" }}
          display="flex"
        >
          <MuiPagination
            key={locale}
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) => pagination.setPage(page)}
            color="primary"
            shape="rounded"
            variant="text"
            sx={{
              "& .MuiPaginationItem-text": {
                bgcolor: "background.default",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "divider",
                minWidth: "30px",
                height: "30px",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                borderColor: "primary.main",
                minWidth: "34px",
                height: "34px",
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }} justifyContent="end" display="flex">
          {showPageSize && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t("RowsPerPage")}
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
