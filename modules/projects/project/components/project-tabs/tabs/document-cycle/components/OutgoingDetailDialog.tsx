"use client";

import type { DocumentRow } from "../types";
import AttachmentRequestDetailDialog from "./AttachmentRequestDetailDialog";

export type OutgoingDetailDialogProps = {
  open: boolean;
  onClose: () => void;
  document: DocumentRow | null;
};

export default function OutgoingDetailDialog({
  open,
  onClose,
  document,
}: OutgoingDetailDialogProps) {
  return (
    <AttachmentRequestDetailDialog
      open={open}
      onClose={onClose}
      document={document}
      variant="outgoing"
    />
  );
}
