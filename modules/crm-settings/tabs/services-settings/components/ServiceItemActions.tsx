"use client";

import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";

export interface ServiceItemActionsProps {
  itemId: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ServiceItemActions({
  itemId,
  onEdit,
  onDelete,
}: ServiceItemActionsProps) {
  const t = useTranslations("CRMSettingsModule.servicesSettings");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(itemId);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(itemId);
    handleClose();
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
        {t("action")}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <BorderColorIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>{t("editService")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t("deleteService")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
