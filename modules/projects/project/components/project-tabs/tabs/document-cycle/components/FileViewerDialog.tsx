"use client";

/**
 * Apryse WebViewer integration is temporarily disabled — see the commented block
 * at the bottom of this file (and `./ApryseWebViewer.tsx`) for the previous
 * implementation. This file currently restores the prior iframe/img preview.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
} from "@mui/material";
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Bold,
  Italic,
  List,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  getFilePreviewKind,
} from "../attachmentActions";

// ─── Apryse imports (disabled) ──────────────────────────────────────────────
// import { useCallback, useRef } from "react";
// import { CircularProgress } from "@mui/material";
// import { Save } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   fetchAuthenticatedFileBuffer,
//   requiresWebViewerServerForPreview,
//   resolveWebViewerExtension,
// } from "../attachmentActions";
// import {
//   ApryseWebViewer,
//   type ApryseWebViewerHandle,
// } from "./ApryseWebViewer";

// export type SaveAnnotatedDocumentPayload = {
//   blob: Blob;
//   itemId: string;
//   fileName: string;
// };

const getInitials = (name: string | null | undefined) => {
  if (!name) return "";
  const parts = name.toUpperCase().trim().split(/\s+/);
  if (parts.length > 1) {
    return parts[0][0] + "\u200C" + parts[parts.length - 1][0];
  }
  return parts[0][0];
};

interface FileViewerDialogProps {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
  activeFile: DocumentAttachment | null;
  isIncoming: boolean;
  /** Kept for backward compatibility with callers from the Apryse era (no-op). */
  onSaveAnnotatedDocument?: (payload: {
    blob: Blob;
    itemId: string;
    fileName: string;
  }) => void | Promise<void>;
}

export default function FileViewerDialog({
  open,
  onClose,
  document,
  activeFile,
  isIncoming,
}: FileViewerDialogProps) {
  const t = useTranslations("project.documentCycle");
  const queryClient = useQueryClient();
  const [zoom, setZoom] = useState(100);
  const [note, setNote] = useState("");

  const respondMutation = useMutation({
    mutationFn: (body: RespondAttachmentItemPayload) =>
      AttachmentRequestsApi.respondToItem(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ATTACHMENT_REQUESTS_QUERY_KEY],
      });
      toast.success(t("itemRespondSuccess"));
      onClose();
    },
    onError: (error: unknown) => {
      const msg = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      toast.error(msg?.trim() ? msg : t("itemRespondError"));
    },
  });

  const previewKind = useMemo(
    () => (activeFile ? getFilePreviewKind(activeFile) : "other"),
    [activeFile],
  );

  useEffect(() => {
    if (activeFile?.id) setZoom(100);
  }, [activeFile?.id]);

  useEffect(() => {
    if (open) setNote("");
  }, [open, activeFile?.id]);

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !activeFile?.url) {
      setPreviewSrc(null);
      return;
    }

    const kind = getFilePreviewKind(activeFile);
    if (kind !== "pdf" && kind !== "image") {
      setPreviewSrc(null);
      return;
    }

    // If we are on HTTPS, ensure the URL is also HTTPS to avoid Mixed Content errors in production.
    let finalUrl = activeFile.url;
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:"
    ) {
      finalUrl = finalUrl.replace(/^http:\/\//i, "https://");
    }

    setPreviewSrc(finalUrl);

    return () => {
      setPreviewSrc(null);
    };
    // Intentionally key off id/url/type/name — not `activeFile` reference — to avoid refetch when parent re-renders with a new object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeFile?.id, activeFile?.url, activeFile?.type, activeFile?.name]);

  if (!document || !activeFile) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25));
  const handleDownload = () =>
    downloadAttachmentFile({ url: activeFile.url, name: activeFile.name });
  const handlePrint = () => window.print();

  const notesPayload = note.trim() || undefined;

  const handleApprove = () => {
    respondMutation.mutate({
      item_id: activeFile.id,
      action: "approve",
      notes: notesPayload,
    });
  };

  const handleReject = () => {
    respondMutation.mutate({
      item_id: activeFile.id,
      action: "decline",
      notes: notesPayload,
    });
  };

  /** No API yet — close only. */
  const handleRequestModification = () => {
    onClose();
  };

  const respondPending = respondMutation.isPending;

  /** Above MUI theme zIndex.modal (1300) so this opens on top of the request detail dialog. */
  const stackedDialogClass = "z-[1600]";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        overlayClassName={stackedDialogClass}
        className={cn(
          "max-w-[95vw] w-[1200px] max-h-[95vh] p-0 overflow-hidden",
          stackedDialogClass,
        )}
      >
        <DialogTitle className="sr-only">
          {[document.name, activeFile.name].filter(Boolean).join(" — ")}
        </DialogTitle>
        <Box sx={{ display: "flex", flexDirection: "column", height: "90vh" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 1.5,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
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

          {/* Body */}
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Right: Document Info Panel */}
            <Box
              sx={{
                width: 350,
                overflowY: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Document Review Section */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  {t("documentReview")}
                </Typography>
                <Box
                  sx={{
                    bgcolor: "background.card",
                    borderRadius: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    border: 1,
                    borderColor: "divider",
                    boxShadow: 1,
                  }}
                >
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

              {/* Previous Notes */}
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

              {/* Add Note */}
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
                    disabled={respondPending}
                  />
                </Box>
              )}

              {/* Action Buttons for Incoming */}
              {isIncoming && document?.approvalStatus !== "approved" && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    pt: 1,
                  }}
                >
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    onClick={handleApprove}
                    disabled={respondPending}
                  >
                    ✓ {t("approve")}
                  </Button>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
                    onClick={handleRequestModification}
                    disabled={true}
                  >
                    ✎ {t("requestModification")}
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                    onClick={handleReject}
                    disabled={respondPending}
                  >
                    ✕ {t("reject")}
                  </Button>
                </Box>
              )}
            </Box>
            {/* Left: File Preview */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderInlineEnd: 1,
                borderColor: "divider",
              }}
            >
              {/* Toolbar */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1,
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                {previewKind !== "pdf" && (
                  <>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="w-4 h-4 me-1" />
                        {t("print")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 me-1" />
                        {t("download")}
                      </Button>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <IconButton size="small" onClick={handleZoomOut}>
                        <ZoomOut className="w-4 h-4" />
                      </IconButton>
                      <Typography variant="body2">{zoom}%</Typography>
                      <IconButton size="small" onClick={handleZoomIn}>
                        <ZoomIn className="w-4 h-4" />
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>

              {/* Preview Area */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  overflow: "auto",
                }}
              >
                {/* Main preview */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: `${zoom}%`,
                      maxWidth: "100%",
                      minHeight: 360,
                      bgcolor: "background.card",
                      borderRadius: 1,
                      border: 1,
                      borderColor: "divider",
                      boxShadow: 2,
                      transition: "width 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {previewKind === "pdf" && activeFile.url ? (
                      <Box
                        component="iframe"
                        src={previewSrc || activeFile.url}
                        title={activeFile.name}
                        sx={{
                          width: "100%",
                          height: "min(70vh, 720px)",
                          minHeight: 400,
                          border: 0,
                          display: "block",
                        }}
                      />
                    ) : null}
                    {previewKind === "image" && activeFile.url ? (
                      <Box
                        component="img"
                        src={previewSrc || activeFile.url}
                        alt={activeFile.name}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "70vh",
                          width: "auto",
                          height: "auto",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    ) : null}
                    {previewKind === "other" ? (
                      <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {t("filePreview")}: {activeFile.name}
                        </Typography>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              activeFile.url,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                        >
                          {t("download")}
                        </Button>
                      </Box>
                    ) : null}
                  </Box>
                </Box>

                {/* Thumbnails sidebar */}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * APRYSE WEBVIEWER IMPLEMENTATION (DISABLED)
 *
 * The block below is the previous Apryse-based viewer (annotations + save).
 * It is kept here as a reference so we can re-enable it later. To restore:
 *   1) Re-add the Apryse imports at the top of this file.
 *   2) Replace the iframe-based component above with the implementation below.
 *   3) Re-export `SaveAnnotatedDocumentPayload`.
 *   4) Restore `apryseRef`, the save mutation, and the `Save` action button.
 *
 * ----------------------------------------------------------------------------
 *
 * export type SaveAnnotatedDocumentPayload = {
 *   blob: Blob;
 *   itemId: string;
 *   fileName: string;
 * };
 *
 * function fileNameForReplaceUpload(originalName: string, blob: Blob): string {
 *   const trimmed = originalName.trim();
 *   const base =
 *     trimmed && trimmed.includes(".")
 *       ? trimmed.replace(/\.[^/.]+$/, "")
 *       : trimmed || "document";
 *   if (
 *     blob.type === "application/pdf" &&
 *     !trimmed.toLowerCase().endsWith(".pdf")
 *   ) {
 *     return `${base}.pdf`;
 *   }
 *   if (!trimmed) {
 *     return blob.type === "application/pdf" ? `${base}.pdf` : `${base}.bin`;
 *   }
 *   return trimmed;
 * }
 *
 * function isApprovedStatus(approvalStatus: string | undefined): boolean {
 *   return approvalStatus?.trim().toLowerCase() === "approved";
 * }
 *
 * function axiosErrorMessage(error: unknown): string | undefined {
 *   if (!isAxiosError(error)) return undefined;
 *   return (error.response?.data as { message?: string } | undefined)?.message;
 * }
 *
 * type ViewerBufferState = {
 *   extension: string;
 *   serverOnlyCad: boolean;
 *   buffer: ArrayBuffer | null;
 *   isBufferLoading: boolean;
 *   fetchError: string | null;
 *   canExport: boolean;
 *   onViewerReady: () => void;
 *   viewerInstanceKey: string;
 * };
 *
 * function useViewerBufferState(
 *   open: boolean,
 *   activeFile: DocumentAttachment | null,
 * ): ViewerBufferState {
 *   const extension = useMemo(
 *     () => (activeFile ? resolveWebViewerExtension(activeFile) : "pdf"),
 *     [activeFile],
 *   );
 *
 *   const serverOnlyCad = requiresWebViewerServerForPreview(extension);
 *
 *   const query = useQuery({
 *     queryKey: ["file-viewer-buffer", activeFile?.id, activeFile?.url] as const,
 *     queryFn: () => fetchAuthenticatedFileBuffer(activeFile!.url),
 *     enabled: Boolean(open && activeFile?.url && !serverOnlyCad),
 *     staleTime: 0,
 *   });
 *
 *   const [apryseReady, setApryseReady] = useState(false);
 *
 *   useEffect(() => {
 *     setApryseReady(false);
 *   }, [query.data, activeFile?.id, extension]);
 *
 *   const buffer = query.data ?? null;
 *   const fetchError = query.isError
 *     ? query.error instanceof Error
 *       ? query.error.message
 *       : String(query.error)
 *     : null;
 *
 *   const isBufferLoading = Boolean(
 *     open && activeFile?.url && !serverOnlyCad && query.isPending,
 *   );
 *
 *   const canExport = Boolean(
 *     !serverOnlyCad &&
 *       query.isSuccess &&
 *       buffer &&
 *       !query.isError &&
 *       !query.isFetching &&
 *       apryseReady,
 *   );
 *
 *   const viewerInstanceKey = `${activeFile?.id ?? "none"}-${extension}`;
 *
 *   const onViewerReady = useCallback(() => {
 *     setApryseReady(true);
 *   }, []);
 *
 *   return {
 *     extension,
 *     serverOnlyCad,
 *     buffer,
 *     isBufferLoading,
 *     fetchError,
 *     canExport,
 *     onViewerReady,
 *     viewerInstanceKey,
 *   };
 * }
 *
 * // Inside the component:
 * //   const apryseRef = useRef<ApryseWebViewerHandle>(null);
 * //   const [savePending, setSavePending] = useState(false);
 * //   const viewer = useViewerBufferState(open, activeFile);
 * //
 * //   const replaceMediaMutation = useMutation({
 * //     mutationFn: (body: { item_id: string; new_file: File }) =>
 * //       AttachmentRequestsApi.replaceItemMedia(body),
 * //   });
 * //
 * //   const handleSaveAnnotatedDocument = useCallback(async () => {
 * //     if (!activeFile || !viewer.canExport || !apryseRef.current) return;
 * //     setSavePending(true);
 * //     try {
 * //       const blob = await apryseRef.current.exportDocumentWithAnnotations();
 * //       const uploadName = fileNameForReplaceUpload(activeFile.name, blob);
 * //       const payload: SaveAnnotatedDocumentPayload = {
 * //         blob,
 * //         itemId: activeFile.id,
 * //         fileName: uploadName,
 * //       };
 * //       if (onSaveAnnotatedDocument) {
 * //         await onSaveAnnotatedDocument(payload);
 * //       } else {
 * //         const file = new File([blob], uploadName, { type: blob.type });
 * //         await replaceMediaMutation.mutateAsync({
 * //           item_id: activeFile.id,
 * //           new_file: file,
 * //         });
 * //         queryClient.invalidateQueries({
 * //           queryKey: [ATTACHMENT_REQUESTS_QUERY_KEY],
 * //         });
 * //         toast.success(t("saveViewerChangesSuccess"));
 * //         onClose();
 * //       }
 * //     } catch (e: unknown) {
 * //       toast.error(
 * //         axiosErrorMessage(e)?.trim() ||
 * //           (e instanceof Error ? e.message : String(e)) ||
 * //           t("saveViewerChangesError"),
 * //       );
 * //     } finally {
 * //       setSavePending(false);
 * //     }
 * //   }, [
 * //     activeFile,
 * //     viewer.canExport,
 * //     onSaveAnnotatedDocument,
 * //     replaceMediaMutation,
 * //     queryClient,
 * //     t,
 * //     onClose,
 * //   ]);
 * //
 * //   // Preview area:
 * //   {viewer.buffer && !viewer.fetchError && !viewer.serverOnlyCad && (
 * //     <ApryseWebViewer
 * //       ref={apryseRef}
 * //       key={viewer.viewerInstanceKey}
 * //       documentBuffer={viewer.buffer}
 * //       extension={viewer.extension}
 * //       fileName={activeFile.name}
 * //       onViewerReady={viewer.onViewerReady}
 * //     />
 * //   )}
 * ─────────────────────────────────────────────────────────────────────────── */
