"use client";

import type { DocumentRow } from "../types";
import AttachmentRequestDetailDialog from "./AttachmentRequestDetailDialog";

export type AttachmentDetailDialogProps = {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
  /** Defaults to closing the dialog if omitted. */
  onApprove?: () => void;
  onReject?: () => void;
  onRequestModification?: () => void;
  actionPending?: boolean;
};

/**
 * Incoming attachment request detail — same layout as {@link OutgoingDetailDialog}
 * with اعتماد / طلب تعديل / رفض actions.
 */
export default function AttachmentDetailDialog({
  open,
  onClose,
  document,
  onApprove,
  onReject,
  onRequestModification,
  actionPending,
}: AttachmentDetailDialogProps) {
  return (
    <AttachmentRequestDetailDialog
      open={open}
      onClose={onClose}
      document={document}
      variant="incoming"
      onApprove={onApprove}
      onReject={onReject}
      onRequestModification={onRequestModification}
      actionPending={actionPending}
    />
  );
}
