"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { ROUTER } from "@/router";
import {
  useProjectNotificationDetail,
  useProjectNotificationAvailableActions,
  useProjectNotificationReadStatusMutation,
} from "@/modules/projects/project/query/useProjectNotificationMutations";
import { useEmployeeTaskProcedures } from "@/modules/projects/project/query/useEmployeeTaskProcedures";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import {
  PROJECT_NOTIFICATION_UPDATE,
} from "@/modules/projects/project/constants/projectPermissionKeys";
import { hasProjectPermissionKey } from "@/modules/projects/project/utils/projectMyPermissions";
import NotificationStatusBadge from "./NotificationStatusBadge";
import NotificationSeverityBadge from "./NotificationSeverityBadge";
import NotificationDetailEditable from "./NotificationDetailEditable";
import ProceduresCarousel from "./ProceduresCarousel";
import SiteStatusUpdatesTab from "./SiteStatusUpdatesTab";
import ReassignTaskModal from "./ReassignTaskModal";
import type { ProjectNotificationAttachment } from "@/services/api/projects/notifications/types/response";

interface NotificationDetailViewProps {
  projectId?: string;
  contractualEngagementKey?: string;
  notificationId: string;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase() || "?";
}

function truncateFileName(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

function normalizeFileUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function FieldBlock({ caption, value }: { caption: string; value: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        display="block"
        sx={{ mb: 0.5 }}
      >
        {caption}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={{ wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function StatCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        minHeight: 116,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        {children}
      </Box>
    </Paper>
  );
}

function CountBlock({ value, label }: { value: string | number; label: string }) {
  return (
    <Box sx={{ textAlign: "center", minWidth: 0 }}>
      <Typography variant="h6" fontWeight={700} lineHeight={1.1}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function AttachmentList({
  items,
  emptyLabel,
}: {
  items: ProjectNotificationAttachment[];
  emptyLabel: string;
}) {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: 1.5,
      }}
    >
      {items.map((attachment, index) => (
        <Paper
          key={attachment.id ?? `${attachment.url}-${index}`}
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Tooltip title={attachment.name ?? attachment.url}>
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                component={Link}
                href={normalizeFileUrl(attachment.url)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "primary.main", textDecoration: "none" }}
              >
                {truncateFileName(attachment.name ?? attachment.url, 30)}
              </Typography>
            </Tooltip>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default function NotificationDetailView({
  projectId,
  contractualEngagementKey,
  notificationId,
}: NotificationDetailViewProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const theme = useTheme();
  const isRTL = theme.direction === "rtl";
  const [activeTab, setActiveTab] = useState(0);
  const [reassignOpen, setReassignOpen] = useState(false);
  const notificationScope = { projectId, contractualEngagementKey };
  const isEngagement = !!contractualEngagementKey;

  const { data: flatPerms } = useProjectMyPermissionsFlat(projectId);

  const canReassign = useMemo(
    () =>
      isEngagement ||
      hasProjectPermissionKey(flatPerms, PROJECT_NOTIFICATION_UPDATE),
    [isEngagement, flatPerms],
  );

  const readStatusMutation = useProjectNotificationReadStatusMutation(notificationScope);

  const { data: notification, isLoading, isError } = useProjectNotificationDetail(
    notificationScope,
    notificationId,
  );

  useEffect(() => {
    if (notification && notification.is_read === false && !readStatusMutation.isPending) {
      readStatusMutation.mutate({ id: notificationId, is_read: true });
    }
  }, [notification, notificationId, readStatusMutation]);

  const taskId = notification?.employee_task?.id;
  const { data: proceduresData } = useEmployeeTaskProcedures(taskId);
  const procedures = proceduresData?.items ?? [];
  const proceduresSummary = proceduresData?.summary ?? null;
  const { data: availableActions = [] } = useProjectNotificationAvailableActions(
    notificationId,
  );

  const handleBack = () => {
    if (contractualEngagementKey) {
      router.push(
        `${ROUTER.UNIFIED_CONTRACT(contractualEngagementKey)}?tab=engagement-tab-maintenance`,
      );
      return;
    }
    router.push(`/projects/${projectId}?tab=project-tab-maintenance`);
  };

  const taskAttachments = notification?.attachments ?? notification?.employee_task?.attachments ?? [];
  const procedureAttachments = notification?.procedure_attachments ?? notification?.employee_task?.procedure_attachments ?? [];
  const allAttachments = useMemo(() => {
    const list: ProjectNotificationAttachment[] = [...taskAttachments];
    procedureAttachments.forEach((group) => {
      list.push(...group.attachments);
    });
    return list;
  }, [taskAttachments, procedureAttachments]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 320,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t("loadError")}</Typography>
      </Box>
    );
  }

  if (!notification) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 320,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const assignedUserName =
    notification.assigned_users && notification.assigned_users.length > 0
      ? notification.assigned_users.map((u) => u.name).join(", ")
      : (notification.assigned_user?.name ?? "—");
  const durationLabel = notification.duration_hours
    ? String(notification.duration_hours)
    : "—";
  const attachmentsCount = allAttachments.length;
  const taskTitle = notification.employee_task?.title ?? notification.notification_number ?? "—";
  const taskSerial = notification.employee_task?.serial_number ?? "—";
  const taskUser = notification.employee_task?.user?.name ?? assignedUserName;

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", p: { xs: 2, md: 3 } }}>
      {/* Top bar */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}
      >
        <IconButton
          aria-label={tCommon("back")}
          onClick={handleBack}
          size="small"
          sx={{ border: 1, borderColor: "divider" }}
        >
          {isRTL ? (
            <ArrowForwardIcon fontSize="small" />
          ) : (
            <ArrowBackIcon fontSize="small" />
          )}
        </IconButton>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flex: 1, minWidth: 0, flexWrap: "wrap" }}
        >
          <Typography variant="body2" color="text.secondary">
            {t("title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            /
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {notification.notification_type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            /
          </Typography>
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {notification.notification_number ?? "—"}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {t("updatedAt")}: {formatDateTime(notification.updated_at)}
        </Typography>
        {notification.employee_task && canReassign && (
          <Button
            variant="contained"
            size="small"
            onClick={() => setReassignOpen(true)}
          >
            {t("reassignTask", { defaultValue: "Reassign Task" })}
          </Button>
        )}
      </Stack>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t("status")}>
            <NotificationStatusBadge
              status={notification.status}
              statusLabel={notification.status_label}
            />
          </StatCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t("engineer")}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%" }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  width: 44,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {getInitials(assignedUserName)}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" fontWeight={700} noWrap title={assignedUserName}>
                  {assignedUserName}
                </Typography>
              </Box>
            </Stack>
          </StatCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={tCommon("counts")}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              sx={{ width: "100%" }}
              spacing={2}
            >
              <CountBlock value={durationLabel} label={t("durationHours")} />
              <Box
                sx={{
                  width: "1px",
                  alignSelf: "stretch",
                  bgcolor: "divider",
                }}
              />
              <CountBlock value={attachmentsCount} label={t("attachments")} />
            </Stack>
          </StatCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t("severity")}>
            <NotificationSeverityBadge severity={notification.severity} />
          </StatCard>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper
        variant="outlined"
        sx={{
          px: 1.5,
          py: 1,
          mb: 2,
          borderRadius: 2,
          bgcolor: "action.hover",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          aria-label={t("details")}
          variant="scrollable"
          scrollButtons={false}
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 36,
              borderRadius: 999,
              px: 2,
              mx: 0.25,
              fontWeight: 600,
              color: "text.primary",
              transition:
                "background-color 120ms ease, color 120ms ease, box-shadow 120ms ease",
            },
            "& .Mui-selected": {
              bgcolor: "primary.main",
              color: "white !important",
              boxShadow: 1,
            },
          }}
        >
          <Tab label={t("details")} />
          <Tab label={t("attachments")} />
          <Tab label={t("procedures")} />
          <Tab label={t("siteStatusUpdates")} />
        </Tabs>
      </Paper>

      {/* Details tab — editable sections */}
      {activeTab === 0 && (
        <NotificationDetailEditable notification={notification} />
      )}

      {/* Attachments tab */}
      {activeTab === 1 && (
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              {t("taskAttachments")}
            </Typography>
            <AttachmentList items={taskAttachments} emptyLabel={t("noAttachments")} />
          </Paper>

          {procedureAttachments.map((group, groupIndex) => (
            <Paper
              key={`${group.title}-${groupIndex}`}
              variant="outlined"
              sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
            >
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                {group.title}
              </Typography>
              <AttachmentList items={group.attachments} emptyLabel={t("noAttachments")} />
            </Paper>
          ))}
        </Stack>
      )}

      {/* Procedures tab — carousel */}
      {activeTab === 2 && (
        <Stack spacing={2.5}>
          {notification.employee_task && (
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                {t("taskSummary")}
              </Typography>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <FieldBlock caption={t("taskSerial")} value={taskSerial} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <FieldBlock caption={t("taskTitle")} value={taskTitle} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <FieldBlock
                    caption={t("taskStatus")}
                    value={
                      notification.employee_task.status_label ??
                      notification.employee_task.status ??
                      "—"
                    }
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <FieldBlock caption={t("taskUser")} value={taskUser} />
                </Grid>
              </Grid>
            </Paper>
          )}

          <ProceduresCarousel procedures={procedures} summary={proceduresSummary} />

          {availableActions.length > 0 && (
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                {t("availableActions")}
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5 }}>
                {availableActions
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((action) => (
                    <Chip
                      key={action.id}
                      label={action.name}
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: 999, py: 1.5, fontWeight: 600 }}
                    />
                  ))}
              </Stack>
            </Paper>
          )}
        </Stack>
      )}

      {/* Site status updates tab */}
      {activeTab === 3 && (
        <SiteStatusUpdatesTab
          notification={notification}
          notificationId={notificationId}
        />
      )}

      <ReassignTaskModal
        notification={notification}
        scope={notificationScope}
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
      />
    </Box>
  );
}
