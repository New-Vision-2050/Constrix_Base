"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  CheckCircle2,
  CircleDot,
  Clock3,
  MapPin,
  PauseCircle,
  PlayCircle,
  PlusCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  EmployeeTasksReportApi,
  type EmployeeTaskReportDetail,
  type LocationRef,
  type TaskProcess,
} from "@/services/api/hr-reports/employee-tasks";
import TaskStatusBadge from "./TaskStatusBadge";

function MapLink({ location }: { location: LocationRef | null }) {
  if (!location) return <span>—</span>;
  return (
    <a
      href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
      onClick={(event) => event.stopPropagation()}
    >
      {location.latitude}, {location.longitude}
    </a>
  );
}

const processIcons = {
  create: PlusCircle,
  start: PlayCircle,
  end: PauseCircle,
  approval: CheckCircle2,
  extension: Clock3,
};

function ProcessItem({ process }: { process: TaskProcess }) {
  const t = useTranslations("HRReports.taskReport");
  const Icon = processIcons[process.type] ?? CircleDot;

  return (
    <div className="relative pb-5 ps-10 last:pb-0">
      <div className="absolute bottom-0 start-[15px] top-8 w-px bg-border last:hidden" />
      <div className="absolute start-0 top-1 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ sm: "center" }}
              sx={{ width: "100%", pr: 1 }}
            >
              <Typography fontWeight={700}>
                {process.type_label || t(`processTypes.${process.type}`)}
              </Typography>
              <TaskStatusBadge
                status={process.status}
                label={process.status_label}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                {process.requested_by?.name || "—"} · {process.requested_at}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {process.notes && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {process.notes}
              </Typography>
            )}
            {process.additional_hours && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {t("additionalHours")}: {process.additional_hours}
              </Typography>
            )}
            {process.steps?.length ? (
              <Stack spacing={1}>
                {process.steps.map((step) => (
                  <Box key={step.id} className="rounded-lg bg-muted/50 p-3">
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="body2" fontWeight={700}>
                        {step.order}. {step.name}
                      </Typography>
                      <TaskStatusBadge status={step.status} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {t("assignedTo")}: {step.assigned_to?.name || "—"} ·{" "}
                      {step.action_by
                        ? `${t("actionBy")} ${step.action_by.name} ${step.acted_at ?? ""}`
                        : t("awaitingAction")}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {process.reviewed_by
                  ? `${t("reviewedBy")}: ${process.reviewed_by.name} · ${process.reviewed_at ?? ""}`
                  : t("awaitingAction")}
                {process.review_notes ? ` — ${process.review_notes}` : ""}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Paper>
    </div>
  );
}

export default function TaskDetailDialog({
  taskId,
  open,
  onClose,
}: {
  taskId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("HRReports.taskReport");
  const [detail, setDetail] = useState<EmployeeTaskReportDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !taskId) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    setDetail(null);
    EmployeeTasksReportApi.getById(taskId)
      .then(({ data }) => {
        if (!cancelled) setDetail(data.data ?? data.payload ?? null);
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
  }, [open, taskId]);

  const locations = detail?.locations ?? {
    task_location: detail?.task_location ?? null,
    start_location: null,
    end_location: null,
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {detail?.title || t("details")}
            </Typography>
            {detail && (
              <Typography variant="caption" color="text.secondary">
                {detail.serial_number}
              </Typography>
            )}
          </Box>
          {detail && <TaskStatusBadge status={detail.status} label={detail.status_label} />}
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
            <Skeleton variant="rounded" height={180} />
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
                    <Typography variant="caption" color="text.secondary">{t("employee")}</Typography>
                    <Typography fontWeight={700}>{detail.employee?.name || "—"}</Typography>
                    <Typography variant="caption">{detail.employee?.phone || "—"}</Typography>
                  </Box>
                </Stack>
                {[
                  [t("taskType"), detail.task_type?.name],
                  [t("taskDate"), detail.task_date],
                  [t("duration"), detail.duration_hours],
                  [t("workedHours"), detail.total_task_hours],
                  [t("time"), `${detail.time_from} → ${detail.time_to}`],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography fontWeight={600}>{value || "—"}</Typography>
                  </Box>
                ))}
              </div>
              {(detail.description || detail.notes) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">{detail.description}</Typography>
                  {detail.notes && <Typography variant="body2" color="text.secondary">{detail.notes}</Typography>}
                </>
              )}
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <MapPin className="size-5 text-primary" />
                <Typography fontWeight={700}>{t("locations")}</Typography>
              </Stack>
              <div className="grid gap-3 md:grid-cols-3">
                <Box>{t("targetLocation")}: <MapLink location={locations.task_location} /></Box>
                <Box>{t("startLocation")}: <MapLink location={locations.start_location} /></Box>
                <Box>{t("endLocation")}: <MapLink location={locations.end_location} /></Box>
              </div>
              {locations.task_location?.radius_meters && (
                <Typography variant="caption" color="text.secondary">
                  {t("radius")}: {locations.task_location.radius_meters} m
                </Typography>
              )}
            </Paper>

            {detail.work_sessions?.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, overflowX: "auto" }}>
                <Typography fontWeight={700} mb={2}>{t("workSessions")}</Typography>
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-start">
                    <th className="p-2 text-start">{t("start")}</th>
                    <th className="p-2 text-start">{t("end")}</th>
                    <th className="p-2 text-start">{t("minutes")}</th>
                    <th className="p-2 text-start">{t("locations")}</th>
                  </tr></thead>
                  <tbody>{detail.work_sessions.map((session) => (
                    <tr key={session.id} className="border-b last:border-0">
                      <td className="p-2">{session.start_time}</td>
                      <td className="p-2">{session.end_time || "—"}</td>
                      <td className="p-2">{session.duration_minutes}</td>
                      <td className="p-2"><MapLink location={session.start_location} /> → <MapLink location={session.end_location} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </Paper>
            )}

            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>{t("processTimeline")}</Typography>
              {detail.processes?.length
                ? detail.processes.map((process, index) => (
                    <ProcessItem key={`${process.type}-${process.requested_at}-${index}`} process={process} />
                  ))
                : <Typography color="text.secondary">{t("noProcesses")}</Typography>}
            </Box>

            <Alert severity={detail.final_status === "completed" ? "success" : "info"}>
              <strong>{t("finalStatus")}:</strong>{" "}
              {detail.final_status_label || detail.status_label}
            </Alert>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
