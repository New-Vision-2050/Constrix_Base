"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CheckCircle2, CircleDot, Clock3, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import TaskStatusBadge from "@/modules/hr-reports/employee-tasks/components/TaskStatusBadge";
import {
  AdvanceRequestsReportApi,
  LeaveRequestsReportApi,
  type AdvanceReportDetail,
  type LeaveReportDetail,
  type WorkflowProcess,
  type WorkflowStep,
} from "@/services/api/hr-reports/approval-requests";

export type ApprovalReportKind = "leave" | "advance";
type Detail = LeaveReportDetail | AdvanceReportDetail;

function StepItem({
  step,
  rejectionReason,
}: {
  step: WorkflowStep;
  rejectionReason: string | null;
}) {
  const t = useTranslations("HRReports.approvalReport");
  const Icon =
    step.status === "approved"
      ? CheckCircle2
      : step.status === "rejected"
        ? XCircle
        : Clock3;
  const tone =
    step.status === "approved"
      ? "bg-green-100 text-green-700"
      : step.status === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  return (
    <div className="relative pb-5 ps-10 last:pb-0">
      <div className="absolute bottom-0 start-[15px] top-8 w-px bg-border" />
      <div
        className={`absolute start-0 top-1 flex size-8 items-center justify-center rounded-full ${tone}`}
      >
        <Icon className="size-4" />
      </div>
      <Box className="rounded-lg bg-muted/50 p-3">
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="body2" fontWeight={700}>
            {step.order}. {step.name}
          </Typography>
          <TaskStatusBadge status={step.status} label={step.status_label} />
        </Stack>
        {step.status === "pending" ? (
          <Typography variant="caption" color="text.secondary">
            {t("awaiting")}:{" "}
            {step.authorized_users?.length
              ? step.authorized_users.map((u) => u.name).join(", ")
              : step.assigned_to?.name || "—"}
          </Typography>
        ) : (
          <>
            <Typography
              variant="caption"
              color="text.secondary"
              component="div"
            >
              {step.action_by?.name || "—"} {step.action_label ?? ""}
              {step.acted_at ? ` · ${step.acted_at}` : ""}
            </Typography>
            {step.status === "rejected" && rejectionReason && (
              <Typography variant="caption" color="error" component="div">
                {t("rejectionReason")}: {rejectionReason}
              </Typography>
            )}
          </>
        )}
      </Box>
    </div>
  );
}

function ProcessBlock({
  process,
  rejectionReason,
}: {
  process: WorkflowProcess;
  rejectionReason: string | null;
}) {
  const steps = [...(process.steps ?? [])].sort((a, b) => a.order - b.order);
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <Typography fontWeight={700}>{process.form_label}</Typography>
        <TaskStatusBadge
          status={process.status}
          label={process.status_label}
        />
      </Stack>
      {steps.map((step) => (
        <StepItem
          key={step.id}
          step={step}
          rejectionReason={rejectionReason}
        />
      ))}
    </Paper>
  );
}

export default function ApprovalReportDetailDialog({
  kind,
  requestId,
  open,
  onClose,
}: {
  kind: ApprovalReportKind;
  requestId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("HRReports.approvalReport");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !requestId) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    setDetail(null);
    const api =
      kind === "leave" ? LeaveRequestsReportApi : AdvanceRequestsReportApi;
    api
      .getById(requestId)
      .then(({ data }) => {
        if (!cancelled) setDetail(data.payload ?? null);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, requestId, kind]);

  const summary: [string, string | number | null | undefined][] = detail
    ? kind === "leave"
      ? (() => {
          const d = detail as LeaveReportDetail;
          return [
            [t("leaveType"), d.leave_type?.name],
            [t("policy"), d.leave_policy?.name],
            [t("dates"), `${d.start_date} → ${d.end_date}`],
            [t("totalDays"), d.total_days],
            [t("createdAt"), d.created_at],
          ];
        })()
      : (() => {
          const d = detail as AdvanceReportDetail;
          return [
            [t("policy"), d.advance_policy?.name],
            [t("amount"), d.amount],
            [t("installments"), d.installments],
            [t("createdAt"), d.created_at],
          ];
        })()
    : [];

  const finalActors: [string, string | null | undefined][] = detail
    ? [
        [t("requestedBy"), detail.requested_by?.name],
        [
          t("approvedBy"),
          detail.approved_by
            ? `${detail.approved_by.name}${detail.approved_at ? ` · ${detail.approved_at}` : ""}`
            : null,
        ],
        [
          t("rejectedBy"),
          detail.rejected_by
            ? `${detail.rejected_by.name}${detail.rejected_at ? ` · ${detail.rejected_at}` : ""}`
            : null,
        ],
      ]
    : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {kind === "leave" ? t("leaveDetails") : t("advanceDetails")}
            </Typography>
          </Box>
          {detail && (
            <TaskStatusBadge
              status={detail.status}
              label={detail.status_label}
            />
          )}
          <IconButton onClick={onClose} aria-label={t("close")}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ bgcolor: "background.default" }}>
        {loading && (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={130} />
            <Skeleton variant="rounded" height={260} />
          </Stack>
        )}
        {error && <Alert severity="error">{t("detailError")}</Alert>}
        {detail && (
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar>{detail.employee?.name?.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("employee")}
                    </Typography>
                    <Typography fontWeight={700}>
                      {detail.employee?.name || "—"}
                    </Typography>
                    <Typography variant="caption">
                      {detail.employee?.phone || "—"}
                    </Typography>
                  </Box>
                </Stack>
                {summary.map(([label, value]) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography fontWeight={600}>{value ?? "—"}</Typography>
                  </Box>
                ))}
                {kind === "leave" && (detail as LeaveReportDetail).is_emergency && (
                  <Box>
                    <TaskStatusBadge status="rejected" label={t("emergency")} />
                  </Box>
                )}
              </div>
              {(detail.reason || detail.notes) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  {detail.reason && (
                    <Typography variant="body2">
                      <strong>{t("reason")}:</strong> {detail.reason}
                    </Typography>
                  )}
                  {detail.notes && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t("notes")}:</strong> {detail.notes}
                    </Typography>
                  )}
                </>
              )}
              {detail.attachments?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary">
                    {t("attachments")}
                  </Typography>
                  <Stack spacing={0.5}>
                    {detail.attachments.map((file, index) => (
                      <a
                        key={file.id ?? index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {file.name ?? file.url.split("/").pop()}
                      </a>
                    ))}
                  </Stack>
                </>
              )}
              <Divider sx={{ my: 2 }} />
              <div className="grid gap-3 md:grid-cols-3">
                {finalActors.map(([label, value]) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body2">{value || "—"}</Typography>
                  </Box>
                ))}
              </div>
              {detail.status === "rejected" && detail.rejection_reason && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <strong>{t("rejectionReason")}:</strong>{" "}
                  {detail.rejection_reason}
                </Alert>
              )}
            </Paper>

            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>
                {t("workflow")}
              </Typography>
              {detail.workflow?.auto_approved || !detail.processes?.length ? (
                <Alert
                  severity={detail.workflow?.auto_approved ? "success" : "info"}
                >
                  {detail.workflow?.auto_approved
                    ? t("autoApprovedEmpty")
                    : t("noProcesses")}
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {detail.processes.map((process) => (
                    <ProcessBlock
                      key={process.id}
                      process={process}
                      rejectionReason={detail.rejection_reason}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            {detail.timeline?.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography fontWeight={700} mb={2}>
                  {t("timeline")}
                </Typography>
                <Stack spacing={1.5}>
                  {detail.timeline.map((item, index) => (
                    <Stack
                      key={`${item.process_id}-${item.step_order}-${index}`}
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <CircleDot
                        className={`mt-1 size-4 ${item.action === "approve" ? "text-green-600" : "text-red-600"}`}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {item.step_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.action_by?.name} {item.action_label} ·{" "}
                          {item.acted_at}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
