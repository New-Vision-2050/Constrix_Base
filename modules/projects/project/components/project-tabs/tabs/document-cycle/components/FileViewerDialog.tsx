"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  CircularProgress,
} from "@mui/material";
import { X, Download, Printer, Bold, Italic, List, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AttachmentRequestsApi } from "@/services/api/projects/attachment-requests";
import type { RespondAttachmentItemPayload } from "@/services/api/projects/attachment-requests/types/params";
import { ATTACHMENT_REQUESTS_QUERY_KEY } from "@/modules/projects/project/query/useAttachmentRequests";
import { DocumentRow, DocumentAttachment } from "../types";
import {
  downloadAttachmentFile,
  fetchAuthenticatedFileBuffer,
  requiresWebViewerServerForPreview,
  resolveWebViewerExtension,
} from "../attachmentActions";
import {
  ApryseWebViewer,
  type ApryseWebViewerHandle,
} from "./ApryseWebViewer";

export type SaveAnnotatedDocumentPayload = {
  blob: Blob;
  itemId: string;
  fileName: string;
};

function fileNameForReplaceUpload(originalName: string, blob: Blob): string {
  const trimmed = originalName.trim();
  const base =
    trimmed && trimmed.includes(".")
      ? trimmed.replace(/\.[^/.]+$/, "")
      : trimmed || "document";
  if (
    blob.type === "application/pdf" &&
    !trimmed.toLowerCase().endsWith(".pdf")
  ) {
    return `${base}.pdf`;
  }
  if (!trimmed) {
    return blob.type === "application/pdf" ? `${base}.pdf` : `${base}.bin`;
  }
  return trimmed;
}

function getInitials(name: string | null | undefined) {
  if (!name) return "";
  const parts = name.toUpperCase().trim().split(/\s+/);
  if (parts.length > 1) {
    return parts[0][0] + "\u200C" + parts[parts.length - 1][0];
  }
  return parts[0][0];
}

function isApprovedStatus(approvalStatus: string | undefined): boolean {
  return approvalStatus?.trim().toLowerCase() === "approved";
}

function axiosErrorMessage(error: unknown): string | undefined {
  if (!isAxiosError(error)) return undefined;
  return (error.response?.data as { message?: string } | undefined)?.message;
}

const STACKED_Z = "z-[1600]";

/** Layout / look — unchanged from previous implementation */
const layout = {
  rootColumn: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 3,
    py: 1.5,
    borderBottom: 1,
    borderColor: "divider",
  },
  bodyRow: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    width: 350,
    overflowY: "auto",
    p: 3,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  reviewCard: {
    bgcolor: "background.card",
    borderRadius: 1,
    p: 2,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    border: 1,
    borderColor: "divider",
    boxShadow: 1,
  },
  previewColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderInlineEnd: 1,
    borderColor: "divider",
    minHeight: 0,
  },
  previewToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: 2,
    py: 1,
    borderBottom: 1,
    borderColor: "divider",
    minHeight: 48,
  },
  previewStage: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    minHeight: 0,
    position: "relative",
  },
  previewInner: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    minWidth: 0,
    minHeight: 0,
  },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  apryseHost: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
} as const;

type FileViewerDialogProps = {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
  activeFile: DocumentAttachment | null;
  isIncoming: boolean;
  onSaveAnnotatedDocument?: (
    payload: SaveAnnotatedDocumentPayload,
  ) => void | Promise<void>;
};

type ViewerBufferState = {
  extension: string;
  /** DWG/DXF/etc. — client WebViewer cannot preview; offer download only */
  serverOnlyCad: boolean;
  buffer: ArrayBuffer | null;
  isBufferLoading: boolean;
  fetchError: string | null;
  canExport: boolean;
  onViewerReady: () => void;
  viewerInstanceKey: string;
};

/**
 * Loads file bytes and tracks Apryse readiness. Single place for preview-related state.
 */
function useViewerBufferState(
  open: boolean,
  activeFile: DocumentAttachment | null,
): ViewerBufferState {
  const extension = useMemo(
    () => (activeFile ? resolveWebViewerExtension(activeFile) : "pdf"),
    [activeFile],
  );

  const serverOnlyCad = requiresWebViewerServerForPreview(extension);

  const query = useQuery({
    queryKey: ["file-viewer-buffer", activeFile?.id, activeFile?.url] as const,
    queryFn: () => fetchAuthenticatedFileBuffer(activeFile!.url),
    enabled: Boolean(open && activeFile?.url && !serverOnlyCad),
    staleTime: 0,
  });

  const [apryseReady, setApryseReady] = useState(false);

  useEffect(() => {
    setApryseReady(false);
  }, [query.data, activeFile?.id, extension]);

  const buffer = query.data ?? null;
  const fetchError = query.isError
    ? query.error instanceof Error
      ? query.error.message
      : String(query.error)
    : null;

  const isBufferLoading = Boolean(
    open && activeFile?.url && !serverOnlyCad && query.isPending,
  );

  const canExport = Boolean(
    !serverOnlyCad &&
      query.isSuccess &&
      buffer &&
      !query.isError &&
      !query.isFetching &&
      apryseReady,
  );

  const viewerInstanceKey = `${activeFile?.id ?? "none"}-${extension}`;

  const onViewerReady = useCallback(() => {
    setApryseReady(true);
  }, []);

  return {
    extension,
    serverOnlyCad,
    buffer,
    isBufferLoading,
    fetchError,
    canExport,
    onViewerReady,
    viewerInstanceKey,
  };
}

export default function FileViewerDialog({
  open,
  onClose,
  document,
  activeFile,
  isIncoming,
  onSaveAnnotatedDocument,
}: FileViewerDialogProps) {
  const t = useTranslations("project.documentCycle");
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");

  const apryseRef = useRef<ApryseWebViewerHandle>(null);
  const [savePending, setSavePending] = useState(false);

  const viewer = useViewerBufferState(open, activeFile);

  useEffect(() => {
    if (open) setNote("");
  }, [open, activeFile?.id]);

  const respondMutation = useMutation({
    mutationFn: (body: RespondAttachmentItemPayload) =>
      AttachmentRequestsApi.respondToItem(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTACHMENT_REQUESTS_QUERY_KEY] });
      toast.success(t("itemRespondSuccess"));
      onClose();
    },
    onError: (error: unknown) => {
      toast.error(
        axiosErrorMessage(error)?.trim() || t("itemRespondError"),
      );
    },
  });

  const replaceMediaMutation = useMutation({
    mutationFn: (body: { item_id: string; new_file: File }) =>
      AttachmentRequestsApi.replaceItemMedia(body),
  });

  const respondBusy = respondMutation.isPending;
  const replaceBusy = replaceMediaMutation.isPending;
  const saveExportBusy =
    savePending || replaceBusy;

  const handleDownload = useCallback(() => {
    if (!activeFile) return;
    downloadAttachmentFile({ url: activeFile.url, name: activeFile.name });
  }, [activeFile]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const notesPayload = note.trim() || undefined;

  const handleApprove = useCallback(() => {
    if (!activeFile) return;
    respondMutation.mutate({
      item_id: activeFile.id,
      action: "approve",
      notes: notesPayload,
    });
  }, [activeFile, notesPayload, respondMutation]);

  const handleReject = useCallback(() => {
    if (!activeFile) return;
    respondMutation.mutate({
      item_id: activeFile.id,
      action: "decline",
      notes: notesPayload,
    });
  }, [activeFile, notesPayload, respondMutation]);

  const handleSaveAnnotatedDocument = useCallback(async () => {
    if (!activeFile || !viewer.canExport || !apryseRef.current) return;
    setSavePending(true);
    try {
      const blob = await apryseRef.current.exportDocumentWithAnnotations();
      const uploadName = fileNameForReplaceUpload(activeFile.name, blob);
      const payload: SaveAnnotatedDocumentPayload = {
        blob,
        itemId: activeFile.id,
        fileName: uploadName,
      };
      if (onSaveAnnotatedDocument) {
        await onSaveAnnotatedDocument(payload);
      } else {
        const file = new File([blob], uploadName, { type: blob.type });
        await replaceMediaMutation.mutateAsync({
          item_id: activeFile.id,
          new_file: file,
        });
        queryClient.invalidateQueries({
          queryKey: [ATTACHMENT_REQUESTS_QUERY_KEY],
        });
        toast.success(t("saveViewerChangesSuccess"));
        onClose();
      }
    } catch (e: unknown) {
      toast.error(
        axiosErrorMessage(e)?.trim() ||
          (e instanceof Error ? e.message : String(e)) ||
          t("saveViewerChangesError"),
      );
    } finally {
      setSavePending(false);
    }
  }, [
    activeFile,
    viewer.canExport,
    onSaveAnnotatedDocument,
    replaceMediaMutation,
    queryClient,
    t,
    onClose,
  ]);

  if (!document || !activeFile) return null;

  const showWorkflow =
    isIncoming && !isApprovedStatus(document.approvalStatus);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        overlayClassName={STACKED_Z}
        className={cn(
          "max-w-[95vw] w-[1200px] max-h-[95vh] p-0 overflow-hidden",
          STACKED_Z,
        )}
      >
        <DialogTitle className="sr-only">
          {[document.name, activeFile.name].filter(Boolean).join(" — ")}
        </DialogTitle>

        <Box sx={layout.rootColumn}>
          <Box sx={layout.headerRow}>
            <Typography variant="h6" fontWeight={600}>
              {document.project?.name ?? document.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                {activeFile.name}
              </Typography>
              <IconButton size="small" onClick={onClose}>
                <X className="w-4 h-4" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={layout.bodyRow}>
            <Box sx={layout.sidebar}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  {t("documentReview")}
                </Typography>
                <Box sx={layout.reviewCard}>
                  <Typography variant="body2" fontWeight={600}>
                    {document.lastActivityUser || "N/A"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {document.name || activeFile.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                      {getInitials(document.lastActivityUser || "N/A")}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {t("type")}:{" "}
                        {document.documentType || t("requestTypeAttachment")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("approvalStatus")}:{" "}
                        {document.approvalStatus || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  {t("previousNotes")}
                </Typography>
                {document.comments?.map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                      {comment.user.charAt(0)}
                    </Avatar>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {comment.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {comment.date}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              {isIncoming && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 1 }}
                  >
                    {t("addNote")}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      mb: 1,
                      borderBottom: 1,
                      borderColor: "divider",
                      pb: 1,
                    }}
                  >
                    <IconButton size="small">
                      <Bold className="w-4 h-4" />
                    </IconButton>
                    <IconButton size="small">
                      <Italic className="w-4 h-4" />
                    </IconButton>
                    <IconButton size="small">
                      <List className="w-4 h-4" />
                    </IconButton>
                  </Box>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder={t("writeNotes")}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    variant="outlined"
                    size="small"
                    disabled={respondBusy}
                  />
                </Box>
              )}
              {showWorkflow && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
                    pt: 0,
                  }}
                >
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    onClick={handleApprove}
                    disabled={respondBusy}
                  >
                    ✓ {t("approve")}
                  </Button>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
                    onClick={handleSaveAnnotatedDocument}
                    disabled={
                      !viewer.canExport ||
                      saveExportBusy ||
                      respondBusy
                    }
                  >
                    <Save className="w-4 h-4 me-1 inline" />
                    {t("save")}
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                    onClick={handleReject}
                    disabled={respondBusy}
                  >
                    ✕ {t("reject")}
                  </Button>
                </Box>
              )}
            </Box>

            <Box sx={layout.previewColumn}>
              <Box sx={layout.previewToolbar}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    disabled={viewer.serverOnlyCad}
                  >
                    <Printer className="w-4 h-4 me-1" />
                    {t("print")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 me-1" />
                    {t("download")}
                  </Button>
                </Box>
              </Box>

              <Box sx={layout.previewStage}>
                <Box sx={layout.previewInner}>
                  {viewer.serverOnlyCad && (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        alignSelf: "center",
                        maxWidth: 520,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ mb: 1.5 }}
                      >
                        {t("cadPreviewUnavailableTitle")}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {t("cadPreviewUnavailableBody")}
                      </Typography>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 me-1" />
                        {t("download")}
                      </Button>
                      <Typography
                        variant="caption"
                        component="p"
                        sx={{ mt: 2, display: "block" }}
                      >
                        <a
                          href="https://docs.apryse.com/documentation/web/guides/wv-server-deployment"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {t("cadPreviewLearnMoreWvs")}
                        </a>
                      </Typography>
                    </Box>
                  )}

                  {viewer.isBufferLoading && !viewer.serverOnlyCad && (
                    <Box sx={layout.loadingOverlay}>
                      <CircularProgress />
                    </Box>
                  )}

                  {viewer.fetchError &&
                    !viewer.isBufferLoading &&
                    !viewer.serverOnlyCad && (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ mb: 2 }}
                      >
                        {viewer.fetchError}
                      </Typography>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 me-1" />
                        {t("download")}
                      </Button>
                    </Box>
                  )}

                  {viewer.buffer &&
                    !viewer.fetchError &&
                    !viewer.serverOnlyCad && (
                    <Box sx={layout.apryseHost}>
                      <ApryseWebViewer
                        ref={apryseRef}
                        key={viewer.viewerInstanceKey}
                        documentBuffer={viewer.buffer}
                        extension={viewer.extension}
                        fileName={activeFile.name}
                        onViewerReady={viewer.onViewerReady}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
