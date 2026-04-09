"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Settings, Download, FileText, Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import CustomMenu from "@/components/headless/custom-menu";
import {
  DocumentRow,
  DocumentAttachment,
  ApprovalStep,
  DocumentHistoryEntry,
} from "../types";
import { downloadAttachmentFile } from "../attachmentActions";
import FileViewerDialog from "./FileViewerDialog";

const cardSx = {
  p: 1.5,
  borderRadius: 2,
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider",
} as const;

function formatDisplayDate(value?: string): string {
  if (!value?.trim()) return "—";
  const s = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString();
}

function normalizeHistoryAction(action: string): string {
  return action.trim().toLowerCase().replace(/-/g, "_");
}

function historyActionLabel(
  action: string,
  t: (key: string) => string,
): string {
  switch (normalizeHistoryAction(action)) {
    case "request_created":
      return t("historyActionRequestCreated");
    case "request_approved":
      return t("historyActionRequestApproved");
    case "request_declined":
      return t("historyActionRequestDeclined");
    case "request_update":
      return t("historyActionRequestUpdate");
    default:
      return action.trim() || "—";
  }
}

function historyActionChipColor(
  action: string,
): "primary" | "success" | "error" | "warning" | "default" {
  switch (normalizeHistoryAction(action)) {
    case "request_approved":
      return "success";
    case "request_declined":
      return "error";
    case "request_created":
      return "primary";
    case "request_update":
      return "warning";
    default:
      return "default";
  }
}

function historyStepIconPaletteKey(
  action: string,
):
  | "primary.main"
  | "success.main"
  | "error.main"
  | "warning.main"
  | "grey.500" {
  switch (normalizeHistoryAction(action)) {
    case "request_approved":
      return "success.main";
    case "request_declined":
      return "error.main";
    case "request_created":
      return "primary.main";
    case "request_update":
      return "warning.main";
    default:
      return "grey.500";
  }
}

function HistoryApprovalStepper({
  history,
  t,
}: {
  history: DocumentHistoryEntry[];
  t: (key: string) => string;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {history.map((entry, index) => {
        const bg = historyStepIconPaletteKey(entry.action);
        return (
          <Box
            key={entry.id}
            sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "common.white",
                }}
              >
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </Box>
              {index < history.length - 1 ? (
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    minHeight: 28,
                    bgcolor: "divider",
                    my: 0.5,
                  }}
                />
              ) : null}
            </Box>
            <Box
              sx={{
                pb: index < history.length - 1 ? 1.5 : 0,
                minWidth: 0,
                flex: 1,
                textAlign: "start",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {entry.description}
              </Typography>
              <Chip
                size="small"
                label={historyActionLabel(entry.action, t)}
                color={historyActionChipColor(entry.action)}
                variant="outlined"
                sx={{ mt: 0.75, fontWeight: 600 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 0.75 }}
              >
                {entry.userName?.trim() ? entry.userName : "—"}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

function approvalStatusLabel(
  raw: string | undefined,
  t: (key: string) => string,
): string {
  const k = (raw ?? "").trim().toLowerCase();
  switch (k) {
    case "pending":
      return t("pending");
    case "approved":
      return t("approved");
    case "rejected":
      return t("rejected");
    case "semi-approved":
      return t("partiallyApproved");
    default:
      return raw?.trim() || "—";
  }
}

function DetailMain({
  document,
  t,
  isRTL,
  onFileView,
  onClose,
  variant,
  actionPending,
  onApprove,
  onReject,
  onRequestModification,
}: {
  document: DocumentRow;
  t: (key: string) => string;
  isRTL: boolean;
  onFileView: (file: DocumentAttachment) => void;
  onClose: () => void;
  variant: "outgoing" | "incoming";
  actionPending?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestModification?: () => void;
}) {
  const statusDisplay = approvalStatusLabel(document.approvalStatus, t);
  const submissionDisplay = formatDisplayDate(document.submissionDate);
  const descriptionBody = document.description?.trim() || document.name || "—";
  const typeDisplay =
    document.documentType?.trim() || (variant === "outgoing" ? "مرفق" : "—");

  const runApprove = () => (onApprove ?? onClose)();
  const runReject = () => (onReject ?? onClose)();
  const runModification = () => (onRequestModification ?? onClose)();

  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={cardSx}>
            <Typography variant="caption" color="text.primary" display="block">
              {t("type")}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {typeDisplay}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={cardSx}>
            <Typography variant="caption" color="text.primary" display="block">
              {t("approvalStatus")}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {statusDisplay}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={cardSx}>
            <Typography variant="caption" color="text.primary" display="block">
              {t("submissionDate")}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {submissionDisplay}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary" display="block">
        {t("fileSize")}: {document.fileSize} · {t("documentCount")}:{" "}
        {document.documentCount} · {t("lastActivity")}:{" "}
        {formatDisplayDate(document.lastActivityDate)}
        {document.lastActivityUser && document.lastActivityUser !== "—"
          ? ` (${document.lastActivityUser})`
          : ""}
      </Typography>

      <Box>
        <Paper variant="outlined" sx={{ ...cardSx, p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {t("description")}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {descriptionBody}
          </Typography>
        </Paper>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {t("attachments")}
        </Typography>
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
          {document.attachments && document.attachments.length > 0 ? (
            document.attachments.map((file) => (
              <Box key={file.id} sx={{ minWidth: 0 }}>
                <AttachmentCard
                  file={file}
                  isRTL={isRTL}
                  onView={() => onFileView(file)}
                  editLabel={t("edit")}
                  deleteLabel={t("delete")}
                  downloadLabel={t("download")}
                />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          )}
        </Box>
      </Box>

      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="flex-start"
        sx={{ pt: 1, gap: 1 }}
      >
        {variant === "incoming" ? (
          <>
            <Button
              variant="contained"
              color="primary"
              disabled={actionPending}
              onClick={runApprove}
            >
              {t("approve")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={actionPending}
              onClick={runModification}
            >
              {t("requestModification")}
            </Button>
            <Button
              variant="outlined"
              color="error"
              disabled={actionPending}
              onClick={runReject}
            >
              {t("reject")}
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" onClick={onClose}>
            {t("close")}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

function DetailSidebar({
  document,
  t,
}: {
  document: DocumentRow;
  t: (key: string) => string;
}) {
  const creator = document.lastActivityUser?.trim();
  const hasPath = document.approvalPath && document.approvalPath.length > 0;
  const hasHistory = document.history && document.history.length > 0;

  return (
    <Stack spacing={3} sx={{ height: "100%" }}>
      <Box>
        <Paper variant="outlined" sx={{ ...cardSx, p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            {t("approvalPath")}
          </Typography>
          {hasHistory ? (
            <HistoryApprovalStepper history={document.history!} t={t} />
          ) : hasPath ? (
            <ApprovalTimeline steps={document.approvalPath!} />
          ) : (
            <Stepper activeStep={0} orientation="vertical">
              <Step completed>
                <StepLabel
                  optional={
                    <Typography variant="caption" color="text.secondary">
                      {creator && creator !== "—" ? creator : "—"}
                    </Typography>
                  }
                >
                  {t("submission")}
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>{t("initialReview")}</StepLabel>
              </Step>
              <Step>
                <StepLabel>{t("technicalApproval")}</StepLabel>
              </Step>
              <Step>
                <StepLabel>{t("commercialApproval")}</StepLabel>
              </Step>
            </Stepper>
          )}
        </Paper>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {t("comments")}
        </Typography>
        <Paper variant="outlined" sx={{ ...cardSx, p: 2 }}>
          {document.comments && document.comments.length > 0 ? (
            <Stack spacing={2}>
              {document.comments.map((comment) => (
                <Box key={comment.id}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {comment.user}
                    {comment.date ? ` · ${comment.date}` : ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
                  >
                    {comment.content}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          )}
        </Paper>
      </Box>
    </Stack>
  );
}

export interface AttachmentRequestDetailDialogProps {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
  variant: "outgoing" | "incoming";
  /** Incoming: optional; defaults to `onClose` when omitted. */
  onApprove?: () => void;
  onReject?: () => void;
  onRequestModification?: () => void;
  actionPending?: boolean;
}

export default function AttachmentRequestDetailDialog({
  open,
  onClose,
  document,
  variant,
  onApprove,
  onReject,
  onRequestModification,
  actionPending = false,
}: AttachmentRequestDetailDialogProps) {
  const t = useTranslations("project.documentCycle");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<DocumentAttachment | null>(null);

  if (!document) return null;

  const handleFileClick = (file: DocumentAttachment) => {
    setActiveFile(file);
    setFileViewerOpen(true);
  };

  const subtitleParts = [
    document.project?.name,
    document.project?.serial_number,
    document.serialNumber,
  ].filter((x) => Boolean(x && String(x).trim()));
  const dialogSubtitle =
    subtitleParts.length > 0
      ? subtitleParts.join(" · ")
      : variant === "incoming"
        ? t("incomingAttachments")
        : t("outgoingAttachments");

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              backgroundImage: "none",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            pr: 1,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="span" fontWeight={700}>
              {document.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {dialogSubtitle}
            </Typography>
          </Box>
          <IconButton aria-label={t("close")} onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8.5 }}>
              <DetailMain
                document={document}
                t={t}
                isRTL={isRTL}
                onFileView={handleFileClick}
                onClose={onClose}
                variant={variant}
                actionPending={actionPending}
                onApprove={onApprove}
                onReject={onReject}
                onRequestModification={onRequestModification}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3.5 }}>
              <DetailSidebar document={document} t={t} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <FileViewerDialog
        open={fileViewerOpen}
        onClose={() => {
          setFileViewerOpen(false);
          setActiveFile(null);
        }}
        document={document}
        activeFile={activeFile}
        isIncoming={variant === "incoming"}
      />
    </>
  );
}

function AttachmentCard({
  file,
  isRTL,
  onView,
  editLabel,
  deleteLabel,
  downloadLabel,
}: {
  file: DocumentAttachment;
  isRTL: boolean;
  onView: () => void;
  editLabel: string;
  deleteLabel: string;
  downloadLabel: string;
}) {
  return (
    <Paper
      variant="outlined"
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView();
        }
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 1,
        flexDirection: isRTL ? "row" : "row-reverse",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          bgcolor: "action.hover",
          border: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <FileText className="w-5 h-5" style={{ opacity: 0.7 }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, textAlign: "start" }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          noWrap
          title={file.name}
        >
          {file.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          noWrap
        >
          {file.size || file.type || "—"}
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", gap: 0.5, alignItems: "center", flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <IconButton
          size="small"
          aria-label={downloadLabel}
          onClick={(e) => {
            e.stopPropagation();
            downloadAttachmentFile({ url: file.url, name: file.name });
          }}
        >
          <Download className="w-4 h-4" />
        </IconButton>
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onClick(e);
              }}
            >
              <Settings className="w-4 h-4" />
            </IconButton>
          )}
        >
          <MenuItem onClick={() => {}}>{editLabel}</MenuItem>
          <MenuItem onClick={() => {}}>{deleteLabel}</MenuItem>
        </CustomMenu>
      </Box>
    </Paper>
  );
}

function ApprovalTimeline({ steps }: { steps: ApprovalStep[] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {steps.map((step, index) => (
        <Box
          key={step.id}
          sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor:
                  step.status === "completed"
                    ? "success.main"
                    : step.status === "current"
                      ? "primary.main"
                      : "action.disabledBackground",
                flexShrink: 0,
              }}
            >
              {step.status === "completed" ? (
                <Check className="w-3 h-3" color="#fff" />
              ) : (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor:
                      step.status === "current"
                        ? "common.white"
                        : "text.disabled",
                  }}
                />
              )}
            </Box>
            {index < steps.length - 1 && (
              <Box
                sx={{
                  width: 2,
                  flex: 1,
                  minHeight: 28,
                  bgcolor:
                    step.status === "completed" ? "success.light" : "divider",
                  my: 0.5,
                }}
              />
            )}
          </Box>

          <Box
            sx={{ pb: index < steps.length - 1 ? 1.5 : 0, textAlign: "start" }}
          >
            <Typography
              variant="body2"
              fontWeight={step.status === "current" ? 700 : 500}
              color={
                step.status === "current" ? "text.primary" : "text.secondary"
              }
            >
              {step.title}
            </Typography>
            {(step.user || step.date) && (
              <>
                {step.user && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {step.user}
                  </Typography>
                )}
                {step.date && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {step.date}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
