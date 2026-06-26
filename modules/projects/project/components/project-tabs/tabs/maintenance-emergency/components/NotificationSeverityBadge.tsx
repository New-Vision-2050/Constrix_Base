"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import type { NotificationSeverity } from "@/services/api/projects/notifications/types/response";
import {
  SEVERITY_CONFIG,
} from "@/modules/projects/project/utils/notificationStatusConfig";

interface NotificationSeverityBadgeProps {
  severity: NotificationSeverity;
}

export default function NotificationSeverityBadge({
  severity,
}: NotificationSeverityBadgeProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.medium;

  return (
    <Chip
      label={t(config.labelKey)}
      size="small"
      variant="filled"
      color={config.muiColor}
      sx={{
        minWidth: 70,
        py: 1,
        borderRadius: "16px",
        fontWeight: 500,
        "& .MuiChip-label": {
          px: 2,
        },
      }}
    />
  );
}
