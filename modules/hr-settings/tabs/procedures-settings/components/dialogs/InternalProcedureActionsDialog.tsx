"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";

interface InternalProcedureActionsDialogProps {
  open: boolean;
  procedure: InternalProcedure | null;
  isDeleting?: boolean;
  canDelete?: boolean;
  onClose: () => void;
  onEdit: (procedure: InternalProcedure) => void;
  onDelete: (procedure: InternalProcedure) => void;
}

export default function InternalProcedureActionsDialog({
  open,
  procedure,
  isDeleting = false,
  canDelete = true,
  onClose,
  onEdit,
  onDelete,
}: InternalProcedureActionsDialogProps) {
  const { t } = useProceduresSettingsTranslations();

  if (!procedure) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "start" }}>{procedure.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {t("procedures.title")}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
        <Button
          onClick={() => onEdit(procedure)}
          variant="outlined"
          disabled={isDeleting}
          sx={{ flex: 1 }}
        >
          {t("actions.edit")}
        </Button>
        {canDelete ? (
          <Button
            onClick={() => onDelete(procedure)}
            variant="contained"
            color="error"
            disabled={isDeleting}
            sx={{ flex: 1 }}
          >
            {t("actions.delete")}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
