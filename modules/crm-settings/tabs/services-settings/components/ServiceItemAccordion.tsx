"use client";

import { useMemo, useState, useCallback } from "react";
import {
  TermServiceSettingChild,
  TermServiceSettingItem,
} from "@/services/api/crm-settings/term-service-settings/types/response";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ServiceItemActions } from "./ServiceItemActions";

export interface ServiceItemAccordionProps {
  item: TermServiceSettingItem | TermServiceSettingChild;
  /** When false, hides checkboxes and selection UI. Default: true */
  selectable?: boolean;
  selectedIds?: Set<number>;
  onToggle?: (id: number, checked: boolean, parentId?: number) => void;
  onToggleWithDescendants?: (ids: number[], checked: boolean) => void;
  onEdit?: (item: TermServiceSettingItem) => void;
  onDelete?: (id: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  depth?: number;
  inGrid?: boolean;
  parentId?: number;
}

function getAllDescendantIds(
  item: TermServiceSettingItem | TermServiceSettingChild,
): number[] {
  const ids: number[] = [];
  const collect = (i: TermServiceSettingItem | TermServiceSettingChild) => {
    ids.push(i.id);
    (i.children || []).forEach(collect);
  };
  collect(item);
  return ids;
}

function findItemById(
  items: (TermServiceSettingItem | TermServiceSettingChild)[],
  targetId: number,
  parent: TermServiceSettingItem | TermServiceSettingChild | null = null,
): {
  item: TermServiceSettingItem | TermServiceSettingChild;
  parent: TermServiceSettingItem | TermServiceSettingChild | null;
} | null {
  for (const item of items) {
    if (item.id === targetId) return { item, parent };
    const found = findItemById(item.children || [], targetId, item);
    if (found) return found;
  }
  return null;
}

/** Returns IDs of leaf items only (items without children) - used for count display */
function getLeafDescendantIds(
  item: TermServiceSettingItem | TermServiceSettingChild,
): number[] {
  const ids: number[] = [];
  const collect = (i: TermServiceSettingItem | TermServiceSettingChild) => {
    if (!i.children?.length) {
      ids.push(i.id);
    } else {
      (i.children || []).forEach(collect);
    }
  };
  collect(item);
  return ids;
}

/** Returns true if all descendants (children, grandchildren, etc.) are in selectedIds */
function areAllDescendantsSelected(
  item: TermServiceSettingItem | TermServiceSettingChild,
  selectedIds: Set<number>,
): boolean {
  for (const child of item.children || []) {
    if (!selectedIds.has(child.id)) return false;
    if (!areAllDescendantsSelected(child, selectedIds)) return false;
  }
  return true;
}

/** Returns true if any descendant is in selectedIds */
function areAnyDescendantsSelected(
  item: TermServiceSettingItem | TermServiceSettingChild,
  selectedIds: Set<number>,
): boolean {
  for (const child of item.children || []) {
    if (selectedIds.has(child.id)) return true;
    if (areAnyDescendantsSelected(child, selectedIds)) return true;
  }
  return false;
}

export function ServiceItemAccordion({
  item,
  selectable = true,
  selectedIds: selectedIdsProp,
  onToggle: onToggleProp,
  onToggleWithDescendants: onToggleWithDescendantsProp,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  depth = 0,
  inGrid = false,
  parentId,
}: ServiceItemAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<number>>(
    () => new Set(),
  );

  const isOwnSelection =
    selectable &&
    depth === 0 &&
    selectedIdsProp === undefined &&
    onToggleProp === undefined &&
    onToggleWithDescendantsProp === undefined;

  const selectedIds =
    isOwnSelection ? internalSelectedIds : (selectedIdsProp ?? new Set());

  const handleToggle = useCallback(
    (id: number, checked: boolean, parentIdArg?: number) => {
      const updater = (prev: Set<number>) => {
        const next = new Set(prev);
        if (checked) next.add(id);
        else next.delete(id);

        const subtreeRoot = [item];
        if (checked && parentIdArg != null) {
          let currentParentId: number | undefined = parentIdArg;
          while (currentParentId != null) {
            const found = findItemById(subtreeRoot, currentParentId);
            if (!found) break;
            const { item: parentItem } = found;
            const descendantIds = getAllDescendantIds(parentItem);
            const allDescendantsSelected = descendantIds
              .filter((did) => did !== parentItem.id)
              .every((did) => next.has(did));
            if (allDescendantsSelected) {
              next.add(parentItem.id);
              const parentOfParent = findItemById(subtreeRoot, parentItem.id);
              currentParentId = parentOfParent?.parent?.id;
            } else {
              break;
            }
          }
        }

        if (!checked && parentIdArg != null) {
          let currentParentId: number | undefined = parentIdArg;
          while (currentParentId != null) {
            next.delete(currentParentId);
            const found = findItemById(subtreeRoot, currentParentId);
            currentParentId = found?.parent?.id;
          }
        }

        return next;
      };

      if (isOwnSelection) {
        setInternalSelectedIds(updater);
      } else {
        onToggleProp?.(id, checked, parentIdArg);
      }
    },
    [isOwnSelection, onToggleProp, item],
  );

  const handleToggleWithDescendants = useCallback(
    (ids: number[], checked: boolean) => {
      if (isOwnSelection) {
        setInternalSelectedIds((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => {
            if (checked) next.add(id);
            else next.delete(id);
          });
          return next;
        });
      } else {
        onToggleWithDescendantsProp?.(ids, checked);
      }
    },
    [isOwnSelection, onToggleWithDescendantsProp],
  );

  const hasChildren = (item.children?.length ?? 0) > 0;
  const descendantIds = useMemo(() => getAllDescendantIds(item), [item]);
  const leafIds = useMemo(() => getLeafDescendantIds(item), [item]);
  const selectedCount = leafIds.filter((id) => selectedIds.has(id)).length;

  const allChecked = hasChildren
    ? areAllDescendantsSelected(item, selectedIds)
    : selectedIds.has(item.id);
  const someChecked =
    hasChildren &&
    !allChecked &&
    (selectedIds.has(item.id) || areAnyDescendantsSelected(item, selectedIds));

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    handleToggleWithDescendants(descendantIds, checked);
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleToggle(item.id, e.target.checked, parentId);
  };

  const checkboxProps = hasChildren
    ? {
        checked: allChecked,
        indeterminate: someChecked,
        onChange: handleParentChange,
      }
    : {
        checked: selectedIds.has(item.id),
        indeterminate: false,
        onChange: handleChildChange,
      };

  const checkboxSx = {
    "& .MuiSvgIcon-root": { fontSize: 22 },
    color: "hsl(var(--primary))",
    "&.Mui-checked": { color: "hsl(var(--primary))" },
    "&.MuiCheckbox-indeterminate": {
      color: "hsl(var(--primary))",
    },
  };

  const labelContent = selectable ? (
    <FormControlLabel
      label={item.name}
      control={
        <Checkbox
          {...checkboxProps}
          onClick={(e) => e.stopPropagation()}
          sx={checkboxSx}
        />
      }
      sx={{
        margin: 0,
        flex: 1,
        "& .MuiFormControlLabel-label": { flex: 1 },
      }}
    />
  ) : (
    <Typography variant="body1" sx={{ flex: 1 }}>
      {item.name}
    </Typography>
  );

  const content = (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        p: 1.5,
      }}
    >
      {labelContent}
    </Box>
  );

  if (!hasChildren) {
    return (
      <Box
        className={
          inGrid ? "min-w-0 w-full" : depth > 0 ? "mt-2 w-full" : "w-full"
        }
      >
        <Paper variant="outlined">{content}</Paper>
      </Box>
    );
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      sx={{
        "&:before": { display: "none" },
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        "&.Mui-expanded": { margin: 0 },
      }}
    >
      <AccordionSummary
        component="div"
        expandIcon={<ExpandMoreIcon />}
        sx={{
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{ flex: 1, ms: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}
        >
          <Box onClick={(e) => e.stopPropagation()} sx={{ display: "flex", flex: 1, minWidth: 0 }}>
            {selectable ? (
              <FormControlLabel
                label={item.name}
                control={
                  <Checkbox
                    {...checkboxProps}
                    onClick={(e) => e.stopPropagation()}
                    sx={checkboxSx}
                  />
                }
                sx={{
                  margin: 0,
                  "& .MuiFormControlLabel-label": { flex: 1 },
                }}
              />
            ) : (
              <Typography variant="body1" sx={{ flex: 1 }}>
                {item.name}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectable && (
              <span className="text-sm text-gray-500">({selectedCount}/{leafIds.length})</span>
            )}
            {depth === 0 && (onEdit || onDelete) && (canEdit || canDelete) && (
              <ServiceItemActions
                item={item as TermServiceSettingItem}
                onEdit={onEdit ?? (() => {})}
                onDelete={onDelete ?? (() => {})}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            )}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          className={
            (item.children || []).every((c) => !c.children?.length)
              ? "mt-2 ps-6 grid w-full gap-2"
              : "mt-2 space-y-2"
          }
          sx={
            (item.children || []).every((c) => !c.children?.length)
              ? { gridTemplateColumns: `repeat(${item.children!.length}, 1fr)` }
              : undefined
          }
        >
          {(item.children || []).map((child) => (
            <ServiceItemAccordion
              key={child.id}
              item={child}
              selectable={selectable}
              selectedIds={selectedIds}
              onToggle={(id, checked, parentId) =>
                handleToggle(id, checked, parentId ?? item.id)
              }
              onToggleWithDescendants={handleToggleWithDescendants}
              onEdit={onEdit}
              onDelete={onDelete}
              canEdit={canEdit}
              canDelete={canDelete}
              depth={depth + 1}
              inGrid={(item.children || []).every((c) => !c.children?.length)}
              parentId={item.id}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
