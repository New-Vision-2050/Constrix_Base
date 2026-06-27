"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface CreateNotificationWizardProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateNotificationWizard({
  open,
  onClose,
}: CreateNotificationWizardProps) {
  const t = useTranslations("project.maintenanceEmergency");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{t("notifications.addNotification")}</span>
        <IconButton onClick={onClose} aria-label={t("notifications.cancel")}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            {t("comingSoon")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            5-step wizard will be implemented in the next phase.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
