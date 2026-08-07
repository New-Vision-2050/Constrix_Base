"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import NotificationSeverityBadge from "@/modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/NotificationSeverityBadge";
import NotificationStatusBadge from "@/modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/NotificationStatusBadge";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

interface AssignedTaskDetailDialogProps {
  notification: ProjectNotification | null;
  onClose: () => void;
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} sx={{ mt: 0.25 }}>
        {value}
      </Typography>
    </Grid>
  );
}

export default function AssignedTaskDetailDialog({
  notification,
  onClose,
}: AssignedTaskDetailDialogProps) {
  const t = useTranslations("AttendancePresence.assignedTasks");
  const tCommon = useTranslations("common");

  return (
    <Dialog open={notification !== null} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("viewNotification")}</DialogTitle>
      <DialogContent dividers>
        {notification ? (
          <Grid container spacing={2}>
            <DetailField
              label={t("notificationNumber")}
              value={notification.notification_number ?? "—"}
            />
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t("notificationStatus")}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <NotificationStatusBadge
                  status={notification.status}
                  statusLabel={notification.status_label}
                />
              </Box>
            </Grid>
            <DetailField
              label={t("notificationType")}
              value={notification.notification_type?.trim() || "—"}
            />
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t("severity")}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <NotificationSeverityBadge severity={notification.severity} />
              </Box>
            </Grid>
            <DetailField
              label={t("workType")}
              value={notification.work_type?.trim() || "—"}
            />
            <DetailField
              label={t("contractor")}
              value={notification.contractor_name?.trim() || "—"}
            />
            <DetailField
              label={t("companyName")}
              value={notification.company_name?.trim() || "—"}
            />
            <DetailField
              label={t("engineer")}
              value={
                notification.assigned_users && notification.assigned_users.length > 0
                  ? notification.assigned_users.map((user) => user.name).join(", ")
                  : (notification.assigned_user?.name ?? "—")
              }
            />
            <DetailField
              label={t("phone")}
              value={notification.assigned_user?.phone?.trim() || "—"}
            />
            <DetailField
              label={t("feederNumber")}
              value={notification.feeder_number?.trim() || "—"}
            />
            <DetailField
              label={t("magdyNumber")}
              value={notification.magdy_number?.trim() || "—"}
            />
            <DetailField
              label={t("machineNumber")}
              value={notification.machine_number?.trim() || "—"}
            />
            <DetailField
              label={t("receiveDate")}
              value={formatDateTime(notification.task_date)}
            />
            <DetailField
              label={t("durationHours")}
              value={notification.duration_hours ?? "—"}
            />
            <DetailField
              label={t("date")}
              value={formatDateTime(notification.created_at)}
            />
            <Grid size={{ xs: 12 }}>
              <DetailField
                label={t("description")}
                value={notification.work_description?.trim() || "—"}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DetailField
                label={t("location")}
                value={notification.repair_point?.trim() || "—"}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DetailField
                label={t("notes")}
                value={notification.notes?.trim() || "—"}
              />
            </Grid>
          </Grid>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>{tCommon("close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
