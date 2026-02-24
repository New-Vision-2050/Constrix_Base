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
import { RowActionsProps } from "../types";
import { useTranslations } from "next-intl";

export function RowActions({
  row,
  onShow,
  onEdit,
  canEdit,
  canShow,
}: RowActionsProps) {
  const tTable = useTranslations("projectSettings.section.table");
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
            onShow(row.id);
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
            onEdit(row.id);
            handleClose();
          }}
        >
          <ListItemIcon>
            <BorderColorIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>{tTable("editSection")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
