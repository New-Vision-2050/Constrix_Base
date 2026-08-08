"use client";

import { useMemo } from "react";
import { Alert, Box, CircularProgress, Grid } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useProjectNotificationAvailableActions } from "@/modules/projects/project/query/useProjectNotificationMutations";
import { getFormDisplayName } from "@/modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/procedureFormData";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationAvailableAction } from "@/services/api/projects/notifications/types/response";
import AttendanceDialogShell, {
  AttendanceDialogIcon,
} from "../TodayLog/AttendanceDialogShell";
import { getActionHeaderIcon, getActionIcon } from "./getActionIcon";

interface AssignedTaskActionsDialogProps {
  notification: ProjectNotification | null;
  onClose: () => void;
  onSelectAction?: (
    action: ProjectNotificationAvailableAction,
    notification: ProjectNotification,
  ) => void;
}

function ActionCard({
  action,
  locale,
  onClick,
}: {
  action: ProjectNotificationAvailableAction;
  locale: string;
  onClick: () => void;
}) {
  const Icon = getActionIcon(action.form.key);
  const description =
    locale === "ar"
      ? action.form.label_ar?.trim()
      : getFormDisplayName(action.form.key, false);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full flex-col items-center rounded-xl border border-border bg-card px-4 py-5 text-center transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon size={22} strokeWidth={2} />
      </span>
      <span className="mb-1 text-sm font-bold text-foreground">{action.name}</span>
      {description ? (
        <span className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      ) : null}
    </button>
  );
}

export default function AssignedTaskActionsDialog({
  notification,
  onClose,
  onSelectAction,
}: AssignedTaskActionsDialogProps) {
  const t = useTranslations("AttendancePresence.assignedTasks");
  const locale = useLocale();
  const open = notification !== null;
  const HeaderIcon = getActionHeaderIcon();

  const { data: actions = [], isLoading, isError } =
    useProjectNotificationAvailableActions(open ? notification?.id : undefined);

  const sortedActions = useMemo(
    () => [...actions].sort((a, b) => a.sort_order - b.sort_order),
    [actions],
  );

  return (
    <AttendanceDialogShell
      open={open}
      onClose={onClose}
      title={t("actionsDialogTitle")}
      className="max-w-2xl"
    >
      <AttendanceDialogIcon>
        <HeaderIcon size={26} className="text-primary-foreground" />
      </AttendanceDialogIcon>

      <div className="mb-6 text-center">
        <h2 className="text-lg font-bold text-primary">{t("actionsDialogTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("actionsDialogSubtitle")}
        </p>
      </div>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : null}

      {isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("actionsLoadError")}
        </Alert>
      ) : null}

      {!isLoading && !isError && sortedActions.length === 0 ? (
        <Alert severity="info">{t("noActionsAvailable")}</Alert>
      ) : null}

      {!isLoading && sortedActions.length > 0 ? (
        <Grid container spacing={2}>
          {sortedActions.map((action) => (
            <Grid key={action.id} size={{ xs: 12, sm: 6 }}>
              <ActionCard
                action={action}
                locale={locale}
                onClick={() => {
                  if (!notification) return;
                  onSelectAction?.(action, notification);
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : null}
    </AttendanceDialogShell>
  );
}
