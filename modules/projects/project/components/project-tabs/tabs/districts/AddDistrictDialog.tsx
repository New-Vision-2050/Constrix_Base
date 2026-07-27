"use client";

import { useEffect, useState } from "react";
import {
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
import { ProjectDistrictsApi } from "@/services/api/projects/project-districts";

export interface AddDistrictDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  districtId?: number | null;
  initialName?: string;
  onSaved: () => void;
}

export default function AddDistrictDialog({
  open,
  onClose,
  projectId,
  districtId,
  initialName,
  onSaved,
}: AddDistrictDialogProps) {
  const t = useTranslations("project.districtsTab.dialog");
  const tValidation = useTranslations("project.districtsTab.dialog.validation");

  const isEdit = districtId != null;

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
        await ProjectDistrictsApi.update(districtId!, {
          name: trimmed,
        });
        toast.success(t("updateSuccess"));
      } else {
        await ProjectDistrictsApi.create({
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
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {t("submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
