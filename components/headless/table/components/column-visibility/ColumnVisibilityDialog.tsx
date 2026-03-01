import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { ColumnDef } from "../table-component/types";
import { ColumnVisibilityState } from "./useColumnVisibility";

export type ColumnVisibilityDialogProps<TRow> = {
  open: boolean;
  onClose: () => void;
  columns: ColumnDef<TRow>[];
  columnVisibility: ColumnVisibilityState;
  toggleColumn: (columnKey: string) => void;
  showAllColumns: () => void;
  hideAllColumns: () => void;
  resetColumnVisibility: () => void;
};

export function ColumnVisibilityDialog<TRow>({
  open,
  onClose,
  columns,
  columnVisibility,
  toggleColumn,
  showAllColumns,
  hideAllColumns,
  resetColumnVisibility,
}: ColumnVisibilityDialogProps<TRow>) {
  const t = useTranslations("Table");

  const visibleCount = columns.filter(
    (col) => columnVisibility[col.key] !== false,
  ).length;
  const allVisible = visibleCount === columns.length;
  const noneVisible = visibleCount === 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("ColumnVisibility")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t("ColumnVisibilityDescription", {
              visible: visibleCount,
              total: columns.length,
            })}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={showAllColumns}
            disabled={allVisible}
          >
            {t("ShowAll")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={hideAllColumns}
            disabled={noneVisible}
          >
            {t("HideAll")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={resetColumnVisibility}
          >
            {t("Reset")}
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <FormGroup>
          {columns.map((column) => (
            <FormControlLabel
              key={column.key}
              control={
                <Checkbox
                  checked={columnVisibility[column.key] !== false}
                  onChange={() => toggleColumn(column.key)}
                />
              }
              label={column.name}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
