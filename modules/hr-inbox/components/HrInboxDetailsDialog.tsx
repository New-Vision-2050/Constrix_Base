"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { HR_EMPLOYEE_TASKS_INBOX_QUERY_KEY } from "@/modules/hr-inbox/query-keys";
import type { EmployeeTaskInboxRow } from "@/services/api/employee-tasks";
import { EmployeeTasksApi } from "@/services/api/employee-tasks";

function getApiErrorDescription(error: unknown): string | undefined {
  const data = axios.isAxiosError(error)
    ? error.response?.data
    : (error as { response?: { data?: unknown } })?.response?.data;
  if (!data || typeof data !== "object") return undefined;
  const body = data as { description?: string; message?: unknown };
  if (typeof body.description === "string" && body.description.trim())
    return body.description.trim();
  if (typeof body.message === "string") return body.message;
  return undefined;
}

function formatDateTime(value: string | undefined, empty: string): string {
  if (value == null || value === "") return empty;
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatTaskDateOnly(value: string | undefined, empty: string): string {
  if (value == null || value === "") return empty;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function approversLabel(row: EmployeeTaskInboxRow, empty: string): string {
  const takers = row.current_step?.action_takers;
  if (!takers?.length) return empty;
  return takers.map((a) => a.name).join(", ");
}

function isPendingRow(row: EmployeeTaskInboxRow | null): boolean {
  if (!row) return false;
  const s = String(row.status ?? "").trim().toLowerCase();
  return s === "pending";
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25 }}>
        {value}
      </Typography>
    </Box>
  );
}

export interface HrInboxDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  row: EmployeeTaskInboxRow | null;
}

export default function HrInboxDetailsDialog({
  open,
  onClose,
  row,
}: HrInboxDetailsDialogProps) {
  const t = useTranslations("HrInbox");
  const tLabels = useTranslations("labels");
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState("");

  const dash = t("dash");

  const locationDisplay = useMemo(() => {
    if (!row?.task_location) return dash;
    const loc = row.task_location;
    return t("detailLocationSummary", {
      lat: String(loc.latitude),
      lng: String(loc.longitude),
      radius: String(loc.radius_meters),
    });
  }, [row, dash, t]);

  useEffect(() => {
    setRejectionReason("");
  }, [open, row?.id]);

  const canRespond = useMemo(() => isPendingRow(row), [row]);

  const rejectReasonTrimmed = rejectionReason.trim();
  const rejectReasonInvalid = rejectReasonTrimmed === "";

  const invalidateInbox = () => {
    queryClient.invalidateQueries({
      queryKey: [HR_EMPLOYEE_TASKS_INBOX_QUERY_KEY],
    });
  };

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!row?.id) throw new Error("missing task");
      await EmployeeTasksApi.approve(row.id);
    },
    onSuccess: () => {
      toast.success(t("toastApproveSuccess"));
      invalidateInbox();
      onClose();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorDescription(error) ?? t("toastOperationError"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (reason: string) => {
      if (!row?.id) throw new Error("missing task");
      await EmployeeTasksApi.reject(row.id, { rejection_reason: reason });
    },
    onSuccess: () => {
      toast.success(t("toastRejectSuccess"));
      invalidateInbox();
      onClose();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorDescription(error) ?? t("toastOperationError"));
    },
  });

  const actionPending =
    approveMutation.isPending || rejectMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (
          actionPending &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        ) {
          return;
        }
        onClose();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: "inherit" }}>
        {t("detailsTitle")}
      </DialogTitle>
      <DialogContent dividers>
        {!row ? (
          <Typography color="text.secondary">{t("detailsEmpty")}</Typography>
        ) : (
          <Box sx={{ pt: 1 }}>
            <DetailRow
              label={t("colSerial")}
              value={row.serial_number ?? row.id}
            />
            <DetailRow
              label={t("colTitle")}
              value={row.title ?? dash}
            />
            <DetailRow
              label={t("colEmployee")}
              value={row.user?.name ?? dash}
            />
            <DetailRow
              label={t("colStatus")}
              value={row.status_label || row.status || dash}
            />
            <DetailRow
              label={t("colTaskDate")}
              value={formatTaskDateOnly(row.task_date, dash)}
            />
            <DetailRow
              label={t("colDuration")}
              value={
                row.duration_hours != null && row.duration_hours !== ""
                  ? row.duration_hours
                  : dash
              }
            />
            <DetailRow
              label={t("colCurrentStep")}
              value={row.current_step?.name ?? dash}
            />
            <DetailRow
              label={t("colApprovers")}
              value={approversLabel(row, dash)}
            />
            <DetailRow
              label={t("colCreated")}
              value={formatDateTime(row.created_at, dash)}
            />
            <DetailRow label={t("detailLocation")} value={locationDisplay} />
            {canRespond ? (
              <Box sx={{ pt: 2 }}>
                <TextField
                  label={t("rejectReason")}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  fullWidth
                  required
                  multiline
                  minRows={2}
                  disabled={actionPending}
                  size="small"
                  helperText={t("rejectReasonHelper")}
                />
              </Box>
            ) : null}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: "wrap" }}>
        {canRespond ? (
          <>
            <Button
              color="error"
              variant="outlined"
              disabled={actionPending || rejectReasonInvalid}
              onClick={() => rejectMutation.mutate(rejectReasonTrimmed)}
            >
              {t("reject")}
            </Button>
            <Button
              color="success"
              variant="contained"
              disabled={actionPending}
              onClick={() => approveMutation.mutate()}
            >
              {t("approve")}
            </Button>
          </>
        ) : null}
        <Button
          onClick={onClose}
          variant="contained"
          disabled={actionPending}
          sx={{ ml: "auto" }}
        >
          {tLabels("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
