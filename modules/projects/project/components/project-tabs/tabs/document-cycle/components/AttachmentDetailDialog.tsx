"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import { X, FileText } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DocumentRow, DocumentAttachment } from "../types";
import ApprovalTimeline from "./ApprovalTimeline";
import FileViewerDialog from "./FileViewerDialog";

interface AttachmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
  readOnly?: boolean;
}

export default function AttachmentDetailDialog({
  open,
  onClose,
  document,
  readOnly = false,
}: AttachmentDetailDialogProps) {
  const t = useTranslations("project.documentCycle");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<DocumentAttachment | null>(null);

  if (!document) return null;

  const handleFileClick = (file: DocumentAttachment) => {
    setActiveFile(file);
    setFileViewerOpen(true);
  };

  const handleFileViewerClose = () => {
    setFileViewerOpen(false);
    setActiveFile(null);
  };

  const handleApprove = () => {
    onClose();
  };

  const handleReject = () => {
    onClose();
  };

  const handleRequestModification = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          className="max-w-[800px] max-h-[90vh] p-0 overflow-hidden"
          dir={dir}
        >
          <DialogTitle className="sr-only">
            {document.name || t("documentReview")}
          </DialogTitle>
          <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              {/* Title at "start" (right in RTL) */}
              <Box sx={{ textAlign: "start", flex: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {t("projectName")} 1
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("detailedDocumentName")}
                </Typography>
              </Box>
              {/* Close at "end" (left in RTL) */}
              <IconButton onClick={onClose} size="small">
                <X className="w-4 h-4" />
              </IconButton>
            </Box>

            {/* Info Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t("type")}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {document.documentType || "—"}
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t("approvalStatus")}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {document.approvalStatus || "—"}
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t("submissionDate")}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {document.submissionDate || "—"}
                </Typography>
              </Box>
            </Box>

            {/* Main content: content (start) + sidebar (end) */}
            {/*
              In RTL flex-row the first child is placed at the "start" = RIGHT.
              So: content column first (→ right/start), sidebar second (→ left/end).
            */}
            <Box sx={{ display: "flex", gap: 3 }}>
              {/* Content column — Description, Attachments, Actions */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Description */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 1, textAlign: "start" }}
                  >
                    {t("description")}
                  </Typography>
                  <Box sx={{ bgcolor: "grey.100", borderRadius: 1, p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {document.description || "—"}
                    </Typography>
                  </Box>
                </Box>

                {/* Attachments */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 1, textAlign: "start" }}
                  >
                    {t("attachments")}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {document.attachments?.map((file) => (
                      <Chip
                        key={file.id}
                        icon={<FileText className="w-4 h-4" />}
                        label={file.name}
                        variant="outlined"
                        onClick={() => handleFileClick(file)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      />
                    ))}
                    {(!document.attachments ||
                      document.attachments.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Action Buttons — incoming only */}
                {!readOnly && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      justifyContent: "center",
                      pt: 2,
                      mt: "auto",
                    }}
                  >
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                      onClick={handleApprove}
                    >
                      {t("approve")}
                    </Button>
                    <Button
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6"
                      onClick={handleRequestModification}
                    >
                      {t("requestModification")}
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white px-6"
                      onClick={handleReject}
                    >
                      {t("reject")}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Sidebar column — Approval timeline + Comments */}
              <Box sx={{ minWidth: 220, flexShrink: 0 }}>
                {document.approvalPath && document.approvalPath.length > 0 && (
                  <ApprovalTimeline steps={document.approvalPath} />
                )}

                {document.comments && document.comments.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 1, textAlign: "start" }}
                    >
                      {t("comments")}
                    </Typography>
                    {document.comments.map((comment) => (
                      <Box
                        key={comment.id}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          {comment.user.charAt(0)}
                        </Box>
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* File Viewer Dialog */}
      <FileViewerDialog
        open={fileViewerOpen}
        onClose={handleFileViewerClose}
        document={document}
        activeFile={activeFile}
        isIncoming={!readOnly}
      />
    </>
  );
}
