"use client";

import { useTranslations } from "next-intl";
import { Typography, IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface DepartmentHeaderProps {
  departmentIndex: number;
  totalDepartments: number;
  onRemove: () => void;
}

/**
 * Department section header with title and delete button
 * Delete button only shown when more than one department exists
 */
export default function DepartmentHeader({
  departmentIndex,
  totalDepartments,
  onRemove,
}: DepartmentHeaderProps) {
  const t = useTranslations("content-management-system.services");

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      gap={2}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {t("departmentNumber")} {departmentIndex + 1}
      </Typography>

      {totalDepartments > 1 && (
        <IconButton
          onClick={onRemove}
          size="small"
          sx={{
            color: (theme) =>
              theme.palette.mode === "dark" ? "#ef4444" : "#dc2626",
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Stack>
  );
}

