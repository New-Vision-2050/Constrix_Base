import React, { useState, useEffect, useCallback, useRef } from "react";
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
  TextField,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import {
  PushPin,
  PushPinOutlined,
  DragIndicator,
  Add,
  DeleteOutline,
} from "@mui/icons-material";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
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
import { ColumnGroupDef, computeColumnRuns } from "../column-grouping";

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
  groups?: ColumnGroupDef[];
  groupIdForColumn?: (columnKey: string) => string | undefined;
  createGroup?: (name: string) => string;
  renameGroup?: (id: string, name: string) => void;
  setGroupColors?: (id: string, backgroundColor: string, textColor: string) => void;
  deleteGroup?: (id: string) => void;
  moveColumnToGroup?: (
    columnKey: string,
    targetGroupId: string | null,
    beforeKey?: string,
  ) => void;
  moveGroupBlock?: (groupId: string, beforeKey: string | null) => void;
};

// Native color inputs fire onChange continuously while dragging inside the
// picker (every pixel of hue/saturation movement), and each call here used
// to run setGroupColors synchronously — re-rendering the whole table on
// every tick. Debouncing the *committed* update (while still tracking the
// live value locally so the swatch itself stays responsive) fixes that.
function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );
}

const columnDragId = (key: string) => `col:${key}`;
const groupDragId = (id: string) => `grp:${id}`;
const groupDropId = (id: string) => `group-drop:${id}`;
const ROOT_DROP_ID = "root-drop";

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
  groupingEnabled: boolean;
  currentGroupId: string | undefined;
  groups: ColumnGroupDef[];
  onMoveToGroup?: (groupId: string | null) => void;
  dense?: boolean;
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
  groupingEnabled,
  currentGroupId,
  groups,
  onMoveToGroup,
  dense,
}: ColumnRowProps<TRow>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnDragId(column.key),
    data: { type: "column", columnKey: column.key },
    disabled: !dragEnabled,
  });

  const handleMoveChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    onMoveToGroup?.(value === "" ? null : value);
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        py: dense ? 0 : undefined,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? "action.hover" : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {groupingEnabled && (
          <Select
            size="small"
            variant="standard"
            value={currentGroupId ?? ""}
            onChange={handleMoveChange}
            displayEmpty
            renderValue={(value) =>
              value
                ? (groups.find((g) => g.id === value)?.name ?? "")
                : t("Ungrouped")
            }
            sx={{ fontSize: 13, minWidth: 96 }}
            aria-label={t("MoveToGroup")}
          >
            <MenuItem value="">{t("Ungrouped")}</MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        )}
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
    </Box>
  );
}

type GroupBoxProps<TRow> = {
  group: ColumnGroupDef;
  members: ColumnDef<TRow>[];
  t: ReturnType<typeof useTranslations>;
  renameGroup?: (id: string, name: string) => void;
  setGroupColors?: (id: string, backgroundColor: string, textColor: string) => void;
  deleteGroup?: (id: string) => void;
  renderMember: (column: ColumnDef<TRow>) => React.ReactNode;
};

function GroupBox<TRow>({
  group,
  members,
  t,
  renameGroup,
  setGroupColors,
  deleteGroup,
  renderMember,
}: GroupBoxProps<TRow>) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: groupDragId(group.id),
    data: { type: "group", groupId: group.id },
  });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: groupDropId(group.id),
    data: { type: "container", groupId: group.id },
  });

  // Live-tracked locally so the swatches themselves respond instantly while
  // dragging in the picker; the real setGroupColors commit is debounced
  // (see useDebouncedCallback above) since that one triggers a table-wide
  // re-render and firing it on every drag tick freezes the UI.
  const [localBackground, setLocalBackground] = useState(
    group.backgroundColor,
  );
  const [localText, setLocalText] = useState(group.textColor);
  useEffect(() => {
    setLocalBackground(group.backgroundColor);
  }, [group.backgroundColor]);
  useEffect(() => {
    setLocalText(group.textColor);
  }, [group.textColor]);

  const commitColors = useDebouncedCallback(
    (backgroundColor: string, textColor: string) => {
      setGroupColors?.(group.id, backgroundColor, textColor);
    },
    200,
  );

  return (
    <Box
      ref={setSortableRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        mb: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1,
          py: 0.5,
          backgroundColor: localBackground,
          color: localText,
        }}
      >
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          aria-label={t("DragToReorderGroup")}
          sx={{ cursor: "grab", touchAction: "none", color: "inherit" }}
        >
          <DragIndicator fontSize="small" />
        </IconButton>
        <TextField
          variant="standard"
          value={group.name}
          onChange={(e) => renameGroup?.(group.id, e.target.value)}
          placeholder={t("GroupName")}
          sx={{
            flexGrow: 1,
            "& .MuiInput-input": { color: "inherit", fontWeight: 600 },
            "& .MuiInput-underline:before": { borderColor: "currentColor" },
          }}
        />
        <Tooltip title={t("GroupBackgroundColor")}>
          <Box
            component="input"
            type="color"
            value={localBackground}
            onChange={(e) => {
              const value = (e.target as HTMLInputElement).value;
              setLocalBackground(value);
              commitColors(value, localText);
            }}
            sx={{
              width: 24,
              height: 24,
              p: 0,
              border: "none",
              borderRadius: 0.5,
              cursor: "pointer",
            }}
          />
        </Tooltip>
        <Tooltip title={t("GroupTextColor")}>
          <Box
            component="input"
            type="color"
            value={localText}
            onChange={(e) => {
              const value = (e.target as HTMLInputElement).value;
              setLocalText(value);
              commitColors(localBackground, value);
            }}
            sx={{
              width: 24,
              height: 24,
              p: 0,
              border: "none",
              borderRadius: 0.5,
              cursor: "pointer",
            }}
          />
        </Tooltip>
        <IconButton
          size="small"
          onClick={() => deleteGroup?.(group.id)}
          aria-label={t("UngroupColumns")}
          sx={{ color: "inherit" }}
        >
          <DeleteOutline fontSize="small" />
        </IconButton>
      </Box>
      <Box
        ref={setDroppableRef}
        sx={{
          p: 1,
          minHeight: 40,
          backgroundColor: isOver ? "action.hover" : undefined,
        }}
      >
        <SortableContext
          items={members.map((column) => columnDragId(column.key))}
          strategy={verticalListSortingStrategy}
        >
          {members.length === 0 ? (
            <Typography variant="caption" color="text.disabled">
              {t("EmptyGroupDropHint")}
            </Typography>
          ) : (
            members.map((column) => renderMember(column))
          )}
        </SortableContext>
      </Box>
    </Box>
  );
}

function RootDropZone({ t }: { t: ReturnType<typeof useTranslations> }) {
  const { setNodeRef, isOver } = useDroppable({
    id: ROOT_DROP_ID,
    data: { type: "container", groupId: null },
  });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 1,
        p: 1,
        textAlign: "center",
        backgroundColor: isOver ? "action.hover" : undefined,
      }}
    >
      <Typography variant="caption" color="text.disabled">
        {t("EmptyGroupDropHint")}
      </Typography>
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
  groups,
  groupIdForColumn,
  createGroup,
  renameGroup,
  setGroupColors,
  deleteGroup,
  moveColumnToGroup,
  moveGroupBlock,
}: ColumnVisibilityDialogProps<TRow>) {
  const t = useTranslations("Table");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"column" | "group" | null>(
    null,
  );

  const visibleCount = columns.filter(
    (col) => columnVisibility[col.key] !== false,
  ).length;
  const allVisible = visibleCount === columns.length;
  const noneVisible = visibleCount === 0;
  const pinningEnabled = !!togglePin && !!isPinned;
  const dragEnabled = !!onReorder;
  const groupingEnabled =
    !!groups && !!groupIdForColumn && !!moveColumnToGroup && !!moveGroupBlock;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const groupsById = new Map((groups ?? []).map((g) => [g.id, g]));
  const resolvedGroupIdForColumn = groupIdForColumn ?? (() => undefined);
  const runs = computeColumnRuns(columns, resolvedGroupIdForColumn, groupsById);
  const topLevelIds = runs.map((run) =>
    run.type === "root" ? columnDragId(run.column.key) : groupDragId(run.groupId),
  );

  const findFirstMemberKey = (groupId: string): string | undefined =>
    columns.find((col) => resolvedGroupIdForColumn(col.key) === groupId)?.key;

  const renderMember = (column: ColumnDef<TRow>) => {
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
        groupingEnabled={groupingEnabled}
        currentGroupId={resolvedGroupIdForColumn(column.key)}
        groups={groups ?? []}
        onMoveToGroup={(groupId) => moveColumnToGroup?.(column.key, groupId)}
        dense
      />
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as
      | { type: "column" | "group" }
      | undefined;
    setActiveId(String(event.active.id));
    setActiveType(data?.type ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    if (!over) return;

    const activeData = active.data.current as
      | { type: "column"; columnKey: string }
      | { type: "group"; groupId: string }
      | undefined;
    const overData = over.data.current as
      | { type: "column"; columnKey: string }
      | { type: "group"; groupId: string }
      | { type: "container"; groupId: string | null }
      | undefined;
    if (!activeData) return;

    if (activeData.type === "group") {
      const activeGroupId = activeData.groupId;
      let beforeKey: string | null = null;

      if (overData?.type === "column") {
        const overGroupId = resolvedGroupIdForColumn(overData.columnKey);
        if (overGroupId === activeGroupId) return; // dropped on its own member
        beforeKey = overGroupId
          ? (findFirstMemberKey(overGroupId) ?? overData.columnKey)
          : overData.columnKey;
      } else if (overData?.type === "group") {
        if (overData.groupId === activeGroupId) return;
        beforeKey = findFirstMemberKey(overData.groupId) ?? null;
      } else if (overData?.type === "container") {
        if (overData.groupId === activeGroupId) return;
        beforeKey = overData.groupId
          ? (findFirstMemberKey(overData.groupId) ?? null)
          : null;
      } else {
        return;
      }

      moveGroupBlock?.(activeGroupId, beforeKey);
      return;
    }

    if (activeData.type === "column") {
      const columnKey = activeData.columnKey;
      let targetGroupId: string | null = null;
      let beforeKey: string | undefined;

      if (overData?.type === "column") {
        if (overData.columnKey === columnKey) return;
        targetGroupId = resolvedGroupIdForColumn(overData.columnKey) ?? null;
        beforeKey = overData.columnKey;
      } else if (overData?.type === "container") {
        targetGroupId = overData.groupId;
      } else if (overData?.type === "group") {
        targetGroupId = overData.groupId;
        beforeKey = findFirstMemberKey(overData.groupId);
      } else {
        return;
      }

      moveColumnToGroup?.(columnKey, targetGroupId, beforeKey);
    }
  };

  const activeColumn =
    activeType === "column"
      ? columns.find((col) => columnDragId(col.key) === activeId)
      : undefined;
  const activeGroup =
    activeType === "group"
      ? (groups ?? []).find((g) => groupDragId(g.id) === activeId)
      : undefined;

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

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
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
          {groupingEnabled && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Add fontSize="small" />}
              onClick={() => createGroup?.(t("NewGroup"))}
            >
              {t("AddGroup")}
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={topLevelIds} strategy={verticalListSortingStrategy}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {runs.map((run) =>
                run.type === "root" ? (
                  renderMember(run.column)
                ) : (
                  <GroupBox
                    key={run.groupId}
                    group={run.group}
                    members={run.columns}
                    t={t}
                    renameGroup={renameGroup}
                    setGroupColors={setGroupColors}
                    deleteGroup={deleteGroup}
                    renderMember={renderMember}
                  />
                ),
              )}
              {groupingEnabled && <RootDropZone t={t} />}
            </Box>
          </SortableContext>
          <DragOverlay>
            {activeColumn && (
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  boxShadow: 3,
                  borderRadius: 1,
                  px: 1,
                }}
              >
                <Typography variant="body2">{activeColumn.name}</Typography>
              </Box>
            )}
            {activeGroup && (
              <Box
                sx={{
                  backgroundColor: activeGroup.backgroundColor,
                  color: activeGroup.textColor,
                  boxShadow: 3,
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {activeGroup.name}
                </Typography>
              </Box>
            )}
          </DragOverlay>
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
