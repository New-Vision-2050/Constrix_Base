"use client";

import { Chip } from "@mui/material";

type WorkOrderTypeBadgeProps = {
  label: string;
};

function resolveColor(
  label: string,
): "success" | "warning" | "default" {
  const normalized = label.trim().toLowerCase();
  if (
    normalized.includes("طوار") ||
    normalized.includes("emergency") ||
    normalized.includes("urgent")
  ) {
    return "warning";
  }
  if (
    normalized.includes("إنش") ||
    normalized.includes("انش") ||
    normalized.includes("construct")
  ) {
    return "success";
  }
  return "default";
}

export default function WorkOrderTypeBadge({ label }: WorkOrderTypeBadgeProps) {
  if (!label) {
    return <span>—</span>;
  }

  const color = resolveColor(label);

  return (
    <Chip
      label={label}
      size="small"
      color={color}
      variant={color === "default" ? "outlined" : "filled"}
      sx={{
        minWidth: 72,
        borderRadius: "16px",
        fontWeight: 500,
        "& .MuiChip-label": { px: 1.5 },
      }}
    />
  );
}
