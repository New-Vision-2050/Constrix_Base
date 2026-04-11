"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  CircularProgress,
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
import { DocumentRow, DocumentAttachment } from "../types";
import {
  createAuthenticatedPreviewUrl,
  downloadAttachmentFile,
  getFilePreviewKind,
} from "../attachmentActions";

interface FileViewerDialogProps {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
  activeFile: DocumentAttachment | null;
  isIncoming: boolean;
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
      queryClient.invalidateQueries({ queryKey: ["attachment-requests"] });
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
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (!open || !activeFile?.url) {
      setPreviewSrc(null);
      setPreviewLoading(false);
      setPreviewError(false);
      return;
    }

    const kind = getFilePreviewKind(activeFile);
    if (kind !== "pdf" && kind !== "image") {
      setPreviewSrc(null);
      setPreviewLoading(false);
      setPreviewError(false);
      return;
    }

    // The user's system works fine when embedding the URL directly (as seen in publicDocs DocViewDialog).
    // Bypassing XHR blob fetch avoids CORS/Interceptor issues that cause "1 error".
    setPreviewSrc(activeFile.url);
    setPreviewLoading(false);
    setPreviewError(false);

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
                    bgcolor: "grey.100",
                    borderRadius: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    الخطة الاستراتيجية السنوية 2024
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    تم الإرسال: 20 كانون 2023
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
                      أ
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        أحمد علي
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        مدير قسم الاستراتيجية
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
                          color: "white",
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      boxShadow: 2,
                      transition: "width 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {previewKind === "pdf" && activeFile.url ? (
                      <>
                        {previewLoading ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 400,
                              width: "100%",
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        ) : null}
                        {previewError && !previewLoading ? (
                          <Box sx={{ p: 4, textAlign: "center" }}>
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ mb: 2 }}
                            >
                              {t("previewLoadError")}
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
                              {t("openInNewTab")}
                            </Button>
                          </Box>
                        ) : null}
                        {!previewLoading && !previewError && previewSrc ? (
                          <Box
                            component="iframe"
                            src={previewSrc}
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
                      </>
                    ) : null}
                    {previewKind === "image" && activeFile.url ? (
                      <>
                        {previewLoading ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 280,
                              width: "100%",
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        ) : null}
                        {previewError && !previewLoading ? (
                          <Box sx={{ p: 4, textAlign: "center" }}>
                            <Typography
                              variant="body2"
                              color="error"
                              sx={{ mb: 2 }}
                            >
                              {t("previewLoadError")}
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
                              {t("openInNewTab")}
                            </Button>
                          </Box>
                        ) : null}
                        {!previewLoading && !previewError && previewSrc ? (
                          <Box
                            component="img"
                            src={previewSrc}
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
                      </>
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
