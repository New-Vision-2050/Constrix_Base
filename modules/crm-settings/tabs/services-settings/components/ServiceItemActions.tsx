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
import type { TermServiceSettingItem } from "@/services/api/crm-settings/term-service-settings/types/response";

export interface ServiceItemActionsProps {
  item: TermServiceSettingItem;
  onEdit: (item: TermServiceSettingItem) => void;
  onDelete: (id: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function ServiceItemActions({
  item,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
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
    onEdit(item);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(item.id);
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
        <MenuItem disabled={!canEdit} onClick={handleEdit}>
          <ListItemIcon>
            <BorderColorIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>{t("editService")}</ListItemText>
        </MenuItem>

        <MenuItem disabled={!canDelete} onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t("deleteService")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
