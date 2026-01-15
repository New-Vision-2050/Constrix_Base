/**
 * Coupon Row Actions
 * Action buttons for each coupon row (view, edit, delete)
 */

import { IconButton, Tooltip } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { Coupon } from "./types";

interface RowActionsProps {
  row: Coupon;
  onView?: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  t: (key: string) => string;
}

/**
 * Action buttons for coupon table rows
 * Includes view, edit, and delete actions with permission checks
 */
export function RowActions({
  row,
  onView,
  onEdit,
  onDelete,
  canView,
  canEdit,
  canDelete,
  t,
}: RowActionsProps) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {/* View button */}
      {onView && canView && (
        <Tooltip title={t("labels.view")}>
          <IconButton size="small" onClick={() => onView(row.id)} color="info">
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Edit button */}
      {canEdit && (
        <Tooltip title={t("labels.edit")}>
          <IconButton size="small" onClick={() => onEdit(row.id)} color="primary">
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Delete button */}
      {canDelete && (
        <Tooltip title={t("labels.delete")}>
          <IconButton size="small" onClick={() => onDelete(row.id)} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}
