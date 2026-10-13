"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import type { ApprovalInboxRow } from "@/services/api/approval-requests";

export interface ApprovalRequestAction<TSummary = unknown> {
  type: "approve" | "reject";
  row: ApprovalInboxRow<TSummary>;
}

interface ParsedApiError {
  status?: number;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

function parseApiError(error: unknown): ParsedApiError {
  if (!axios.isAxiosError(error)) return {};
  const data = error.response?.data;
  const result: ParsedApiError = { status: error.response?.status };
  if (data && typeof data === "object") {
    const body = data as {
      message?: unknown;
      errors?: unknown;
    };
    if (typeof body.message === "string" && body.message.trim()) {
      result.message = body.message;
    }
    if (body.errors && typeof body.errors === "object") {
      result.fieldErrors = body.errors as Record<string, string[]>;
    }
  }
  return result;
}

export interface ApprovalActionDialogsProps<TSummary = unknown> {
  action: ApprovalRequestAction<TSummary> | null;
  onClose: () => void;
  approveRequest: (id: string) => Promise<unknown>;
  rejectRequest: (
    id: string,
    body: { rejection_reason: string },
  ) => Promise<unknown>;
  /**
   * Called after a successful action (remove the row, refetch the tab inbox
   * and both inbox-counts) and on 422 errors (refetch the tab).
   */
  onRefresh: () => void;
}

export default function ApprovalActionDialogs<TSummary>({
  action,
  onClose,
  approveRequest,
  rejectRequest,
  onRefresh,
}: ApprovalActionDialogsProps<TSummary>) {
  const t = useTranslations("HrInbox.approvals");
  const tLabels = useTranslations("labels");
  const [rejectionReason, setRejectionReason] = useState("");
  const [reasonError, setReasonError] = useState<string | undefined>();

  // Reset the reject form whenever the target row changes / dialogs close.
  useEffect(() => {
    setRejectionReason("");
    setReasonError(undefined);
  }, [action?.row.id, action?.type]);

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await approveRequest(id);
    },
    onSuccess: () => {
      toast.success(t("toastApproveSuccess"));
      onRefresh();
      onClose();
    },
    onError: (error: unknown) => {
      const { status, message } = parseApiError(error);
      toast.error(message ?? t("toastOperationError"));
      if (status === 422) onRefresh();
      if (status === 422 || status === 404) onClose();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (vars: { id: string; reason: string }) => {
      await rejectRequest(vars.id, { rejection_reason: vars.reason });
    },
    onSuccess: () => {
      toast.success(t("toastRejectSuccess"));
      onRefresh();
      onClose();
    },
    onError: (error: unknown) => {
      const { status, message, fieldErrors } = parseApiError(error);
      const fieldError = fieldErrors?.rejection_reason?.[0];
      if (fieldError) setReasonError(fieldError);
      toast.error(fieldError ?? message ?? t("toastOperationError"));
      if (status === 422 && !fieldError) {
        onRefresh();
        onClose();
      }
    },
  });

  const reasonTrimmed = rejectionReason.trim();
  const reasonInvalid = reasonTrimmed === "";

  const submit = () => {
    if (!action) return;
    if (action.type === "approve") {
      approveMutation.mutate(action.row.id);
    } else if (!reasonInvalid) {
      rejectMutation.mutate({ id: action.row.id, reason: reasonTrimmed });
    }
  };

  const handleClose = () => {
    if (approveMutation.isPending || rejectMutation.isPending) return;
    onClose();
  };

  return (
    <>
      {/* Approve — simple confirmation */}
      <Dialog
        open={action?.type === "approve"}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown={approveMutation.isPending}
      >
        <DialogTitle sx={{ textAlign: "inherit" }}>
          {t("approveConfirmTitle")}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">{t("approveConfirmMessage")}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={approveMutation.isPending}>
            {tLabels("cancel")}
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={approveMutation.isPending}
            onClick={submit}
          >
            {tLabels("confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject — required reason */}
      <Dialog
        open={action?.type === "reject"}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown={rejectMutation.isPending}
      >
        <DialogTitle sx={{ textAlign: "inherit" }}>
          {t("rejectDialogTitle")}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label={t("rejectReason")}
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              if (reasonError) setReasonError(undefined);
            }}
            autoFocus
            fullWidth
            required
            multiline
            minRows={3}
            disabled={rejectMutation.isPending}
            size="small"
            sx={{ mt: 0.5 }}
            error={Boolean(reasonError)}
            helperText={reasonError ?? t("rejectReasonHelper")}
            slotProps={{ htmlInput: { maxLength: 1000 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={rejectMutation.isPending}>
            {tLabels("cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={rejectMutation.isPending || reasonInvalid}
            onClick={submit}
          >
            {tLabels("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
