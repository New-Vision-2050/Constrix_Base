"use client";

import { useMemo, useState } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ServiceItemActions } from "./ServiceItemActions";

export interface ServiceItemAccordionProps {
  item: TermServiceSettingItem | TermServiceSettingChild;
  selectedIds: Set<number>;
  onToggle: (id: number, checked: boolean, parentId?: number) => void;
  onToggleWithDescendants: (ids: number[], checked: boolean) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
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
  selectedIds,
  onToggle,
  onToggleWithDescendants,
  onEdit,
  onDelete,
  depth = 0,
  inGrid = false,
  parentId,
}: ServiceItemAccordionProps) {
  const [expanded, setExpanded] = useState(false);
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
    onToggleWithDescendants(descendantIds, checked);
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(item.id, e.target.checked, parentId);
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
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span className="text-sm text-gray-500">({selectedCount}/{leafIds.length})</span>
            {(onEdit || onDelete) && (
              <ServiceItemActions
                itemId={item.id}
                onEdit={onEdit ?? (() => {})}
                onDelete={onDelete ?? (() => {})}
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
              selectedIds={selectedIds}
              onToggle={(id, checked, parentId) =>
                onToggle(id, checked, parentId ?? item.id)
              }
              onToggleWithDescendants={onToggleWithDescendants}
              onEdit={onEdit}
              onDelete={onDelete}
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
