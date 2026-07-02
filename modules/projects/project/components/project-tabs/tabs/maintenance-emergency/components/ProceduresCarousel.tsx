"use client";

import { useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Link as MuiLink,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { FileText } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type {
  EmployeeTaskProcedure,
  EmployeeTaskProcedureStep,
  EmployeeTaskProcedureAttachment,
  EmployeeTaskProceduresSummary,
} from "@/services/api/employee-tasks";
import {
  getFormDataLabel,
  getFormDisplayName,
  formatFileSize,
  formatFormDataValue,
  isImageAttachment,
} from "./procedureFormData";

interface ProceduresCarouselProps {
  procedures: EmployeeTaskProcedure[];
  summary: EmployeeTaskProceduresSummary | null;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeFileUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function StepStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return <CheckCircleIcon sx={{ color: "success.main", fontSize: 18 }} />;
    case "rejected":
      return <CancelIcon sx={{ color: "error.main", fontSize: 18 }} />;
    default:
      return <PendingIcon sx={{ color: "warning.main", fontSize: 18 }} />;
  }
}

function getTimelineDotFill(procedure: EmployeeTaskProcedure): string {
  if (procedure.status === "completed" || procedure.percentage === 100) {
    return "#ec4899";
  }
  if (procedure.status === "in_progress" || procedure.percentage > 0) {
    return "#3b82f6";
  }
  return "#6b7280";
}

function ProcedureAttachments({
  attachments,
  isRTL,
}: {
  attachments: EmployeeTaskProcedureAttachment[];
  isRTL: boolean;
}) {
  if (!attachments.length) return null;

  return (
    <Box>
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
        {isRTL ? "المرفقات" : "Attachments"}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        {attachments.map((att) => {
          const isImage = isImageAttachment(att);
          return (
            <Paper
              key={att.id}
              variant="outlined"
              sx={{ p: 1, borderRadius: 1.5, overflow: "hidden" }}
            >
              {isImage ? (
                <Box
                  component="img"
                  src={normalizeFileUrl(att.url)}
                  alt={att.name}
                  sx={{
                    width: "100%",
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => window.open(normalizeFileUrl(att.url), "_blank")}
                />
              ) : (
                <Box
                  sx={{
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "action.hover",
                    borderRadius: 1,
                  }}
                >
                  <FileText className="w-8 h-8 text-red-500" />
                </Box>
              )}
              <Tooltip title={att.name}>
                <MuiLink
                  href={normalizeFileUrl(att.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    mt: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                >
                  {att.name}
                </MuiLink>
              </Tooltip>
              {att.size != null && att.size > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                  {formatFileSize(att.size)}
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}

function ApprovalSteps({ steps, isRTL }: { steps: EmployeeTaskProcedureStep[]; isRTL: boolean }) {
  if (!steps.length) return null;

  return (
    <Box>
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
        {isRTL ? "خطوات الاعتماد" : "Approval Steps"}
      </Typography>
      <Stack spacing={0}>
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              position: "relative",
              pb: index < steps.length - 1 ? 2 : 0,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <StepStatusIcon status={step.status} />
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    minHeight: 20,
                    bgcolor: "divider",
                    mt: 0.5,
                  }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600}>
                {step.step_order}. {step.name ?? "—"}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                {step.action_by && (
                  <Typography variant="caption" color="text.secondary">
                    {step.action_by.name}
                  </Typography>
                )}
                {step.acted_at && (
                  <Typography variant="caption" color="text.secondary">
                    · {formatDateTime(step.acted_at)}
                  </Typography>
                )}
                {!step.action_by && (
                  <Typography variant="caption" color="text.secondary">
                    —
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function FormDataView({
  formData,
  isRTL,
}: {
  formData: Record<string, unknown> | null;
  isRTL: boolean;
}) {
  if (!formData) return null;

  const entries = Object.entries(formData).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  if (!entries.length) return null;

  return (
    <Box>
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
        {isRTL ? "بيانات النموذج" : "Form Data"}
      </Typography>
      <Grid container spacing={1}>
        {entries.map(([key, value]) => (
          <Grid size={{ xs: 12, sm: 6 }} key={key}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {getFormDataLabel(key, isRTL)}
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ wordBreak: "break-word" }}>
                {formatFormDataValue(value)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function TimelineItem({
  procedure,
  isRTL,
  isLast,
  isExpanded,
  onToggle,
}: {
  procedure: EmployeeTaskProcedure;
  isRTL: boolean;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const dotColor = getTimelineDotFill(procedure);
  const formDisplayName = getFormDisplayName(procedure.form, isRTL);
  const isUpdateForm = procedure.form.startsWith("update");
  const hasFormData = procedure.form_data && Object.keys(procedure.form_data).length > 0;

  // For update procedures, show up to 3 key data points as a preview
  const previewEntries = isUpdateForm && hasFormData
    ? Object.entries(procedure.form_data!)
        .filter(([, value]) => value !== null && value !== undefined && value !== "")
        .slice(0, 3)
    : [];

  return (
    <Box sx={{ display: "flex", alignItems: "stretch", position: "relative" }}>
      {/* Timeline line + dot */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
          width: 40,
          mx: isRTL ? 1.5 : 0,
          mr: isRTL ? 0 : 1.5,
        }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: dotColor,
            border: "3px solid",
            borderColor: "background.paper",
            boxShadow: 1,
            flexShrink: 0,
          }}
        />
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              minHeight: 30,
              bgcolor: "action.disabled",
              mt: 0.5,
            }}
          />
        )}
      </Box>

      {/* Content card */}
      <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 2.5 }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 1.5, md: 2 },
            borderRadius: 2,
            cursor: "pointer",
            transition: "box-shadow 120ms ease",
            "&:hover": { boxShadow: 1 },
          }}
          onClick={onToggle}
        >
          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700}>
                {procedure.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {formDisplayName}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 1, flexWrap: "wrap", gap: 1, alignItems: "center" }}
              >
                {procedure.taken_by && (
                  <Typography variant="caption" color="text.secondary">
                    {procedure.taken_by.name}
                  </Typography>
                )}
                {procedure.percentage > 0 && (
                  <Chip
                    label={`${procedure.percentage}%`}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ height: 18, fontSize: 10 }}
                  />
                )}
                {procedure.status === "completed" && (
                  <Chip
                    label={t("completed")}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ height: 18, fontSize: 10 }}
                  />
                )}
              </Stack>

              {/* Preview of user-sent data for update procedures */}
              {previewEntries.length > 0 && (
                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: "divider" }}>
                  <Stack spacing={0.5}>
                    {previewEntries.map(([key, value]) => (
                      <Typography key={key} variant="caption" color="text.secondary" noWrap>
                        <strong>{getFormDataLabel(key, isRTL)}:</strong>{" "}
                        {formatFormDataValue(value)}
                      </Typography>
                    ))}
                    {Object.entries(procedure.form_data!).length > 3 && (
                      <Typography variant="caption" color="primary.main" fontWeight={600}>
                        {t("more")}...
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Box>

            <Stack direction="column" alignItems="flex-end" spacing={1} sx={{ flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ whiteSpace: "nowrap" }}>
                {formatDate(procedure.taken_at)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {formatTime(procedure.taken_at)}
              </Typography>
              <IconButton size="small" sx={{ p: 0.5, mt: 0.5 }}>
                {isExpanded ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
            </Stack>
          </Stack>
        </Paper>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Paper variant="outlined" sx={{ mt: 1, p: { xs: 1.5, md: 2 }, borderRadius: 2, bgcolor: "action.hover" }}>
            <Stack spacing={2}>
              {/* Form Data — prominently shown for update procedures */}
              <FormDataView formData={procedure.form_data} isRTL={isRTL} />

              {/* Approval Steps */}
              <ApprovalSteps steps={procedure.steps ?? []} isRTL={isRTL} />

              {/* Attachments */}
              <ProcedureAttachments attachments={procedure.attachments ?? []} isRTL={isRTL} />

              {/* Approved by */}
              {procedure.approved_by && (
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon sx={{ color: "success.main", fontSize: 18 }} />
                    <Typography variant="caption" color="text.secondary">
                      {isRTL ? "تم الاعتماد بواسطة" : "Approved by"}:{" "}
                      <strong>{procedure.approved_by.name}</strong>
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        </Collapse>
      </Box>
    </Box>
  );
}

export default function ProceduresCarousel({
  procedures,
  summary,
}: ProceduresCarouselProps) {
  const theme = useTheme();
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const isRTL = theme.direction === "rtl";
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!procedures.length) {
    return (
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {t("noProcedures")}
        </Typography>
      </Paper>
    );
  }

  const sortedProcedures = [...procedures].sort((a, b) => a.step_number - b.step_number);

  return (
    <Stack spacing={2.5}>
      {/* Header without progress bar */}
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ flexWrap: "wrap", gap: 1 }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            {t("proceduresLog")}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {summary?.last_action && (
              <Typography variant="caption" color="text.secondary">
                {t("lastAction")}: {summary.last_action}
              </Typography>
            )}
            <Chip
              label={`${sortedProcedures.length} ${t("procedures")}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Pipeline timeline */}
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Stack spacing={0}>
          {sortedProcedures.map((procedure, index) => (
            <TimelineItem
              key={procedure.id}
              procedure={procedure}
              isRTL={isRTL}
              isLast={index === sortedProcedures.length - 1}
              isExpanded={expandedId === procedure.id}
              onToggle={() =>
                setExpandedId((current) =>
                  current === procedure.id ? null : procedure.id,
                )
              }
            />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
