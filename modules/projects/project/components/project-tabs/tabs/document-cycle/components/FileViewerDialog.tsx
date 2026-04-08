"use client";

import { useState } from "react";
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
  ChevronUp,
  ChevronDown,
  Bold,
  Italic,
  List,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DocumentRow, DocumentAttachment } from "../types";

interface FileViewerDialogProps {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
  activeFile: DocumentAttachment | null;
  onFileSelect: (file: DocumentAttachment) => void;
  isIncoming: boolean;
}

export default function FileViewerDialog({
  open,
  onClose,
  document,
  activeFile,
  onFileSelect,
  isIncoming,
}: FileViewerDialogProps) {
  const t = useTranslations("project.documentCycle");
  const [zoom, setZoom] = useState(100);
  const [note, setNote] = useState("");

  if (!document || !activeFile) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25));
  const handleDownload = () => window.open(activeFile.url, "_blank");
  const handlePrint = () => window.print();

  const handleApprove = () => {
    onClose();
  };

  const handleReject = () => {
    onClose();
  };

  const handleRequestModification = () => {
    onClose();
  };

  const attachments = document.attachments ?? [];
  const currentFileIndex = attachments.findIndex((f) => f.id === activeFile.id);

  const navigateFile = (direction: "up" | "down") => {
    const newIndex =
      direction === "up" ? currentFileIndex - 1 : currentFileIndex + 1;
    if (newIndex >= 0 && newIndex < attachments.length) {
      onFileSelect(attachments[newIndex]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] max-h-[95vh] p-0 overflow-hidden">
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
              {t("projectName")} 1
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {document.name}
              </Typography>
              <IconButton size="small" onClick={onClose}>
                <X className="w-4 h-4" />
              </IconButton>
            </Box>
          </Box>

          {/* Body */}
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
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
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="w-4 h-4 me-1" />
                    {t("print")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
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
              </Box>

              {/* Preview Area */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  overflow: "auto",
                  bgcolor: "grey.100",
                }}
              >
                {/* Main preview */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: `${zoom}%`,
                      maxWidth: 800,
                      bgcolor: "white",
                      borderRadius: 1,
                      boxShadow: 2,
                      p: 4,
                      minHeight: 400,
                      transition: "width 0.2s ease",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("filePreview")}: {activeFile.name}
                    </Typography>
                  </Box>
                </Box>

                {/* Thumbnails sidebar */}
                <Box
                  sx={{
                    width: 100,
                    borderInlineStart: 1,
                    borderColor: "divider",
                    overflowY: "auto",
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    size="small"
                    disabled={currentFileIndex === 0}
                    onClick={() => navigateFile("up")}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </IconButton>
                  {attachments.map((file, idx) => (
                    <Box
                      key={file.id}
                      onClick={() => onFileSelect(file)}
                      sx={{
                        width: 70,
                        height: 90,
                        bgcolor:
                          file.id === activeFile.id
                            ? "primary.main"
                            : "grey.300",
                        borderRadius: 1,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color:
                          file.id === activeFile.id ? "white" : "text.primary",
                        border: file.id === activeFile.id ? 2 : 0,
                        borderColor: "primary.main",
                        transition: "all 0.2s",
                        "&:hover": { opacity: 0.8 },
                      }}
                    >
                      <Typography variant="caption">{idx + 1}</Typography>
                    </Box>
                  ))}
                  <IconButton
                    size="small"
                    disabled={currentFileIndex === attachments.length - 1}
                    onClick={() => navigateFile("down")}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

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
                  />
                </Box>
              )}

              {/* Action Buttons for Incoming */}
              {isIncoming && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    pt: 1,
                  }}
                >
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleApprove}
                  >
                    ✓ {t("approve")}
                  </Button>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={handleRequestModification}
                  >
                    ✎ {t("requestModification")}
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleReject}
                  >
                    ✕ {t("reject")}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
