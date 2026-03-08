import { Edit, MoreVertical, Trash } from "lucide-react";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { CategoryRow } from "./types";

interface RowActionsProps {
  row: CategoryRow;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  t: (key: string) => string;
}

/**
 * Row actions menu for Main Categories table
 * Provides Edit action with permission checks
 * Uses MUI Menu component for dropdown
 */
export function RowActions({
  row,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  t,
}: RowActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(row.id);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(row.id);
    handleClose();
  };

  return (
    <>
      <Button
        size="small"
        onClick={handleClick}
        disabled={!canEdit && !canDelete}
      >
        {t("table.action")}
        <MoreVertical size={16} />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disabled={!canEdit} onClick={handleEdit}>
          <Edit size={16} style={{ marginRight: "8px" }} />
          {t("table.edit")}
        </MenuItem>
        
        <MenuItem 
          disabled={!canDelete} 
          onClick={handleDelete}
          style={{ color: "#d32f2f" }}
        >
          <Trash size={16} style={{ marginRight: "8px" }} />
          {t("table.delete")}
        </MenuItem>
      </Menu>
    </>
  );
}
