import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
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
  pinnedKeys?: string[];
  isPinned?: (columnKey: string) => boolean;
  togglePin?: (columnKey: string) => void;
  canPinMore?: boolean;
  maxPinned?: number;
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
  pinnedKeys,
  isPinned,
  togglePin,
  canPinMore,
  maxPinned,
}: ColumnVisibilityDialogProps<TRow>) {
  const t = useTranslations("Table");

  const visibleCount = columns.filter(
    (col) => columnVisibility[col.key] !== false,
  ).length;
  const allVisible = visibleCount === columns.length;
  const noneVisible = visibleCount === 0;
  const pinningEnabled = !!togglePin && !!isPinned;

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
          {pinningEnabled && (
            <Typography variant="body2" color="text.secondary">
              {t("PinnedColumnsDescription", {
                pinned: pinnedKeys?.length ?? 0,
                max: maxPinned ?? 0,
              })}
            </Typography>
          )}
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

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {columns.map((column) => {
            const visible = columnVisibility[column.key] !== false;
            const pinned = isPinned?.(column.key) ?? false;
            const pinDisabled = !visible || (!pinned && !canPinMore);

            return (
              <Box
                key={column.key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visible}
                      onChange={() => toggleColumn(column.key)}
                    />
                  }
                  label={column.name}
                />
                {pinningEnabled && (
                  <Tooltip
                    title={
                      pinned
                        ? t("UnpinColumn")
                        : !visible
                          ? t("PinColumnDisabledHidden")
                          : !canPinMore
                            ? t("MaxPinnedReached", { max: maxPinned ?? 0 })
                            : t("PinColumn")
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        color={pinned ? "primary" : "default"}
                        disabled={pinDisabled}
                        onClick={() => togglePin?.(column.key)}
                      >
                        {pinned ? (
                          <PushPin fontSize="small" />
                        ) : (
                          <PushPinOutlined fontSize="small" />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
