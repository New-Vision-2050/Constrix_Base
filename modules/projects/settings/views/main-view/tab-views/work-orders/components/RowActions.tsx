import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { RowActionsProps } from "../types";
import { useTranslations } from "next-intl";

export function RowActions({
  row,
  onShow,
  onEdit,
  canEdit,
  canShow,
  onDelete,
  canDelete = false,
  translationNamespace = "projectSettings.section.table",
  editLabelKey = "editSection",
}: RowActionsProps) {
  const tTable = useTranslations(translationNamespace);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ bgcolor: "grey.400" }}
      >
        {tTable("action")}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          disabled={!canShow}
          onClick={() => {
            onShow(String(row.id));
            handleClose();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>{tTable("show")}</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={!canEdit}
          onClick={() => {
            onEdit(String(row.id));
            handleClose();
          }}
        >
          <ListItemIcon>
            <BorderColorIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>{tTable(editLabelKey)}</ListItemText>
        </MenuItem>
        {onDelete ? (
          <MenuItem
            disabled={!canDelete}
            onClick={() => {
              onDelete(String(row.id));
              handleClose();
            }}
          >
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>{tTable("delete")}</ListItemText>
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
}
