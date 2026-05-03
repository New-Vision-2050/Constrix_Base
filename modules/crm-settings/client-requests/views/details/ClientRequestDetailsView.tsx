"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { ClientRequestsApi } from "@/services/api/client-requests";
import type { ClientRequestRow } from "@/services/api/client-requests";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { ROUTER } from "@/router";
import { CRM_INBOX_PENDING_COUNT_QUERY_KEY } from "@/components/icons/crm-inbox";
import { CRM_INBOX_LIST_QUERY_KEY } from "@/modules/crm-settings/query-keys";
import FileViewerDialog from "@/modules/projects/project/components/project-tabs/tabs/document-cycle/components/FileViewerDialog";
import type {
  DocumentAttachment,
  DocumentRow,
} from "@/modules/projects/project/components/project-tabs/tabs/document-cycle/types";
import { formatInboxSentDate } from "@/modules/projects/inbox/inbox-columns";
import {
  ApprovalTimeline,
  InboxRequestCommentsField,
  buildClientRequestApprovalTimelineEntries,
  inboxAttachmentFileName,
  type InboxRequestAttachmentLink,
} from "@/modules/crm-settings/inbox/components/inbox-request-dialog";
import AttachmentPreviewCard from "@/modules/crm-settings/inbox/components/inbox-request-dialog/AttachmentPreviewCard";

const CLIENT_REQUESTS_QUERY_KEY = "client-requests-list";
const clientRequestDetailKey = (id: string) =>
  ["client-request-detail", id] as const;

function getApiErrorDescription(error: unknown): string | undefined {
  const data = axios.isAxiosError(error)
    ? error.response?.data
    : (error as { response?: { data?: unknown } })?.response?.data;
  if (!data || typeof data !== "object") return undefined;
  const body = data as { description?: string; message?: unknown };
  if (typeof body.description === "string" && body.description.trim())
    return body.description.trim();
  if (typeof body.message === "string") return body.message;
  return undefined;
}

function mapClientRequestToDocumentRow(row: ClientRequestRow): DocumentRow {
  const typeName = row.client_request_type?.name?.trim();
  return {
    id: row.id,
    serialNumber: row.serial_number,
    name: typeName || row.serial_number || "—",
    fileSize: "—",
    documentCount: row.attachments?.length ?? 0,
    lastActivityUser: row.client?.name?.trim() || "—",
    lastActivityDate: row.created_at,
    status: "pending",
    documentType: typeName,
    approvalStatus: row.status_client_request,
    comments: [],
  };
}

function mapInboxLinkToDocumentAttachment(
  link: InboxRequestAttachmentLink,
): DocumentAttachment {
  return {
    id: String(link.id),
    name: inboxAttachmentFileName(link.label, link.fileName) || "file",
    url: link.href,
    type: link.mimeType ?? "",
    size: "",
  };
}

type StatusVisuals = {
  color: "success" | "warning" | "error" | "default" | "info";
  progress: number;
};

function statusVisuals(status: string): StatusVisuals {
  switch (status.trim().toLowerCase()) {
    case "accepted":
    case "approved":
      return { color: "success", progress: 100 };
    case "rejected":
      return { color: "error", progress: 100 };
    case "pending":
      return { color: "warning", progress: 35 };
    case "draft":
      return { color: "default", progress: 10 };
    default:
      return { color: "info", progress: 50 };
  }
}

function clientRequestStatusLabel(
  status: string,
  tStatus: (key: string) => string,
  tInbox: (key: string) => string,
): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "pending":
      return tStatus("clientRequests.status.pending");
    case "accepted":
      return tStatus("clientRequests.status.accepted");
    case "rejected":
      return tStatus("clientRequests.status.rejected");
    case "draft":
      return tStatus("clientRequests.status.draft");
    case "approved":
      return tStatus("clientRequests.status.approved");
    default:
      return status.trim() || tInbox("emptyDash");
  }
}

function clientTypeLabel(
  clientType: string,
  t: (key: string) => string,
): string {
  if (clientType === "company") return t("clientRequests.form.company");
  if (clientType === "individual") return t("clientRequests.form.individual");
  return clientType || "—";
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0]!.toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

type ClientRequestDetailsViewProps = {
  requestId: string;
};

export default function ClientRequestDetailsView({
  requestId,
}: ClientRequestDetailsViewProps) {
  const t = useTranslations();
  const tInbox = useTranslations("project.inbox");
  const tDoc = useTranslations("project.documentCycle");
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isRTL = theme.direction === "rtl";
  const { can } = usePermissions();
  const canUpdateClientRequest = can(PERMISSIONS.clientRequest.update);

  const [activeTab, setActiveTab] = useState(0);
  const [commentDraft, setCommentDraft] = useState("");
  const [viewerLink, setViewerLink] =
    useState<InboxRequestAttachmentLink | null>(null);

  const {
    data: row,
    isLoading,
    isError,
  } = useQuery({
    queryKey: clientRequestDetailKey(requestId),
    queryFn: async () => {
      const res = await ClientRequestsApi.show(requestId);
      return res.data.payload ?? null;
    },
    enabled: Boolean(requestId),
  });

  useEffect(() => {
    setCommentDraft("");
    setViewerLink(null);
    setActiveTab(0);
  }, [requestId]);

  const invalidateClientRequestsList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [CLIENT_REQUESTS_QUERY_KEY] });
    queryClient.invalidateQueries({
      queryKey: CRM_INBOX_PENDING_COUNT_QUERY_KEY,
    });
    queryClient.invalidateQueries({ queryKey: [CRM_INBOX_LIST_QUERY_KEY] });
    queryClient.invalidateQueries({
      queryKey: clientRequestDetailKey(requestId),
    });
  }, [queryClient, requestId]);

  const statusMutation = useMutation({
    mutationFn: (vars: {
      id: string;
      status: "accepted" | "rejected";
      reject_cause?: string;
    }) =>
      vars.status === "accepted"
        ? ClientRequestsApi.updateStatus(vars.id, {
            status_client_request: "accepted",
          })
        : ClientRequestsApi.updateStatus(vars.id, {
            status_client_request: "rejected",
            reject_cause: vars.reject_cause ?? "",
          }),
    onSuccess: (_data, vars) => {
      toast.success(
        vars.status === "accepted"
          ? t("clientRequests.inbox.toastAcceptSuccess")
          : t("clientRequests.inbox.toastRejectSuccess"),
      );
      invalidateClientRequestsList();
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorDescription(error) ??
          t("clientRequests.inbox.toastOperationError"),
      );
    },
  });

  const pendingStatusAction = statusMutation.isPending;

  const detailsCanRespond = useMemo(
    () =>
      String(row?.status_client_request ?? "")
        .trim()
        .toLowerCase() === "pending",
    [row?.status_client_request],
  );

  const handleBack = useCallback(() => {
    router.push(ROUTER.CRM.clientRequests);
  }, [router]);

  const handleAccept = useCallback(() => {
    if (!row) return;
    statusMutation.mutate({ id: row.id, status: "accepted" });
  }, [row, statusMutation]);

  const handleReject = useCallback(() => {
    if (!row) return;
    const cause = commentDraft.trim();
    if (!cause) {
      toast.error(t("clientRequests.dialog.rejectCauseRequired"));
      return;
    }
    statusMutation.mutate({
      id: row.id,
      status: "rejected",
      reject_cause: cause,
    });
  }, [row, commentDraft, statusMutation, t]);

  const documentForViewer = useMemo(
    () => (row ? mapClientRequestToDocumentRow(row) : null),
    [row],
  );

  const activeFileForViewer = useMemo(
    () => (viewerLink ? mapInboxLinkToDocumentAttachment(viewerLink) : null),
    [viewerLink],
  );

  const timelineEntries = useMemo(
    () =>
      row ? buildClientRequestApprovalTimelineEntries(row, tDoc, tInbox) : [],
    [row, tDoc, tInbox],
  );

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

  if (isError || !row) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          {t("clientRequests.details.loadError")}
        </Typography>
      </Box>
    );
  }

  const typeLabel =
    row.client_request_type?.name?.trim() || tInbox("emptyDash");
  const sourceLabel =
    row.client_request_receiver_from?.name?.trim() || tInbox("emptyDash");
  const branchLabel = row.branch?.name?.trim() || tInbox("emptyDash");
  const managementLabel = row.management?.name?.trim() || tInbox("emptyDash");
  const clientName = row.client?.name?.trim() || tInbox("emptyDash");
  const financialResponsibleName =
    row.financial_responsible?.name?.trim() || tInbox("emptyDash");
  const statusLabel = clientRequestStatusLabel(
    row.status_client_request,
    t,
    tInbox,
  );
  const statusVis = statusVisuals(row.status_client_request);
  const requestDate = row.created_at
    ? formatInboxSentDate(row.created_at).trim()
    : "";
  const requestDateLabel = requestDate || tInbox("emptyDash");
  const lastUpdated = row.updated_at
    ? formatInboxSentDate(row.updated_at).trim()
    : "";
  const lastUpdatedLabel = lastUpdated || requestDateLabel;
  const servicesCount = row.services?.length ?? 0;
  const attachmentsCount = row.attachments?.length ?? 0;
  const description = row.content?.trim() || "";
  const showActions = detailsCanRespond && canUpdateClientRequest;

  const detailFields: { caption: string; value: string }[] = [
    { caption: t("clientRequests.table.requestType"), value: typeLabel },
    { caption: t("clientRequests.table.source"), value: sourceLabel },
    { caption: t("clientRequests.table.branch"), value: branchLabel },
    {
      caption: t("clientRequests.table.assignedManagement"),
      value: managementLabel,
    },
    {
      caption: t("clientRequests.details.fieldClientType"),
      value: clientTypeLabel(row.client_type, t),
    },
    { caption: t("clientRequests.form.client"), value: clientName },
    {
      caption: t("clientRequests.details.fieldFinancialResponsible"),
      value: financialResponsibleName,
    },
    {
      caption: t("clientRequests.table.requestDate"),
      value: requestDateLabel,
    },
    {
      caption: t("clientRequests.table.serialNumber"),
      value: row.serial_number || tInbox("emptyDash"),
    },
    {
      caption: t("clientRequests.table.requestStatus"),
      value: statusLabel,
    },
    {
      caption: t("clientRequests.details.fieldServicesCount"),
      value: String(servicesCount),
    },
    {
      caption: t("clientRequests.details.cardCountsAttachments"),
      value: String(attachmentsCount),
    },
  ];

  const attachmentLinks: InboxRequestAttachmentLink[] = (
    row.attachments ?? []
  ).map((a) => ({
    id: a.id,
    href: a.url,
    label: a.name || a.url,
    mimeType: a.mime_type,
    fileName: a.name || undefined,
  }));

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", p: { xs: 2, md: 3 } }}>
      {/* Top bar: back + breadcrumb-style title + last updated */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}
      >
        <IconButton
          aria-label={t("clientRequests.details.backToList")}
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
            {t("clientRequests.plural")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            /
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {typeLabel}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            /
          </Typography>
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {row.serial_number || tInbox("emptyDash")}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {t("clientRequests.details.lastUpdated")}: {lastUpdatedLabel}
        </Typography>
      </Stack>

      {/* Stat cards row */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t("clientRequests.details.cardStatusTitle")}>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
              spacing={1}
            >
              <Chip
                label={statusLabel}
                color={
                  statusVis.color === "default" ? undefined : statusVis.color
                }
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </StatCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t("clientRequests.details.cardClientTitle")}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ width: "100%" }}
            >
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
                {getInitials(row.client?.name)}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  noWrap
                  title={clientName}
                >
                  {clientName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  display="block"
                >
                  {clientTypeLabel(row.client_type, t)}
                </Typography>
              </Box>
            </Stack>
          </StatCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t("clientRequests.details.cardCountsTitle")}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              sx={{ width: "100%" }}
              spacing={2}
            >
              <CountBlock
                value={servicesCount}
                label={t("clientRequests.details.cardCountsServices")}
              />
              <Box
                sx={{
                  width: "1px",
                  alignSelf: "stretch",
                  bgcolor: "divider",
                }}
              />
              <CountBlock
                value={attachmentsCount}
                label={t("clientRequests.details.cardCountsAttachments")}
              />
            </Stack>
          </StatCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={tInbox("approvalPath")}>
            <ApprovalTimeline entries={timelineEntries} />
          </StatCard>
        </Grid>
      </Grid>

      {/* Tabs row (pill-style) */}
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
          aria-label={t("clientRequests.details.tabs.details")}
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
          <Tab label={t("clientRequests.details.tabs.details")} />
          <Tab label={t("clientRequests.details.tabs.attachments")} />
          <Tab label={t("clientRequests.details.tabs.items")} disabled />
          <Tab label={t("clientRequests.details.tabs.actions")} disabled />
        </Tabs>
      </Paper>

      {/* Tab content */}
      {activeTab === 0 ? (
        <Stack spacing={2.5}>
          {/* 4-column field grid */}
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
          >
            <Grid container rowSpacing={3} columnSpacing={2}>
              {detailFields.map((field) => (
                <Grid key={field.caption} size={{ xs: 6, sm: 4, md: 3 }}>
                  <FieldBlock caption={field.caption} value={field.value} />
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Description */}
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
          >
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              {t("clientRequests.details.fieldDescription")}
            </Typography>
            <Typography
              variant="body2"
              color={description ? "text.primary" : "text.secondary"}
              sx={{ whiteSpace: "pre-wrap" }}
            >
              {description || t("clientRequests.details.descriptionEmpty")}
            </Typography>
          </Paper>

          {/* comments + actions */}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2} sx={{ height: "100%" }}>
                <InboxRequestCommentsField
                  sectionTitle={tInbox("comments")}
                  value={commentDraft}
                  onChange={setCommentDraft}
                  placeholder={
                    detailsCanRespond && canUpdateClientRequest
                      ? t("clientRequests.dialog.rejectCausePlaceholder")
                      : tInbox("commentPlaceholder")
                  }
                  disabled={
                    pendingStatusAction ||
                    !detailsCanRespond ||
                    !canUpdateClientRequest
                  }
                />
                {showActions ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ gap: 1 }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleAccept}
                      disabled={pendingStatusAction}
                    >
                      {tInbox("accept")}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReject}
                      disabled={pendingStatusAction}
                    >
                      {tInbox("reject")}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleBack}
                    >
                      {t("clientRequests.inbox.closeDialog")}
                    </Button>
                  </Stack>
                ) : (
                  <Stack direction="row">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleBack}
                    >
                      {t("clientRequests.inbox.closeDialog")}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      ) : null}

      {activeTab === 1 ? (
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            {t("clientRequests.details.tabs.attachments")}
          </Typography>
          {attachmentLinks.length ? (
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
              {attachmentLinks.map((a) => (
                <AttachmentPreviewCard
                  key={String(a.id)}
                  href={a.href}
                  label={a.label}
                  mimeType={a.mimeType}
                  fileName={a.fileName}
                  onView={() => setViewerLink(a)}
                  downloadLabel={tDoc("download")}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {tInbox("emptyDash")}
            </Typography>
          )}
        </Paper>
      ) : null}

      <FileViewerDialog
        open={Boolean(documentForViewer && activeFileForViewer)}
        onClose={() => setViewerLink(null)}
        document={documentForViewer}
        activeFile={activeFileForViewer}
        isIncoming={false}
      />
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
        sx={{
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function CountBlock({ value, label }: { value: number; label: string }) {
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
