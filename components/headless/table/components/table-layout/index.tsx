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
    <Paper
      variant="outlined"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}
    >
      {filters && <Box sx={{ p: 2 }}>{filters}</Box>}
      <Box>{table}</Box>
      {pagination && <Box sx={{ p: 2 }}>{pagination}</Box>}
    </Paper>
  );
};
