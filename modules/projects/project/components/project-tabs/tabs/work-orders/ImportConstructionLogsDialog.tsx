"use client";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import {
  isImportConstructionLogTerminal,
  useImportConstructionLog,
} from "@/modules/projects/project/query/useImportConstructionLog";

interface ImportConstructionLogsDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string | undefined;
  importId: string | null;
  emptyDash: string;
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value == null || value === "" ? "—" : String(value)}
      </Typography>
    </Stack>
  );
}

function statusChipColor(
  status?: string | null,
): "default" | "success" | "warning" | "error" | "info" {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized === "completed") return "success";
  if (normalized === "completed_with_errors") return "warning";
  if (normalized === "failed" || normalized === "cancelled") return "error";
  if (normalized.includes("progress") || normalized === "pending") return "info";
  return "default";
}

export default function ImportConstructionLogsDialog({
  open,
  onClose,
  projectId,
  importId,
  emptyDash,
}: ImportConstructionLogsDialogProps) {
  const t = useTranslations("project.workOrdersTab.updateLogs");
  const { data, isLoading, isError, error, isFetching } = useImportConstructionLog(
    open ? projectId : undefined,
    open ? importId : null,
  );

  const rowErrors = data?.row_errors ?? [];
  const isRunning =
    Boolean(data?.status) && !isImportConstructionLogTerminal(data?.status);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {t("title")}
        <IconButton
          onClick={onClose}
          aria-label={t("close")}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {!importId ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 4, textAlign: "center" }}
          >
            {t("empty")}
          </Typography>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : isError ? (
          <Alert severity="error">
            {(error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? t("loadError")}
          </Alert>
        ) : !data ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 4, textAlign: "center" }}
          >
            {t("empty")}
          </Typography>
        ) : (
          <Stack spacing={2.5}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                size="small"
                color={statusChipColor(data.status)}
                label={t("statusValue", { status: data.status })}
              />
              {isRunning || isFetching ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={14} />
                  <Typography variant="caption" color="text.secondary">
                    {t("refreshing")}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <SummaryItem
                  label={t("originalFilename")}
                  value={data.original_filename}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <SummaryItem label={t("totalRows")} value={data.total_rows} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <SummaryItem
                  label={t("processedRows")}
                  value={data.processed_rows}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <SummaryItem
                  label={t("updatedRows")}
                  value={data.updated_rows}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <SummaryItem
                  label={t("skippedRows")}
                  value={data.skipped_rows}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <SummaryItem label={t("startedAt")} value={data.started_at} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <SummaryItem label={t("finishedAt")} value={data.finished_at} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <SummaryItem label={t("createdAt")} value={data.created_at} />
              </Grid>
            </Grid>

            {data.failure_reason ? (
              <Alert severity="error">{data.failure_reason}</Alert>
            ) : null}

            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                {t("rowErrorsTitle", { count: rowErrors.length })}
              </Typography>
              {rowErrors.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t("noRowErrors")}
                </Typography>
              ) : (
                <TableContainer sx={{ maxHeight: 360 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "action.hover" }}>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                          {t("row")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                          {t("workOrderName")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("reason")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowErrors.map((error, index) => (
                        <TableRow key={`${error.row}-${index}`}>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {error.row}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {error.work_order_name?.trim() || emptyDash}
                          </TableCell>
                          <TableCell>{error.reason || emptyDash}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
