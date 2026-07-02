"use client";

import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslations } from "next-intl";

interface EditableSectionProps {
  title: string;
  isRTL: boolean;
  canEdit?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onStartEdit?: () => void;
  children: React.ReactNode;
  editChildren?: React.ReactNode;
}

export default function EditableSection({
  title,
  isRTL,
  canEdit = true,
  isSaving = false,
  onSave,
  onCancel,
  onStartEdit,
  children,
  editChildren,
}: EditableSectionProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const [isEditing, setIsEditing] = useState(false);

  function handleStartEdit() {
    setIsEditing(true);
    onStartEdit?.();
  }

  function handleCancel() {
    setIsEditing(false);
    onCancel?.();
  }

  function handleSave() {
    onSave?.();
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
        {canEdit && !isEditing && (
          <Tooltip title={t("edit")}>
            <IconButton
              size="small"
              onClick={handleStartEdit}
              sx={{ border: 1, borderColor: "divider" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {isEditing && editChildren ? (
        <Stack spacing={2}>
          {editChildren}
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              size="small"
              variant="outlined"
              onClick={handleCancel}
              disabled={isSaving}
            >
              {t("cancel")}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSaving ? t("loading") : t("save")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        children
      )}
    </Paper>
  );
}
