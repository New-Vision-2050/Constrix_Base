"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { toast } from "@/modules/table/hooks/use-toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { AttendanceReportsApi } from "@/services/api/hr-reports/attendance";
import {
  buildBilingualReportName,
  buildCreateReportApiBody,
} from "../utils/report-api-body";
import { parseListReportsResponse } from "../utils/normalize-report-list";
import type { CreatedAttendanceReport } from "../types";
import type { ReportWizardPayload } from "./report-wizard/types";
import {
  buildWizardPayloadSummary,
  type WizardPayloadSummaryTranslators,
} from "./report-wizard/payload-summary";
import AttendanceReportDetailDialog from "./AttendanceReportDetailDialog";
import ReportCreationWizardDialog from "./report-wizard/ReportCreationWizardDialog";

type DisplayRow = CreatedAttendanceReport & {
  summary: ReturnType<typeof buildWizardPayloadSummary>;
  createdDisplay: string;
  /** Resolved title for the report column (API name or wizard summary). */
  reportTitle: string;
};

const HeadlessCreatedReportsTable =
  HeadlessTableLayout<DisplayRow>("hr-attendance-created-reports");

export default function AttendanceReportTable() {
  const t = useTranslations("HRReports.attendanceReport.table");
  const tPage = useTranslations("HRReports.attendanceReport");
  const locale = useLocale();
  const theme = useTheme();
  const format = useFormatter();

  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const tRt = useTranslations(
    "HRReports.attendanceReport.wizard.reportTypes",
  );
  const tMonth = useTranslations("HRReports.attendanceReport.wizard.month");
  const tEmp = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData",
  );
  const tBranch = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.branches",
  );
  const tFilters = useTranslations(
    "HRReports.attendanceReport.wizard.filtersOptions",
  );
  const tReview = useTranslations(
    "HRReports.attendanceReport.wizard.reviewScreen",
  );

  const [wizardOpen, setWizardOpen] = useState(false);
  const [createdReports, setCreatedReports] = useState<CreatedAttendanceReport[]>(
    [],
  );
  const [listLoading, setListLoading] = useState(true);
  const [apiTotal, setApiTotal] = useState(0);
  const [listVersion, setListVersion] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailReportId, setDetailReportId] = useState<string | null>(null);

  const params = HeadlessCreatedReportsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const tr: WizardPayloadSummaryTranslators = useMemo(
    () => ({
      wizard: tWizard,
      reportTypes: tRt,
      month: tMonth,
      employeesData: tEmp,
      branches: tBranch,
      filtersOptions: tFilters,
      reviewScreen: tReview,
    }),
    [tWizard, tRt, tMonth, tEmp, tBranch, tFilters, tReview],
  );

  const displayRows = useMemo((): DisplayRow[] => {
    return createdReports.map((r) => {
      const summary = buildWizardPayloadSummary(r.payload, tr);
      const lang =
        (locale ?? "en").split("-")[0]?.toLowerCase() ?? "en";
      const preferAr = lang === "ar";
      const fromApi = preferAr
        ? r.apiName?.ar ?? r.apiName?.en
        : r.apiName?.en ?? r.apiName?.ar;
      const reportTitle =
        typeof fromApi === "string" && fromApi.trim() !== ""
          ? fromApi.trim()
          : summary.reportTypesLabel;
      return {
        ...r,
        summary,
        reportTitle,
        createdDisplay: format.dateTime(new Date(r.createdAt), {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };
    });
  }, [createdReports, tr, format, locale]);

  const totalItems = apiTotal;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit) || 1);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    AttendanceReportsApi.getList({
      page: params.page,
      per_page: params.limit,
    })
      .then((res) => res.data)
      .then((raw) => {
        if (cancelled) return;
        const { items, total } = parseListReportsResponse(raw);
        setCreatedReports(items);
        setApiTotal(total);
      })
      .catch((err) => {
        if (cancelled) return;
        setCreatedReports([]);
        setApiTotal(0);
        toast({
          variant: "destructive",
          title: t("fetchReportsErrorTitle"),
          description:
            getErrorMessage(err) ?? t("fetchReportsErrorDesc"),
        });
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.page, params.limit, listVersion, t]);

  useEffect(() => {
    if (params.page > totalPages) {
      params.setPage(totalPages);
    }
  }, [params.page, totalPages, params]);

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
        description:
          getErrorMessage(err) ?? t("createReportErrorDesc"),
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
        description:
          getErrorMessage(err) ?? t("saveTemplateErrorDesc"),
      });
      throw err;
    }
  };

  const ellipsisCell = (text: string, maxWidth: number) => (
    <Tooltip title={text}>
      <Typography
        variant="body2"
        component="span"
        className="p-2 text-sm"
        sx={{ display: "block", maxWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {text}
      </Typography>
    </Tooltip>
  );

  const columns = useMemo(
    () => [
      {
        key: "createdDisplay",
        name: t("colCreated"),
        sortable: false,
        render: (row: DisplayRow) => (
          <span className="p-2 text-sm">{row.createdDisplay}</span>
        ),
      },
      {
        key: "period",
        name: t("colPeriod"),
        sortable: false,
        render: (row: DisplayRow) => (
          <span className="p-2 text-sm">{row.summary.periodLabel}</span>
        ),
      },
      {
        key: "reportTypes",
        name: t("colReportTypes"),
        sortable: false,
        render: (row: DisplayRow) =>
          ellipsisCell(row.reportTitle, 260),
      },
      {
        key: "branch",
        name: t("colBranch"),
        sortable: false,
        render: (row: DisplayRow) => (
          <span className="p-2 text-sm">{row.summary.branchLabel}</span>
        ),
      },
      {
        key: "employeeStatus",
        name: t("colEmployeeStatus"),
        sortable: false,
        render: (row: DisplayRow) => (
          <span className="p-2 text-sm">{row.summary.employeeStatusLabel}</span>
        ),
      },
      {
        key: "export",
        name: t("colExport"),
        sortable: false,
        render: (row: DisplayRow) => (
          <span className="p-2 text-sm font-medium">{row.summary.exportLabel}</span>
        ),
      },
      {
        key: "language",
        name: t("colLanguage"),
        sortable: false,
        render: (row: DisplayRow) => (
          <span className="p-2 text-sm">{row.summary.languageLabel}</span>
        ),
      },
      {
        key: "email",
        name: t("colEmail"),
        sortable: false,
        render: (row: DisplayRow) => (
          <Chip
            size="small"
            label={row.summary.emailLabel}
            color={row.payload.step5.autoEmail ? "success" : "default"}
            variant={theme.palette.mode === "dark" ? "outlined" : "filled"}
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        key: "sorting",
        name: t("colSorting"),
        sortable: false,
        render: (row: DisplayRow) =>
          ellipsisCell(row.summary.sortingLabel, 220),
      },
      {
        key: "actions",
        name: t("colActions"),
        sortable: false,
        render: (row: DisplayRow) => (
          <Tooltip title={t("viewReport")}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              aria-label={t("viewReport")}
              endIcon={<VisibilityOutlinedIcon fontSize="small" />}
              sx={{ whiteSpace: "nowrap" }}
              onClick={() => {
                setDetailReportId(row.id);
                setDetailDialogOpen(true);
              }}
            >
              {t("viewReport")}
            </Button>
          </Tooltip>
        ),
      },
    ],
    [t, theme.palette.mode],
  );

  const state = HeadlessCreatedReportsTable.useTableState({
    data: displayRows,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: false,
    getRowId: (row) => row.id,
    loading: listLoading,
    searchable: false,
    filtered: false,
  });

  return (
    <Box component={Paper} elevation={0} sx={{ p: 0, border: 1, borderColor: "divider", borderRadius: 2 }}>
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
          />
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
    </Box>
  );
}
