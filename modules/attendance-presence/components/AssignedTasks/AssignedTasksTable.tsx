"use client";

import { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationAvailableAction } from "@/services/api/projects/notifications/types/response";
import { useMyAssignedNotificationTasks } from "../../hooks/useMyAssignedNotificationTasks";
import { useAttendanceDirection } from "../../utils/direction";
import AssignedTaskActionsDialog from "./AssignedTaskActionsDialog";
import AssignedTaskNotificationLink from "./AssignedTaskNotificationLink";
import SiteStatusUpdateFormDialog from "./SiteStatusUpdateFormDialog";
import EndTaskFormDialog from "./EndTaskFormDialog";
import ConfirmLocationDialog from "./ConfirmLocationDialog";
import SafetyViolationFormDialog from "./SafetyViolationFormDialog";
import {
  CONFIRM_LOCATION_FORM_KEY,
  END_TASK_FORM_KEY,
  SAFETY_VIOLATION_FORM_KEY,
  SITE_STATUS_UPDATE_FORM_KEY,
} from "./assignedTaskFormKeys";

const TableLayout = HeadlessTableLayout<ProjectNotification>(
  "attendance-assigned-tasks-table",
);

export default function AssignedTasksTable() {
  const t = useTranslations("AttendancePresence.assignedTasks");
  const { dir } = useAttendanceDirection();
  const [actionsTarget, setActionsTarget] = useState<ProjectNotification | null>(
    null,
  );
  const [siteStatusUpdateContext, setSiteStatusUpdateContext] = useState<{
    notification: ProjectNotification;
    action: ProjectNotificationAvailableAction;
  } | null>(null);
  const [endTaskContext, setEndTaskContext] = useState<{
    notification: ProjectNotification;
    action: ProjectNotificationAvailableAction;
  } | null>(null);
  const [confirmLocationContext, setConfirmLocationContext] = useState<{
    notification: ProjectNotification;
    action: ProjectNotificationAvailableAction;
  } | null>(null);
  const [safetyViolationContext, setSafetyViolationContext] = useState<{
    notification: ProjectNotification;
    action: ProjectNotificationAvailableAction;
  } | null>(null);

  const handleSelectAction = (
    action: ProjectNotificationAvailableAction,
    notification: ProjectNotification,
  ) => {
    setActionsTarget(null);

    if (action.form.key === SITE_STATUS_UPDATE_FORM_KEY) {
      setSiteStatusUpdateContext({ notification, action });
      return;
    }

    if (action.form.key === END_TASK_FORM_KEY) {
      setEndTaskContext({ notification, action });
      return;
    }

    if (action.form.key === CONFIRM_LOCATION_FORM_KEY) {
      setConfirmLocationContext({ notification, action });
      return;
    }

    if (action.form.key === SAFETY_VIOLATION_FORM_KEY) {
      setSafetyViolationContext({ notification, action });
    }
  };

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryResult, isLoading, isError } = useMyAssignedNotificationTasks({
    page: params.page,
    perPage: params.limit,
    search: params.search || undefined,
  });

  const records = useMemo(() => queryResult?.data ?? [], [queryResult]);
  const totalPages = queryResult?.pagination?.last_page ?? 1;
  const totalItems = queryResult?.pagination?.result_count ?? records.length;

  const columns = useMemo(
    () => [
      {
        key: "notification_number",
        name: t("notificationNumber"),
        sortable: false,
        render: (row: ProjectNotification) => (
          <AssignedTaskNotificationLink row={row} />
        ),
      },
      {
        key: "status_label",
        name: t("notificationStatus"),
        sortable: false,
        render: (row: ProjectNotification) => (
          <span>{row.status_label?.trim() || "—"}</span>
        ),
      },
      {
        key: "notification_type",
        name: t("notificationType"),
        sortable: false,
        render: (row: ProjectNotification) => (
          <span>{row.notification_type?.trim() || "—"}</span>
        ),
      },
      {
        key: "actions",
        name: t("action"),
        sortable: false,
        render: (row: ProjectNotification) => (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setActionsTarget(row)}
          >
            {t("action")}
          </Button>
        ),
      },
    ],
    [t],
  );

  const state = TableLayout.useTableState({
    data: records,
    columns,
    totalPages,
    totalItems,
    params,
    loading: isLoading,
    selectable: false,
    getRowId: (row) => row.id,
  });

  if (isError) {
    return (
      <Box dir={dir} sx={{ py: 2 }}>
        <span className="text-sm text-destructive">{t("loadError")}</span>
      </Box>
    );
  }

  return (
    <Box dir={dir} sx={{ overflowX: "auto" }}>
      <TableLayout
        table={
          <TableLayout.Table state={state} loadingOptions={{ rows: 5 }} />
        }
        pagination={
          <TableLayout.Pagination
            state={state}
            pageSizeOptions={[10, 20, 50]}
          />
        }
      />

      <AssignedTaskActionsDialog
        notification={actionsTarget}
        onClose={() => setActionsTarget(null)}
        onSelectAction={handleSelectAction}
      />

      <SiteStatusUpdateFormDialog
        notification={siteStatusUpdateContext?.notification ?? null}
        action={siteStatusUpdateContext?.action ?? null}
        onClose={() => setSiteStatusUpdateContext(null)}
      />

      <EndTaskFormDialog
        notification={endTaskContext?.notification ?? null}
        action={endTaskContext?.action ?? null}
        onClose={() => setEndTaskContext(null)}
      />

      <ConfirmLocationDialog
        notification={confirmLocationContext?.notification ?? null}
        action={confirmLocationContext?.action ?? null}
        onClose={() => setConfirmLocationContext(null)}
      />

      <SafetyViolationFormDialog
        notification={safetyViolationContext?.notification ?? null}
        action={safetyViolationContext?.action ?? null}
        onClose={() => setSafetyViolationContext(null)}
      />
    </Box>
  );
}
