"use client";

import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
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
import { useProjectNotificationDetail, useProjectNotificationAvailableActions } from "@/modules/projects/project/query/useProjectNotificationMutations";
import { useEmployeeTaskProcedures } from "@/modules/projects/project/query/useEmployeeTaskProcedures";
import { formatDistanceMeters } from "@/modules/projects/project/utils/distanceFormat";
import NotificationStatusBadge from "./NotificationStatusBadge";
import NotificationSeverityBadge from "./NotificationSeverityBadge";
import type { ProjectNotificationAttachment } from "@/services/api/projects/notifications/types/response";

interface NotificationDetailViewProps {
  projectId: string;
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

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatDateOnly(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
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
                href={attachment.url}
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
  notificationId,
}: NotificationDetailViewProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const theme = useTheme();
  const isRTL = theme.direction === "rtl";
  const [activeTab, setActiveTab] = useState(0);

  const { data: notification, isLoading, isError } = useProjectNotificationDetail(
    projectId,
    notificationId,
  );

  const taskId = notification?.employee_task?.id;
  const { data: proceduresData } = useEmployeeTaskProcedures(taskId);
  const procedures = proceduresData?.items ?? [];
  const proceduresSummary = proceduresData?.summary ?? null;
  const { data: availableActions = [] } = useProjectNotificationAvailableActions(
    notificationId,
  );

  const handleBack = () => {
    router.back();
  };

  const detailFields = useMemo(() => {
    if (!notification) return [];
    const tDash = "—";
    return [
      { caption: t("notificationNumber"), value: notification.notification_number ?? tDash },
      { caption: t("notificationType"), value: notification.notification_type },
      { caption: t("workType"), value: notification.work_type },
      { caption: t("severity"), value: notification.severity },
      { caption: t("status"), value: notification.status_label ?? notification.status ?? tDash },
      { caption: t("contractor"), value: notification.contractor_name },
      { caption: t("contractorNumber"), value: notification.contractor_number ?? tDash },
      { caption: t("magdy_number"), value: notification.magdy_number ?? tDash },
      { caption: t("feeder_number"), value: notification.feeder_number ?? tDash },
      { caption: t("engineer"), value: notification.assigned_user?.name ?? tDash },
      { caption: t("taskDate"), value: formatDateOnly(notification.task_date) },
      {
        caption: t("durationHours"),
        value: notification.duration_hours ? String(notification.duration_hours) : tDash,
      },
      {
        caption: t("distance"),
        value: formatDistanceMeters(
          notification.selected_distance_meters,
          t("meters"),
          t("kilometers"),
        ),
      },
      { caption: t("repairPoint"), value: notification.repair_point ?? tDash },
      {
        caption: t("coordinates"),
        value: `${notification.task_latitude}, ${notification.task_longitude}`,
      },
      { caption: t("createdAt"), value: formatDateTime(notification.created_at) },
      { caption: t("createdBy"), value: notification.created_by?.name ?? tDash },
      { caption: t("notes"), value: notification.notes ?? tDash },
    ];
  }, [notification, t]);

  const taskAttachments = notification?.employee_task?.attachments ?? [];
  const procedureAttachments = notification?.employee_task?.procedure_attachments ?? [];
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

  const assignedUserName = notification.assigned_user?.name ?? "—";
  const durationLabel = notification.duration_hours
    ? String(notification.duration_hours)
    : "—";
  const attachmentsCount = allAttachments.length;
  const description = notification.work_description?.trim() || "";
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
      </Stack>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t("status")}>
            <NotificationStatusBadge status={notification.status} />
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
        </Tabs>
      </Paper>

      {/* Details tab */}
      {activeTab === 0 && (
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Grid container rowSpacing={3} columnSpacing={2}>
              {detailFields.map((field) => (
                <Grid key={field.caption} size={{ xs: 6, sm: 4, md: 3 }}>
                  <FieldBlock caption={field.caption} value={field.value} />
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              {t("description")}
            </Typography>
            <Typography
              variant="body2"
              color={description ? "text.primary" : "text.secondary"}
              sx={{ whiteSpace: "pre-wrap" }}
            >
              {description || t("noDescription")}
            </Typography>
          </Paper>

          {notification.employee_task && (
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
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
        </Stack>
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

      {/* Procedures tab */}
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

          {proceduresSummary && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard title={t("totalProcedures")}>
                  <CountBlock value={proceduresSummary.total} label={t("procedures")} />
                </StatCard>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard title={t("lastAction")}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {proceduresSummary.last_action ?? "—"}
                  </Typography>
                </StatCard>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard title={t("startDate")}>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDateOnly(proceduresSummary.start_date)}
                  </Typography>
                </StatCard>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard title={t("progress")}>
                  <CountBlock value={`${proceduresSummary.progress}%`} label={t("progress")} />
                </StatCard>
              </Grid>
            </Grid>
          )}

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              {t("procedures")}
            </Typography>
            {procedures.length ? (
              <Stack spacing={1.5}>
                {procedures.map((procedure) => (
                  <Paper
                    key={procedure.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {procedure.step_number}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {procedure.name}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 0.5, flexWrap: "wrap", gap: 1 }}>
                        {procedure.taken_by && (
                          <Typography variant="caption" color="text.secondary">
                            {t("takenBy")}: {procedure.taken_by.name}
                          </Typography>
                        )}
                        {procedure.taken_at && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(procedure.taken_at)}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                    {procedure.percentage > 0 && (
                      <Chip
                        label={`${procedure.percentage}%`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t("noProcedures")}
              </Typography>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              {t("availableActions")}
            </Typography>
            {availableActions.length ? (
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
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t("noProcedures")}
              </Typography>
            )}
          </Paper>
        </Stack>
      )}
    </Box>
  );
}
