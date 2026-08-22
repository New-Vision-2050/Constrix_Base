"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Settings, Download, FileText } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import CustomMenu from "@/components/headless/custom-menu";
import { DocumentRow, DocumentAttachment } from "../types";
import { downloadAttachmentFile } from "../attachmentActions";
import FileViewerDialog from "./FileViewerDialog";
import ApprovalTimeline from "./ApprovalTimeline";
import { AttachmentRequestsApi } from "@/services/api/projects/attachment-requests";
import { ATTACHMENT_REQUESTS_QUERY_KEY } from "@/modules/projects/project/query/useAttachmentRequests";

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

/** After approve/decline the list refetches; hide action buttons for finished states. */
function isTerminalApprovalStatus(raw?: string): boolean {
  const k = (raw ?? "").trim().toLowerCase().replace(/-/g, "_");
  return k === "approved" || k === "rejected" || k === "declined";
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
    case "declined":
      return t("declined");
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
  canApproveWithNotes,
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
  canApproveWithNotes?: boolean;
}) {
  const statusDisplay = approvalStatusLabel(document.approvalStatus, t);
  const submissionDisplay = formatDisplayDate(document.submissionDate);
  const descriptionBody = document.description?.trim() || document.name || "—";
  const typeDisplay =
    document.documentType?.trim() || t("requestTypeAttachment");

  const runApprove = () => onApprove?.();
  const runReject = () => onReject?.();
  const runModification = () => onRequestModification?.();

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
                  hideActionsMenu={variant === "outgoing"}
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
        {document.canTakeAction ? (
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
              disabled={!canApproveWithNotes || actionPending}
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
  const steps = document.approvalPath ?? [];

  return (
    <Stack spacing={3} sx={{ height: "100%" }}>
      <Box>
        <Paper
          key={document.id}
          variant="outlined"
          sx={{ ...cardSx, p: 2 }}
        >
          {steps.length > 0 ? (
            <ApprovalTimeline steps={steps} />
          ) : (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                {t("approvalPath")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            </>
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
  onApprove: onApproveProp,
  onReject: onRejectProp,
  onRequestModification,
  actionPending: actionPendingProp = false,
}: AttachmentRequestDetailDialogProps) {
  const t = useTranslations("project.documentCycle");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const queryClient = useQueryClient();

  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<DocumentAttachment | null>(null);
  const [localDocument, setLocalDocument] = useState<DocumentRow | null>(null);
  const [itemsWithSavedNotes, setItemsWithSavedNotes] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    if (document) {
      setLocalDocument(document);
    }
  }, [document]);

  useEffect(() => {
    if (!open) {
      setItemsWithSavedNotes(new Set());
    }
  }, [open]);

  useEffect(() => {
    setItemsWithSavedNotes(new Set());
  }, [document?.id]);

  const approveWithNotesMutation = useMutation({
    mutationFn: async (itemIds: string[]) => {
      for (const item_id of itemIds) {
        await AttachmentRequestsApi.respondToItem({
          item_id,
          action: "approve",
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ATTACHMENT_REQUESTS_QUERY_KEY],
      });
      toast.success(t("approveWithNotesSuccess"));
      setItemsWithSavedNotes(new Set());
      onClose();
    },
    onError: (error: unknown) => {
      const msg = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      toast.error(msg?.trim() ? msg : t("approveWithNotesError"));
    },
  });

  const handleAnnotationsSaved = (itemId: string) => {
    setItemsWithSavedNotes((prev) => new Set(prev).add(itemId));
  };

  const handleFileUpdated = (file: DocumentAttachment) => {
    setActiveFile(file);
    setLocalDocument((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        attachments: prev.attachments?.map((attachment) =>
          attachment.id === file.id ? file : attachment,
        ),
      };
    });
  };

  const handleApproveWithNotes = () => {
    if (onRequestModification) {
      onRequestModification();
      return;
    }
    if (itemsWithSavedNotes.size === 0 || !document) return;
    approveWithNotesMutation.mutate([...itemsWithSavedNotes]);
  };

  const canApproveWithNotes = itemsWithSavedNotes.size > 0;

  const approveMutation = useMutation({
    mutationFn: (requestId: string) =>
      AttachmentRequestsApi.approveRequest(requestId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ATTACHMENT_REQUESTS_QUERY_KEY],
      });
      toast.success(t("requestApproveSuccess"));
    },
    onError: (error: unknown) => {
      const msg = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      toast.error(msg?.trim() ? msg : t("requestApproveError"));
    },
  });

  const declineMutation = useMutation({
    mutationFn: (requestId: string) =>
      AttachmentRequestsApi.declineRequest(requestId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ATTACHMENT_REQUESTS_QUERY_KEY],
      });
      toast.success(t("requestDeclineSuccess"));
    },
    onError: (error: unknown) => {
      const msg = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      toast.error(msg?.trim() ? msg : t("requestDeclineError"));
    },
  });

  const handleApprove = () => {
    if (onApproveProp) {
      onApproveProp();
      return;
    }
    if (!document) return;
    approveMutation.mutate(document.id);
  };

  const handleReject = () => {
    if (onRejectProp) {
      onRejectProp();
      return;
    }
    if (!document) return;
    declineMutation.mutate(document.id);
  };

  const actionPending =
    actionPendingProp ||
    approveMutation.isPending ||
    declineMutation.isPending ||
    approveWithNotesMutation.isPending;

  if (!document || !localDocument) return null;

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
        disableEnforceFocus={fileViewerOpen}
        disableAutoFocus={fileViewerOpen}
        disableRestoreFocus={fileViewerOpen}
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
                document={localDocument}
                t={t}
                isRTL={isRTL}
                onFileView={handleFileClick}
                onClose={onClose}
                variant={variant}
                actionPending={actionPending}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestModification={handleApproveWithNotes}
                canApproveWithNotes={canApproveWithNotes}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3.5 }}>
              <DetailSidebar document={localDocument} t={t} />
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
        document={localDocument}
        activeFile={activeFile}
        isIncoming={variant === "incoming"}
        onAnnotationsSaved={handleAnnotationsSaved}
        onFileUpdated={handleFileUpdated}
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
  hideActionsMenu,
}: {
  file: DocumentAttachment;
  isRTL: boolean;
  onView: () => void;
  editLabel: string;
  deleteLabel: string;
  downloadLabel: string;
  /** Outgoing (صادر): no edit/delete menu — view & download only */
  hideActionsMenu?: boolean;
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
        {!hideActionsMenu && (
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
        )}
      </Box>
    </Paper>
  );
}
