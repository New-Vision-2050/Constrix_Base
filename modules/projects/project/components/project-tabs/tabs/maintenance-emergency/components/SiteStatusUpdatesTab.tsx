"use client";

import { useMemo } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Copy, FileText, Check } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Link from "next/link";
import { useSiteStatusUpdates } from "@/modules/projects/project/query/useProjectNotificationMutations";
import type {
  ProjectNotification,
  SiteStatusUpdate,
  SiteStatusUpdateAttachment,
} from "@/services/api/projects/notifications/types/response";

const CONSULTANT_NAME = "ابعاد الرؤية";

const STATUS_COLOR_MAP: Record<string, "warning" | "success" | "info" | "error" | "default"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  in_progress: "info",
  completed: "success",
  cancelled: "default",
};

const STATUS_LABEL_KEY: Record<string, string> = {
  pending: "statuses.pending",
  approved: "statuses.approved",
  rejected: "statuses.rejected",
  in_progress: "statuses.inProgress",
  completed: "statuses.completed",
  cancelled: "statuses.cancelled",
};

function formatArabicDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  const day = d.getDate();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function normalizeUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function isImageAttachment(att: SiteStatusUpdateAttachment): boolean {
  if (att.mime_type) return att.mime_type.startsWith("image/");
  if (att.name) {
    const ext = att.name.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext ?? "");
  }
  return false;
}

function buildCopyText(
  notification: ProjectNotification,
  update: SiteStatusUpdate,
): string {
  const date = formatArabicDate(update.created_at);
  const lines = [
    "📋 تقرير إنجاز عمل وتصريح تشغيل",
    `الاستشاري: ${CONSULTANT_NAME}`,
    `المقاول: ${notification.contractor_name ?? ""}`,
    `📅 التاريخ:  ${date}`,
    `🔢 رقم البلاغ: ${notification.notification_number ?? ""}`,
    `🔌 المغذي: ${notification.feeder_number ?? ""}`,
    `⚙️ رقم المعدة: ${notification.machine_number ?? ""}`,
    `🏗️ طبيعة العمل: ${notification.work_type ?? ""}`,
    `✍️ مصدر التصريح: ${notification.permit_source ?? ""}`,
    `👤 مستلم التصريح: ${notification.permit_recipient ?? ""}`,
    `⏱️ الوقت المتوقع لإنهاء العمل: ${notification.duration_hours ?? ""}`,
    `🟢 حالة التشغيل: ${update.status ?? ""}`,
    `📍 الموقع الجغرافي: ${notification.repair_point ?? ""}`,
    `🗺️ رابط الموقع (Google Maps):   ${notification.location_link ?? ""}`,
    "",
    `حالة العطل:  ${update.description ?? ""}`,
  ];
  return lines.join("\n");
}

interface SiteStatusUpdatesTabProps {
  notification: ProjectNotification;
  notificationId: string;
}

export default function SiteStatusUpdatesTab({
  notification,
  notificationId,
}: SiteStatusUpdatesTabProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const { data, isLoading, isError } = useSiteStatusUpdates(notificationId);

  const items = useMemo(() => data?.items ?? [], [data]);
  const summary = data?.summary;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t("siteStatusLoadError")}</Typography>
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {t("noSiteStatusUpdates")}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      {/* Summary */}
      {summary && (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700}>
                {summary.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("siteStatusTotal")}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700} color="success.main">
                {summary.approved}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("siteStatusApproved")}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700} color="warning.main">
                {summary.pending}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("siteStatusPending")}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2.5,
        }}
      >
        {items.map((update) => (
          <SiteStatusCard
            key={update.id}
            update={update}
            notification={notification}
            t={t}
          />
        ))}
      </Box>
    </Stack>
  );
}

function SiteStatusCard({
  update,
  notification,
  t,
}: {
  update: SiteStatusUpdate;
  notification: ProjectNotification;
  t: ReturnType<typeof useTranslations>;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = buildCopyText(notification, update);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(t("copiedToClipboard"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const statusColor = STATUS_COLOR_MAP[update.status] ?? "default";
  const dateLabel = formatArabicDate(update.created_at);
  const imageAttachments = update.attachments.filter(isImageAttachment);
  const otherAttachments = update.attachments.filter((a) => !isImageAttachment(a));

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 200ms ease",
        "&:hover": { boxShadow: 2 },
      }}
    >
      {/* Card header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "action.hover",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            📅 {dateLabel}
          </Typography>
          <Chip
            label={STATUS_LABEL_KEY[update.status] ? t(STATUS_LABEL_KEY[update.status]) : update.status}
            size="small"
            color={statusColor}
            variant="outlined"
            sx={{ borderRadius: "16px", fontWeight: 500 }}
          />
        </Stack>
        <Tooltip title={t("copyReport")}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              color: copied ? "success.main" : "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Card body — full report */}
      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Report title */}
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: "primary.main" }}>
          📋 {t("reportTitle")}
        </Typography>

        {/* Report fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <ReportField icon="🏢" label={t("reportConsultant")} value={CONSULTANT_NAME} />
          <ReportField icon="🏗️" label={t("reportContractor")} value={notification.contractor_name} />
          <ReportField icon="📅" label={t("reportDate")} value={dateLabel} />
          <ReportField icon="🔢" label={t("reportNotificationNumber")} value={notification.notification_number} />
          <ReportField icon="🔌" label={t("reportFeeder")} value={notification.feeder_number} />
          <ReportField icon="⚙️" label={t("reportEquipmentNumber")} value={notification.machine_number} />
          <ReportField icon="🏗️" label={t("reportWorkType")} value={notification.work_type} />
          <ReportField
            icon="✍️"
            label={t("reportAuthorizationSource")}
            value={notification.permit_source}
          />
          <ReportField
            icon="👤"
            label={t("reportAuthorizationReceiver")}
            value={notification.permit_recipient}
          />
          <ReportField
            icon="⏱️"
            label={t("reportEstimatedTime")}
            value={notification.duration_hours ? String(notification.duration_hours) : null}
          />
          <ReportField
            icon="🟢"
            label={t("reportOperationStatus")}
            value={STATUS_LABEL_KEY[update.status] ? t(STATUS_LABEL_KEY[update.status]) : update.status}
          />
          <ReportField icon="📍" label={t("reportLocation")} value={notification.repair_point} />
          {notification.location_link && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" component="span">
                🗺️ {t("reportMapLink")}:
              </Typography>
              <Link
                href={normalizeUrl(notification.location_link)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--mui-palette-primary-main)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  wordBreak: "break-all",
                }}
              >
                {t("reportOpenMap")}
              </Link>
            </Box>
          )}
        </Box>

        {/* Divider */}
        <Box sx={{ height: "1px", bgcolor: "divider" }} />

        {/* Fault status (description) */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 0.5 }}>
            {t("reportFaultStatus")}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
          >
            {update.description || "—"}
          </Typography>
        </Box>

        {/* Requested by / Reviewed by */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
              {t("siteStatusRequestedBy")}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {update.requested_by?.name ?? "—"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
              {t("siteStatusReviewedBy")}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {update.reviewed_by?.name ?? "—"}
            </Typography>
          </Grid>
        </Grid>

        {/* Image attachments */}
        {imageAttachments.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1,
            }}
          >
            {imageAttachments.map((att, idx) => (
              <Box
                key={att.id ?? idx}
                component={Link}
                href={normalizeUrl(att.url)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "block",
                  borderRadius: 2,
                  overflow: "hidden",
                  aspectRatio: "1",
                  border: 1,
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.85 },
                }}
              >
                <Box
                  component="img"
                  src={normalizeUrl(att.url)}
                  alt={att.name ?? `image-${idx}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Other attachments */}
        {otherAttachments.length > 0 && (
          <Stack spacing={1}>
            {otherAttachments.map((att, idx) => (
              <Paper
                key={att.id ?? idx}
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
                  <Tooltip title={att.name ?? att.url}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      noWrap
                      component={Link}
                      href={normalizeUrl(att.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      {att.name ?? att.url}
                    </Typography>
                  </Tooltip>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}

        {/* Process steps */}
        {update.process && update.process.steps.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 1 }}>
              {t("siteStatusProcessSteps")}
            </Typography>
            <Stack spacing={1}>
              {update.process.steps.map((step, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                    <Chip
                      label={STATUS_LABEL_KEY[step.status] ? t(STATUS_LABEL_KEY[step.status]) : step.status}
                      size="small"
                      color={STATUS_COLOR_MAP[step.status] ?? "default"}
                      variant="outlined"
                      sx={{ borderRadius: "12px", fontSize: "0.7rem" }}
                    />
                    {step.name && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {step.name}
                      </Typography>
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {step.action_by?.name ?? "—"}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

function ReportField({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
      <Typography variant="body2" fontWeight={600} color="text.secondary" component="span" sx={{ flexShrink: 0 }}>
        {icon} {label}:
      </Typography>
      <Typography variant="body2" fontWeight={600} color="text.primary" component="span">
        {value || "—"}
      </Typography>
    </Box>
  );
}
