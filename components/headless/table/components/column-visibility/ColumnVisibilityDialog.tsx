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
import { PushPin, PushPinOutlined, DragIndicator } from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  onReorder?: (activeKey: string, overKey: string) => void;
};

type ColumnRowProps<TRow> = {
  column: ColumnDef<TRow>;
  visible: boolean;
  pinned: boolean;
  pinDisabled: boolean;
  pinningEnabled: boolean;
  dragEnabled: boolean;
  maxPinned?: number;
  canPinMore?: boolean;
  toggleColumn: (columnKey: string) => void;
  togglePin?: (columnKey: string) => void;
  t: ReturnType<typeof useTranslations>;
};

function ColumnRow<TRow>({
  column,
  visible,
  pinned,
  pinDisabled,
  pinningEnabled,
  dragEnabled,
  maxPinned,
  canPinMore,
  toggleColumn,
  togglePin,
  t,
}: ColumnRowProps<TRow>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key, disabled: !dragEnabled });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? "action.hover" : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {dragEnabled && (
          <IconButton
            size="small"
            {...attributes}
            {...listeners}
            sx={{ cursor: "grab", touchAction: "none" }}
            aria-label={t("DragToReorder")}
          >
            <DragIndicator fontSize="small" />
          </IconButton>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={visible}
              onChange={() => toggleColumn(column.key)}
            />
          }
          label={column.name}
        />
      </Box>
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
}

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
  onReorder,
}: ColumnVisibilityDialogProps<TRow>) {
  const t = useTranslations("Table");

  const visibleCount = columns.filter(
    (col) => columnVisibility[col.key] !== false,
  ).length;
  const allVisible = visibleCount === columns.length;
  const noneVisible = visibleCount === 0;
  const pinningEnabled = !!togglePin && !!isPinned;
  const dragEnabled = !!onReorder;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder?.(String(active.id), String(over.id));
    }
  };

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((col) => col.key)}
            strategy={verticalListSortingStrategy}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {columns.map((column) => {
                const visible = columnVisibility[column.key] !== false;
                const pinned = isPinned?.(column.key) ?? false;
                const pinDisabled = !visible || (!pinned && !canPinMore);

                return (
                  <ColumnRow
                    key={column.key}
                    column={column}
                    visible={visible}
                    pinned={pinned}
                    pinDisabled={pinDisabled}
                    pinningEnabled={pinningEnabled}
                    dragEnabled={dragEnabled}
                    maxPinned={maxPinned}
                    canPinMore={canPinMore}
                    toggleColumn={toggleColumn}
                    togglePin={togglePin}
                    t={t}
                  />
                );
              })}
            </Box>
          </SortableContext>
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
