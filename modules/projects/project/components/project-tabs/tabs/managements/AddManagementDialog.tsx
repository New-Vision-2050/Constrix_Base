"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ProjectManagementsApi } from "@/services/api/projects/project-managements";

export interface AddManagementDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  managementId?: number | null;
  initialName?: string;
  onSaved: () => void;
}

export default function AddManagementDialog({
  open,
  onClose,
  projectId,
  managementId,
  initialName,
  onSaved,
}: AddManagementDialogProps) {
  const t = useTranslations("project.managementsTab.dialog");
  const tValidation = useTranslations("project.managementsTab.dialog.validation");

  const isEdit = managementId != null;

  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName ?? "");
      setSubmitting(false);
    }
  }, [open, initialName]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error(tValidation("nameRequired"));
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        const res = await ProjectManagementsApi.update(managementId!, {
          name: trimmed,
        });
        toast.success(t("updateSuccess"));
      } else {
        const res = await ProjectManagementsApi.create({
          project_id: projectId,
          name: trimmed,
        });
        toast.success(t("submitSuccess"));
      }
      onSaved();
      onClose();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ??
          (isEdit ? t("updateError") : t("submitError")),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {isEdit ? t("editTitle") : t("addTitle")}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label={t("fields.name")}
            placeholder={t("fields.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            autoFocus
            disabled={submitting}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={submitting} variant="outlined" sx={{ minWidth: 80 }}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ minWidth: 80 }}
        >
          {t("submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
