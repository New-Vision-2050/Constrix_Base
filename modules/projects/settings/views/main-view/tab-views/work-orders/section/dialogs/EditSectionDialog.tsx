"use client";

import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";

export interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  sectionId?: string;
  onSuccess?: () => void;
}

export default function EditSectionDialog({
  open,
  onClose,
  sectionId,
  onSuccess,
}: SectionDialogProps) {
  const t = useTranslations("projectSettings.section");
  const tForm = useTranslations("projectSettings.section.form");

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const detailQuery = useQuery({
    queryKey: ["project-sharing-department", sectionId],
    queryFn: async () => {
      const res = await ProjectSharingDepartmentApi.show(sectionId!);
      return res.data.payload;
    },
    enabled: open && Boolean(sectionId),
  });

  useEffect(() => {
    const p = detailQuery.data;
    if (!p) return;
    setCode(p.code ?? "");
    setDescription(p.description ?? "");
  }, [detailQuery.data]);

  useEffect(() => {
    if (!open) {
      setCode("");
      setDescription("");
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      ProjectSharingDepartmentApi.update(sectionId!, {
        code: code.trim(),
        description: description.trim(),
      }),
    onSuccess: () => {
      toast.success(tForm("updateSuccess"));
      onSuccess?.();
      handleClose();
    },
    onError: () => {
      toast.error(tForm("updateError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionId) return;
    if (!code.trim() || !description.trim()) {
      toast.error(tForm("validationError"));
      return;
    }
    updateMutation.mutate();
  };

  const loading = detailQuery.isLoading && open && Boolean(sectionId);

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
          {t("editSection")}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : detailQuery.isError ? (
          <Typography color="error" textAlign="center">
            {tForm("updateError")}
          </Typography>
        ) : (
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
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                tForm("save")
              )}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
