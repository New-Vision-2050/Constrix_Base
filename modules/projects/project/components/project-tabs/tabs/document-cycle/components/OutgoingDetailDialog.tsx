"use client";

import { useState } from "react";
import { Box, Typography, IconButton, MenuItem } from "@mui/material";
import { X, Settings, Download, FileText, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomMenu from "@/components/headless/custom-menu";
import { DocumentRow, DocumentAttachment, ApprovalStep } from "../types";
import FileViewerDialog from "./FileViewerDialog";

/* ─── colour tokens (dark-purple theme) ─────────────────────────────── */
const BG_DIALOG = "#120730";
const BG_CARD = "rgba(255,255,255,0.06)";
const BG_SIDEBAR = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.12)";
const TEXT_PRIMARY = "#ffffff";
const TEXT_SECONDARY = "rgba(255,255,255,0.55)";
const COLOR_SUCCESS = "#22c55e";
const COLOR_PRIMARY = "#7c3aed";
const COLOR_CURRENT = "#3b82f6";

/* ─── Props ──────────────────────────────────────────────────────────── */
interface OutgoingDetailDialogProps {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
}

/* ═══════════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════════ */
export default function OutgoingDetailDialog({
  open,
  onClose,
  document,
}: OutgoingDetailDialogProps) {
  const t = useTranslations("project.documentCycle");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<DocumentAttachment | null>(null);

  if (!document) return null;

  const handleFileClick = (file: DocumentAttachment) => {
    setActiveFile(file);
    setFileViewerOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          className="p-0 border-0 overflow-hidden"
          style={{
            maxWidth: 900,
            maxHeight: "90vh",
            background: BG_DIALOG,
            borderRadius: 16,
            overflow: "hidden",
          }}
          dir={dir}
        >
          {/* scroll wrapper */}
          <Box sx={{ overflowY: "auto", maxHeight: "90vh", p: 3, display: "flex", flexDirection: "column", gap: 3 }}>

            {/* ── Header ─────────────────────────────────────────────── */}
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              {/* title is at "start" (right in RTL) */}
              <Box sx={{ textAlign: "start" }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: TEXT_PRIMARY }}>
                  {t("projectName")} 1
                </Typography>
                <Typography variant="body2" sx={{ color: TEXT_SECONDARY }}>
                  {t("detailedDocumentName")}
                </Typography>
              </Box>

              {/* close is at "end" (left in RTL) */}
              <IconButton onClick={onClose} size="small" sx={{ color: TEXT_SECONDARY, "&:hover": { color: TEXT_PRIMARY } }}>
                <X className="w-4 h-4" />
              </IconButton>
            </Box>

            {/* ── Info cards ─────────────────────────────────────────── */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
              <InfoCard label={t("type")}           value={document.documentType   || "مراجعة العالية"} />
              <InfoCard label={t("approvalStatus")} value={document.approvalStatus || "الحالة الحالية"} />
              <InfoCard label={t("submissionDate")} value={document.submissionDate || "22/000/2023"}   />
            </Box>

            {/* ── Body: content (start) + sidebar (end) ─────────────── */}
            {/*
                In RTL flex-row the first child sits at the "start" = right side
                The sidebar should appear on the LEFT (= "end" in RTL), so it comes second in DOM
            */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>

              {/* ── Content column ───────────────────────────────────── */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>

                {/* Description */}
                <Box>
                  <SectionHeading>{t("description")}</SectionHeading>
                  <Box
                    sx={{
                      border: `1px solid ${BORDER}`,
                      borderRadius: 2,
                      p: 2,
                      background: BG_CARD,
                      minHeight: 80,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: TEXT_SECONDARY, lineHeight: 1.8 }}>
                      {document.description || "—"}
                    </Typography>
                  </Box>
                </Box>

                {/* Attachments */}
                <Box>
                  <SectionHeading>{t("attachments")}</SectionHeading>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {document.attachments && document.attachments.length > 0
                      ? document.attachments.map((file) => (
                          <AttachmentCard
                            key={file.id}
                            file={file}
                            isRTL={isRTL}
                            onView={() => handleFileClick(file)}
                            editLabel={t("edit")}
                            deleteLabel={t("delete")}
                          />
                        ))
                      : (
                          <Typography variant="body2" sx={{ color: TEXT_SECONDARY }}>—</Typography>
                        )}
                  </Box>
                </Box>

                {/* Send button */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={onClose}
                    style={{
                      background: COLOR_PRIMARY,
                      color: "#fff",
                      padding: "8px 32px",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 15,
                    }}
                  >
                    {t("send")}
                  </Button>
                </Box>
              </Box>

              {/* ── Sidebar column ───────────────────────────────────── */}
              <Box
                sx={{
                  width: 240,
                  flexShrink: 0,
                  background: BG_SIDEBAR,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 3,
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {/* Approval path */}
                {document.approvalPath && document.approvalPath.length > 0 && (
                  <Box>
                    <SectionHeading>{t("approvalPath")}</SectionHeading>
                    <ApprovalTimeline steps={document.approvalPath} />
                  </Box>
                )}

                {/* Comments */}
                {document.comments && document.comments.length > 0 && (
                  <Box>
                    <SectionHeading>{t("comments")}</SectionHeading>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {document.comments.map((comment) => (
                        <Box key={comment.id}>
                          {/* Avatar + name row */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${COLOR_PRIMARY}, #9333ea)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 14,
                                flexShrink: 0,
                              }}
                            >
                              {comment.user.charAt(0)}
                            </Box>
                            <Box>
                              <Typography variant="body2" fontWeight={600} sx={{ color: TEXT_PRIMARY }}>
                                {comment.user}
                              </Typography>
                              <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>
                                {comment.date}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Bubble */}
                          <Box
                            sx={{
                              background: `linear-gradient(135deg, ${COLOR_PRIMARY}cc, #6d28d9cc)`,
                              borderRadius: 2,
                              px: 2,
                              py: 1.25,
                            }}
                          >
                            <Typography variant="body2" sx={{ color: "#fff", lineHeight: 1.7 }}>
                              {comment.content}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <FileViewerDialog
        open={fileViewerOpen}
        onClose={() => { setFileViewerOpen(false); setActiveFile(null); }}
        document={document}
        activeFile={activeFile}
        onFileSelect={setActiveFile}
        isIncoming={false}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Sub-components
═══════════════════════════════════════════════════════════════════════ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="subtitle1"
      fontWeight={700}
      sx={{ color: TEXT_PRIMARY, mb: 1.25, textAlign: "start" }}
    >
      {children}
    </Typography>
  );
}

/* ── Info card ─────────────────────────────────────────────────────── */
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 2,
        p: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={700} sx={{ color: TEXT_PRIMARY }}>
        {value}
      </Typography>
    </Box>
  );
}

/* ── Attachment card ───────────────────────────────────────────────── */
function AttachmentCard({
  file,
  isRTL,
  onView,
  editLabel,
  deleteLabel,
}: {
  file: DocumentAttachment;
  isRTL: boolean;
  onView: () => void;
  editLabel: string;
  deleteLabel: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        border: `1px solid ${BORDER}`,
        borderRadius: 2.5,
        px: 1.5,
        py: 1,
        background: BG_CARD,
        /* icon column is always at the "end" (left in RTL, right in LTR) */
        flexDirection: isRTL ? "row" : "row-reverse",
      }}
    >
      {/* Document thumbnail (at "start" = right in RTL) */}
      <Box
        onClick={onView}
        sx={{
          width: 52,
          height: 60,
          borderRadius: 1.5,
          background: "rgba(255,255,255,0.08)",
          border: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <FileText className="w-6 h-6" style={{ color: TEXT_SECONDARY }} />
      </Box>

      {/* File info (center) */}
      <Box sx={{ flex: 1, textAlign: "start" }} onClick={onView} style={{ cursor: "pointer" }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: TEXT_PRIMARY }}>
          {file.name}
        </Typography>
        <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>
          {file.type || "تحاويل"}
        </Typography>
      </Box>

      {/* Action icons (at "end" = left in RTL) */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <IconButton size="small" onClick={onClick} sx={{ color: TEXT_SECONDARY, p: 0.5 }}>
              <Settings className="w-4 h-4" />
            </IconButton>
          )}
        >
          <MenuItem onClick={() => {}}>{editLabel}</MenuItem>
          <MenuItem onClick={() => {}}>{deleteLabel}</MenuItem>
        </CustomMenu>

        <IconButton size="small" sx={{ color: TEXT_SECONDARY, p: 0.5 }} onClick={() => {}}>
          <Download className="w-4 h-4" />
        </IconButton>
      </Box>
    </Box>
  );
}

/* ── Approval timeline ─────────────────────────────────────────────── */
function ApprovalTimeline({ steps }: { steps: ApprovalStep[] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {steps.map((step, index) => (
        <Box key={step.id} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          {/* indicator column */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  step.status === "completed"
                    ? COLOR_SUCCESS
                    : step.status === "current"
                    ? COLOR_CURRENT
                    : "rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            >
              {step.status === "completed" ? (
                <Check className="w-3 h-3" style={{ color: "#fff" }} />
              ) : (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: step.status === "current" ? "#fff" : "rgba(255,255,255,0.4)",
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
                  background:
                    step.status === "completed"
                      ? `${COLOR_SUCCESS}60`
                      : "rgba(255,255,255,0.1)",
                  my: 0.5,
                }}
              />
            )}
          </Box>

          {/* text */}
          <Box sx={{ pb: index < steps.length - 1 ? 1.5 : 0, textAlign: "start" }}>
            <Typography
              variant="body2"
              fontWeight={step.status === "current" ? 700 : 500}
              sx={{ color: step.status === "current" ? TEXT_PRIMARY : TEXT_SECONDARY }}
            >
              {step.title}
            </Typography>
            {(step.user || step.date) && (
              <>
                {step.user && (
                  <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: "block" }}>
                    {step.user}
                  </Typography>
                )}
                {step.date && (
                  <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: "block" }}>
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
