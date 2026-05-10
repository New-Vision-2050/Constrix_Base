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
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";

export interface AddSectionDialogProps {
  open: boolean;
  setOpenModal: (open: boolean) => void;
  projectTypeId: number;
  onSuccess?: () => void;
}

export default function AddSectionDialog({
  open,
  setOpenModal,
  projectTypeId,
  onSuccess,
}: AddSectionDialogProps) {
  const t = useTranslations("projectSettings.section");
  const tForm = useTranslations("projectSettings.section.form");

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setCode("");
    setDescription("");
  };

  const handleClose = () => {
    reset();
    setOpenModal(false);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      ProjectSharingDepartmentApi.create({
        project_type_id: projectTypeId,
        code: code.trim(),
        description: description.trim(),
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
    if (!code.trim() || !description.trim()) {
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
          borderRadius: "8px",
          position: "fixed",
          top: 0,
          right: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <DialogTitle
          sx={{
            p: 0,
            mb: 3,
            textAlign: "center",
            fontSize: "1.125rem",
            fontWeight: 600,
          }}
        >
          {t("addSection")}
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
            label={tForm("sectionCode")}
            required
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={tForm("sectionCodePlaceholder")}
          />

          <TextField
            label={tForm("sectionDescription")}
            required
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={tForm("sectionDescriptionPlaceholder")}
            multiline
            rows={3}
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
