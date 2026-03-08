"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslations } from "next-intl";
import { TermServiceSettingsApi } from "@/services/api/crm-settings/term-service-settings";
import { ConfirmDeleteDialogProps } from "../types/indes";

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onSuccess,
  deleteConfirmMessage,
  deleteId,
}: ConfirmDeleteDialogProps) {
  const t = useTranslations("common.deleteConfirmation");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHandler = async (id: number) => {
    try {
      setIsDeleting(true);
      const response = await TermServiceSettingsApi.delete(id);
      if (!response.data.error) {
        onSuccess?.();
        onClose();
        setErrorMsg("");
      } else {
        setErrorMsg(response.data.message ?? "An error occurred");
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    setErrorMsg("");
    if (deleteId) {
      deleteHandler(deleteId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", position: "relative", pt: 4 }}>
        <IconButton
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            top: 16,
            ...(theme.direction === "ltr"
              ? { left: 16, right: "auto" }
              : { right: 16, left: "auto" }),
          })}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <InfoOutlinedIcon sx={{ fontSize: 48, color: "primary.main" }} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
          {deleteConfirmMessage ?? t("defaultMessage")}
        </Typography>
        {errorMsg && (
          <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center", mt: 1 }}
          >
            {errorMsg}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={isDeleting}
          sx={{ minWidth: 128 }}
        >
          {isDeleting && (
            <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
          )}
          {t("delete")}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isDeleting}
          sx={{ minWidth: 128 }}
        >
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
