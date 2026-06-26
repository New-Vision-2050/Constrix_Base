"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import type { NotificationStatus } from "@/services/api/projects/notifications/types/response";
import {
  STATUS_CONFIG,
} from "@/modules/projects/project/utils/notificationStatusConfig";

interface NotificationStatusBadgeProps {
  status: NotificationStatus;
}

export default function NotificationStatusBadge({
  status,
}: NotificationStatusBadgeProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <Chip
      label={t(config.labelKey)}
      size="small"
      variant="outlined"
      color={config.muiColor}
      sx={{
        minWidth: 80,
        py: 1.5,
        borderRadius: "16px",
        fontWeight: 500,
        borderWidth: 1,
        "& .MuiChip-label": {
          px: 2,
        },
      }}
    />
  );
}
