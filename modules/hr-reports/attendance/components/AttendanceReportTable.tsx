"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useFormatter, useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { toast } from "@/modules/table/hooks/use-toast";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  AttendanceReportsApi,
  type attendanceReport,
} from "@/services/api/hr-reports/attendance";
import {
  buildBilingualReportName,
  buildCreateReportApiBody,
} from "../utils/report-api-body";
import {
  attendanceReportExportLabel,
  attendanceReportPeriodLabel,
  attendanceReportTypesLabel,
  parseAttendanceReportListResponse,
} from "../utils/format-attendance-report-list";
import type { ReportWizardPayload } from "./report-wizard/types";
import AttendanceReportDetailDialog from "./AttendanceReportDetailDialog";
import DeleteAttendanceReportDialog from "./DeleteAttendanceReportDialog";
import ReportCreationWizardDialog from "./report-wizard/ReportCreationWizardDialog";
import { clampPastDateRange, formatDateYYYYMMDD } from "./report-wizard/step1-date-range";
import CustomMenu from "@/components/headless/custom-menu";

const HeadlessCreatedReportsTable = HeadlessTableLayout<attendanceReport>(
  "hr-attendance-created-reports",
);

export default function AttendanceReportTable() {
  const t = useTranslations("HRReports.attendanceReport.table");
  const tPage = useTranslations("HRReports.attendanceReport");
  const format = useFormatter();

  const tDeleteConfirm = useTranslations("common.deleteConfirmation");
  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const tRt = useTranslations("HRReports.attendanceReport.wizard.reportTypes");
  const tMonth = useTranslations("HRReports.attendanceReport.wizard.month");
  const tLabels = useTranslations("labels");

  const [wizardOpen, setWizardOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reports, setReports] = useState<attendanceReport[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [listVersion, setListVersion] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailReportId, setDetailReportId] = useState<string | null>(null);
  const [reportToDeleteId, setReportToDeleteId] = useState<string | null>(null);
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState(false);

  const params = HeadlessCreatedReportsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const todayIso = formatDateYYYYMMDD(new Date());
  const periodDateFromMax =
    dateTo && dateTo < todayIso ? dateTo : todayIso;
  const periodDateToMin = dateFrom || todayIso;

  const formatCreatedAt = useCallback(
    (iso: string) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return format.dateTime(d, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    },
    [format],
  );

  const listDateFilters = useMemo(() => {
    if (!dateFrom && !dateTo) return {};
    const clamped = clampPastDateRange(dateFrom, dateTo);
    return {
      ...(clamped.dateFrom ? { date_from: clamped.dateFrom } : {}),
      ...(clamped.dateTo ? { date_to: clamped.dateTo } : {}),
      status: "ready" as const,
    };
  }, [dateFrom, dateTo]);

  const hasDateFilter = Boolean(dateFrom || dateTo);

  const handleClearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    params.setPage(1);
  };

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);

    AttendanceReportsApi.getList({
      page: params.page,
      per_page: params.limit,
      ...listDateFilters,
    })
      .then((res) => {
        if (cancelled) return;
        const parsed = parseAttendanceReportListResponse(res.data);
        setReports(parsed.items);
        setTotalItems(parsed.totalItems);
        setTotalPages(parsed.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        setReports([]);
        setTotalItems(0);
        setTotalPages(1);
        toast({
          variant: "destructive",
          title: t("fetchReportsErrorTitle"),
          description: getErrorMessage(err) ?? t("fetchReportsErrorDesc"),
        });
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.page, params.limit, listVersion, listDateFilters, t]);

  useEffect(() => {
    if (listLoading) return;
    if (params.page > totalPages) {
      params.setPage(totalPages);
    }
  }, [params.page, totalPages, listLoading, params]);

  const handleWizardSubmit = async (payload: ReportWizardPayload) => {
    const name = buildBilingualReportName(payload);
    const body = buildCreateReportApiBody(payload, name);
    try {
      await AttendanceReportsApi.create(body);
      toast({
        title: t("createReportSuccessTitle"),
        description: t("createReportSuccessDesc"),
      });
      setListVersion((v) => v + 1);
      params.setPage(1);
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("createReportErrorTitle"),
        description: getErrorMessage(err) ?? t("createReportErrorDesc"),
      });
      throw err;
    }
  };

  const handleSaveWizardTemplate = async (payload: ReportWizardPayload) => {
    const name = buildBilingualReportName(payload);
    const body = buildCreateReportApiBody(payload, name);
    try {
      await AttendanceReportsApi.saveTemplate(body);
      toast({
        title: t("saveTemplateSuccessTitle"),
        description: t("saveTemplateSuccessDesc"),
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("saveTemplateErrorTitle"),
        description: getErrorMessage(err) ?? t("saveTemplateErrorDesc"),
      });
      throw err;
    }
  };

  const handleConfirmDeleteReport = async () => {
    if (!reportToDeleteId) return;
    setDeleteConfirmLoading(true);
    try {
      await AttendanceReportsApi.delete(reportToDeleteId);
      toast({
        title: t("deleteReportSuccessTitle"),
        description: t("deleteReportSuccessDesc"),
      });
      setListVersion((v) => v + 1);
      params.setPage(1);
      setReportToDeleteId(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("deleteReportErrorTitle"),
        description: getErrorMessage(err) ?? t("deleteReportErrorDesc"),
      });
    } finally {
      setDeleteConfirmLoading(false);
    }
  };

  const ellipsisCell = (text: string, maxWidth: number) => (
    <Tooltip title={text}>
      <Typography
        variant="body2"
        component="span"
        className="p-2 text-sm"
        sx={{
          display: "block",
          maxWidth,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );

  const columns = useMemo(
    () => [
      {
        key: "serial_number",
        name: t("colSerialNumber"),
        sortable: false,
        render: (row: attendanceReport) => (
          <span className="p-2 text-sm">
            {row.serial_number}
          </span>
        ),
      },
      {
        key: "created_at",
        name: t("colCreated"),
        sortable: false,
        render: (row: attendanceReport) => (
          <span className="p-2 text-sm">
            {formatCreatedAt(row.created_at || row.generated_at)}
          </span>
        ),
      },
      {
        key: "period",
        name: t("colPeriod"),
        sortable: false,
        render: (row: attendanceReport) => (
          <span className="p-2 text-sm">
            {attendanceReportPeriodLabel(row, tMonth, tWizard)}
          </span>
        ),
      },
      {
        key: "report_types",
        name: t("colReportTypes"),
        sortable: false,
        render: (row: attendanceReport) =>
          ellipsisCell(attendanceReportTypesLabel(row, tRt), 260),
      },
      {
        key: "branch",
        name: t("colBranch"),
        sortable: false,
        render: (row: attendanceReport) => (
          <span className="p-2 text-sm">{row.branch?.trim() || "—"}</span>
        ),
      },
      {
        key: "export_format",
        name: t("colExport"),
        sortable: false,
        render: (row: attendanceReport) => (
          <span className="p-2 text-sm font-medium">
            {attendanceReportExportLabel(row.export_format, tWizard)}
          </span>
        ),
      },
      {
        key: "actions",
        name: t("colActions"),
        sortable: false,
        render: (row: attendanceReport) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                {t("colActions")}
              </Button>
            )}
          >
            <MenuItem
              onClick={() => {
                setDetailReportId(row.id);
                setDetailDialogOpen(true);
              }}
            >
              {t("viewReport")}
              <VisibilityOutlinedIcon
                fontSize="small"
                color="primary"
                className="mr-2"
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setReportToDeleteId(row.id);
              }}
            >
              {tDeleteConfirm("delete")}
              <DeleteIcon fontSize="small" color="error" className="mr-2" />
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [
      t,
      tDeleteConfirm,
      tMonth,
      tWizard,
      tRt,
      formatCreatedAt,
    ],
  );

  const state = HeadlessCreatedReportsTable.useTableState({
    data: reports,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: false,
    getRowId: (row) => row.id,
    loading: listLoading,
    searchable: false,
    filtered: hasDateFilter,
  });

  return (
    <Box
      component={Paper}
      elevation={0}
      sx={{ p: 0, border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {t("createdReportsTitle")}
        </Typography>
        {totalItems === 0 && !listLoading ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("emptyReports")}
          </Typography>
        ) : null}
      </Box>
      <HeadlessCreatedReportsTable
        filters={
          <HeadlessCreatedReportsTable.TopActions
            state={state}
            customActions={
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setWizardOpen(true)}
              >
                {tPage("createAttendanceReport")}
              </Button>
            }
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ mb: 1 }}
            >
              <TextField
                type="date"
                size="small"
                label={tWizard("periodDateFrom")}
                value={dateFrom}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) {
                    setDateFrom("");
                    params.setPage(1);
                    return;
                  }
                  const clampedFrom = v > todayIso ? todayIso : v;
                  const clamped = clampPastDateRange(clampedFrom, dateTo);
                  setDateFrom(clamped.dateFrom);
                  setDateTo(clamped.dateTo);
                  params.setPage(1);
                }}
                slotProps={{
                  htmlInput: { max: periodDateFromMax },
                  inputLabel: { shrink: true },
                }}
                sx={{ minWidth: 160 }}
              />
              <TextField
                type="date"
                size="small"
                label={tWizard("periodDateTo")}
                value={dateTo}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) {
                    setDateTo("");
                    params.setPage(1);
                    return;
                  }
                  const clampedTo = v > todayIso ? todayIso : v;
                  const clamped = clampPastDateRange(dateFrom, clampedTo);
                  setDateFrom(clamped.dateFrom);
                  setDateTo(clamped.dateTo);
                  params.setPage(1);
                }}
                slotProps={{
                  htmlInput: { min: periodDateToMin, max: todayIso },
                  inputLabel: { shrink: true },
                }}
                sx={{ minWidth: 160 }}
              />
              {hasDateFilter ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearDateFilter}
                >
                  {tLabels("reset")}
                </Button>
              ) : null}
            </Stack>
          </HeadlessCreatedReportsTable.TopActions>
        }
        table={
          <HeadlessCreatedReportsTable.Table
            state={state}
            loadingOptions={{ rows: 6 }}
          />
        }
        pagination={<HeadlessCreatedReportsTable.Pagination state={state} />}
      />
      <AttendanceReportDetailDialog
        open={detailDialogOpen}
        reportId={detailReportId}
        onClose={() => {
          setDetailDialogOpen(false);
          setDetailReportId(null);
        }}
      />
      <ReportCreationWizardDialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmit={handleWizardSubmit}
        onSaveTemplate={handleSaveWizardTemplate}
      />
      <DeleteAttendanceReportDialog
        open={reportToDeleteId !== null}
        loading={deleteConfirmLoading}
        onClose={() => setReportToDeleteId(null)}
        onConfirm={handleConfirmDeleteReport}
      />
    </Box>
  );
}
