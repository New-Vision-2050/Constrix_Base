import React, { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import { MoreVert, Delete } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { AttendanceStatusRecord } from "@/modules/attendance-departure/types/attendance";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";

/**
 * Actions column component with dropdown menu
 */
interface ActionsColumnProps {
  row: AttendanceStatusRecord;
  onRefetch: () => void;
  canDelete: boolean;
}

export const ActionsColumn: React.FC<ActionsColumnProps> = ({
  row,
  onRefetch,
  canDelete,
}) => {
  const t = useTranslations("AttendanceDepartureModule.Table");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleClose();
    setDeleteConfirmId(row.id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      const url = `${baseURL}/attendance/${deleteConfirmId}`;
      await apiClient.delete(url);

      toast.success(t("deleteSuccess") || "Deleted successfully");
      setDeleteConfirmId(null);
      onRefetch();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message;
      toast.error(errorMsg || t("deleteFailed") || "Delete failed");
      console.error("Error deleting attendance record:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  if (!canDelete) return null;

  return (
    <>
      <Button size="small" onClick={handleClick}>
        {t("action")}
        <MoreVert />
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t("deleteDialog.deleteAction")}</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDeleteDialog
        open={Boolean(deleteConfirmId)}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title={t("deleteConfirmMessage")}
      />
    </>
  );
};
