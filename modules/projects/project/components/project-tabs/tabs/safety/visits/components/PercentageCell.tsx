"use client";

import { Box } from "@mui/material";

type PercentageCellProps = {
  value: number;
};

function getPercentageColor(
  value: number,
): "success.main" | "warning.main" | "error.main" {
  if (value >= 75) return "success.main";
  if (value >= 50) return "warning.main";
  return "error.main";
}

export default function PercentageCell({ value }: PercentageCellProps) {
  return (
    <Box component="span" sx={{ color: getPercentageColor(value), fontWeight: 600 }}>
      %{value}
    </Box>
  );
}
