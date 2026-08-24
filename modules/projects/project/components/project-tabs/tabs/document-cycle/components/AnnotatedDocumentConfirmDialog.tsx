"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApryseWebViewer } from "./ApryseWebViewer";
import type { AnnotatedConfirmAction } from "./useAnnotatedDocumentWorkflow";

const CONFIRM_STACKED_Z = "z-[1700]";

type AnnotatedDocumentConfirmDialogProps = {
  open: boolean;
  action: AnnotatedConfirmAction | null;
  buffer: ArrayBuffer | null;
  extension: string;
  fileName: string;
  previewReady: boolean;
  confirmPending: boolean;
  onPreviewPreparing: () => void;
  onPreviewReady: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function AnnotatedDocumentConfirmDialog({
  open,
  action,
  buffer,
  extension,
  fileName,
  previewReady,
  confirmPending,
  onPreviewPreparing,
  onPreviewReady,
  onConfirm,
  onCancel,
}: AnnotatedDocumentConfirmDialogProps) {
  const t = useTranslations("project.documentCycle");

  const confirmLabel =
    action === "approve"
      ? t("confirmApproveWithNotes")
      : t("confirmSaveWithNotes");

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !confirmPending) onCancel();
      }}
    >
      <DialogContent
        overlayClassName={CONFIRM_STACKED_Z}
        className={cn(
          "max-w-[92vw] w-[960px] h-[92vh] max-h-[92vh] p-0 overflow-hidden flex flex-col gap-0",
          CONFIRM_STACKED_Z,
        )}
      >
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>{t("confirmAnnotatedDocumentTitle")}</DialogTitle>
          <DialogDescription>
            {t("confirmAnnotatedDocumentDescription")}
          </DialogDescription>
        </DialogHeader>

        <Box
          sx={{
            position: "relative",
            flex: "1 1 auto",
            minHeight: 0,
            mx: 3,
            mb: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "background.default",
          }}
        >
          {buffer && buffer.byteLength > 0 && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
              }}
            >
              <ApryseWebViewer
                key={`confirm-${buffer.byteLength}-${fileName}`}
                documentBuffer={buffer}
                extension={extension}
                fileName={fileName}
                fillParent
                onViewerPreparing={onPreviewPreparing}
                onViewerReady={onPreviewReady}
              />
            </Box>
          )}

          {!previewReady && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                bgcolor: "action.hover",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <CircularProgress size={36} />
              <Typography variant="body2" color="text.secondary">
                {t("confirmAnnotatedDocumentLoading")}
              </Typography>
            </Box>
          )}
        </Box>

        <DialogFooter className="px-6 pb-6 pt-2 shrink-0 gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={confirmPending}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!previewReady || confirmPending}
            className={
              action === "approve"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }
          >
            {confirmPending ? (
              <CircularProgress size={16} sx={{ color: "inherit" }} />
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
