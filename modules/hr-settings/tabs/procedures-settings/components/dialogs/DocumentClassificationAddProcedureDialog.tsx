"use client";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Close, List } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import type { TaskActionFormValues } from "../../types";

interface DocumentClassificationAddProcedureDialogProps {
  open: boolean;
  onClose: () => void;
  procedureType: string;
  onSave: (values: TaskActionFormValues) => void | Promise<void>;
}

type ClassificationForm = {
  name: string;
  isActive: boolean;
  classificationName: string;
  linkedFolderName: string;
  classificationCode: string;
  documentNature: string;
  jobAttribute: string;
  usedInDocumentCycle: boolean;
  showInAttachmentsLibrary: boolean;
  showInArchiveAfterApproval: boolean;
  requiresAssetId: boolean;
};

const defaultForm: ClassificationForm = {
  name: "",
  isActive: true,
  classificationName: "",
  linkedFolderName: "",
  classificationCode: "",
  documentNature: "",
  jobAttribute: "",
  usedInDocumentCycle: false,
  showInAttachmentsLibrary: false,
  showInArchiveAfterApproval: false,
  requiresAssetId: false,
};

const SELECT_OPTIONS = ["Option A", "Option B", "Option C"] as const;

export default function DocumentClassificationAddProcedureDialog({
  open,
  onClose,
  procedureType,
  onSave,
}: DocumentClassificationAddProcedureDialogProps) {
  const { tc } = useProceduresSettingsTranslations();
  const t = useTranslations(
    "CRMSettingsModule.proceduresSettings.documentAddProcedureDialog",
  );
  const locale = useLocale();

  const [form, setForm] = useState<ClassificationForm>(defaultForm);
  const [nameError, setNameError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Same forms API used by CRM AddTaskActionDialog
  const { data: forms = [] } = useQuery({
    queryKey: ["internal_procedure_setting_forms", procedureType, locale],
    queryFn: async () => {
      try {
        return await InternalProcedureSettingsApi.getInternalProcedureSettingForms(
          procedureType,
          locale,
        );
      } catch {
        return [];
      }
    },
    enabled: open && !!procedureType,
    retry: false,
  });

  useEffect(() => {
    if (!open) return;
    setForm(defaultForm);
    setNameError("");
  }, [open]);

  const selectFields = useMemo(
    () =>
      [
        {
          key: "classificationName" as const,
          label: t("classificationName"),
        },
        {
          key: "linkedFolderName" as const,
          label: t("linkedFolderName"),
        },
        {
          key: "classificationCode" as const,
          label: t("classificationCode"),
        },
        {
          key: "documentNature" as const,
          label: t("documentNature"),
        },
        {
          key: "jobAttribute" as const,
          label: t("jobAttribute"),
        },
      ] as const,
    [t],
  );

  const checkboxFields = useMemo(
    () =>
      [
        {
          key: "usedInDocumentCycle" as const,
          label: t("usedInDocumentCycle"),
        },
        {
          key: "showInAttachmentsLibrary" as const,
          label: t("showInAttachmentsLibrary"),
        },
        {
          key: "showInArchiveAfterApproval" as const,
          label: t("showInArchiveAfterApproval"),
        },
        {
          key: "requiresAssetId" as const,
          label: t("requiresAssetId"),
        },
      ] as const,
    [t],
  );

  const handleSave = async () => {
    if (!form.name.trim()) {
      setNameError(tc("requiredField"));
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        modelId: forms[0]?.key ?? "",
        conditions: [],
        appearBeforeIds: [],
        appearAfterIds: [],
        isActive: form.isActive,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontWeight: 700,
          pb: 1,
        }}
      >
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", insetInlineStart: 8, top: 8 }}
        >
          <Close fontSize="small" />
        </IconButton>
        {t("title")}
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexDirection: "row-reverse",
          }}
        >
          <Switch
            checked={form.isActive}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isActive: e.target.checked }))
            }
            color="primary"
            disabled={isSaving}
          />
          <TextField
            label={t("procedureName")}
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              if (nameError) setNameError("");
            }}
            fullWidth
            size="small"
            required
            disabled={isSaving}
            error={!!nameError}
            helperText={nameError}
          />
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            <List fontSize="small" color="action" />
            <Typography variant="subtitle2" fontWeight={700}>
              {t("classificationSection")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 1.5,
              mb: 2,
            }}
          >
            {selectFields.map((field) => (
              <TextField
                key={field.key}
                select
                size="small"
                label={field.label}
                value={form[field.key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                disabled={isSaving}
              >
                <MenuItem value="">{t("select")}</MenuItem>
                {SELECT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 0.5,
            }}
          >
            {checkboxFields.map((field) => (
              <FormControlLabel
                key={field.key}
                control={
                  <Checkbox
                    checked={form[field.key]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.checked,
                      }))
                    }
                    disabled={isSaving}
                    color="primary"
                  />
                }
                label={field.label}
              />
            ))}
          </Box>
        </Box>

        <Alert severity="warning" variant="outlined">
          {t("notice")}
        </Alert>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexDirection: "row-reverse",
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving}
            sx={{ minWidth: 120 }}
          >
            {t("save")}
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isSaving}
            sx={{ minWidth: 120 }}
          >
            {t("cancel")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
