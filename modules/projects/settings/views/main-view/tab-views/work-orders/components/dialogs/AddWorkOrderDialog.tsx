"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";

export interface AddWorkOrderDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
  projectTypeId: number;
  onSuccess?: () => void;
}

export default function AddWorkOrderDialog({
  open,
  setOpenModal,
  projectTypeId,
  onSuccess,
}: AddWorkOrderDialogProps) {
  const t = useTranslations("projectSettings.workOrders");
  const tForm = useTranslations("projectSettings.workOrders.form");

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const reset = () => {
    setCode("");
    setDescription("");
    setType("");
  };

  const handleClose = () => {
    reset();
    setOpenModal(false);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      ProjectSharingWorkOrdersApi.create({
        project_type_id: projectTypeId,
        code: code.trim(),
        description: description.trim(),
        type: type.trim(),
      }),
    onSuccess: () => {
      toast.success(tForm("createSuccess"));
      onSuccess?.();
      handleClose();
    },
    onError: () => {
      toast.error(tForm("createError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !description.trim() || !type.trim()) {
      toast.error(tForm("validationError"));
      return;
    }
    createMutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          color: "text.primary",
          borderRadius: "8px",
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogContent>
        <DialogTitle
          sx={{
            p: 0,
            mb: 3,
            textAlign: "center",
            fontSize: "1.125rem",
            fontWeight: 600,
          }}
        >
          {t("addWorkOrder")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label={tForm("consultantCode")}
            required
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={tForm("consultantCodePlaceholder")}
          />

          <TextField
            label={tForm("workOrderDescription")}
            required
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={tForm("workOrderDescriptionPlaceholder")}
            multiline
            rows={3}
          />

          <TextField
            label={tForm("workOrderType")}
            required
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder={tForm("workOrderTypePlaceholder")}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={createMutation.isPending || !projectTypeId}
          >
            {createMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              tForm("save")
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
