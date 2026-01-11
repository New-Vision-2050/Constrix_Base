import React from "react";
import { Box, Paper } from "@mui/material";
import { TableLayoutProps } from "./types";

// ============================================================================
// TableLayout Component
// ============================================================================

export const TableLayoutComponent = ({
  filters,
  table,
  pagination,
}: TableLayoutProps) => {
  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      {filters && (
        <Paper sx={{ p: 2 }} variant="outlined">
          {filters}
        </Paper>
      )}
      <Box>{table}</Box>
      {pagination && (
        <Paper sx={{ p: 2 }} variant="outlined">
          {pagination}
        </Paper>
      )}
    </Box>
  );
};
