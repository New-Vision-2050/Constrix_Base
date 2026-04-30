"use client";

import React, { useEffect, useMemo, useState } from "react";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Pagination,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "@/modules/table/hooks/use-toast";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  AttendanceReportsApi,
  type ReportTemplatePickRow,
} from "@/services/api/hr-reports/attendance";
import { parseTemplatesListResponse } from "../../../utils/normalize-templates-list";

const SCRATCH_VALUE = "__scratch__";

export type WizardStepTemplatePickProps = {
  dialogOpen: boolean;
  selectionValue: string;
  onSelectScratch: () => void;
  onSelectTemplateRow: (row: ReportTemplatePickRow) => void;
};

function templateDisplayLabel(
  row: ReportTemplatePickRow,
  locale: string,
  fallback: (id: string) => string,
): string {
  const lang = (locale ?? "en").split("-")[0]?.toLowerCase() ?? "en";
  const preferAr = lang === "ar";
  const fromApi = preferAr
    ? row.apiName?.ar ?? row.apiName?.en
    : row.apiName?.en ?? row.apiName?.ar;
  if (typeof fromApi === "string" && fromApi.trim() !== "") {
    return fromApi.trim();
  }
  return fallback(row.id);
}

type ChoiceCardProps = {
  selected: boolean;
  onClick?: () => void;
  title: string;
  hint?: string;
  icon: React.ReactNode;
  interactive?: boolean;
  sx?: React.ComponentProps<typeof Card>["sx"];
};

function ChoiceCard({
  selected,
  onClick,
  title,
  hint,
  icon,
  interactive = true,
  sx: sxProp,
}: ChoiceCardProps) {
  const theme = useTheme();

  const cardSx = [
    {
      borderRadius: 2,
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: selected ? "primary.main" : "divider",
      bgcolor: selected
        ? alpha(
            theme.palette.primary.main,
            theme.palette.mode === "dark" ? 0.12 : 0.06,
          )
        : "background.paper",
      transition:
        "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
      overflow: "hidden",
      ...(interactive
        ? {
            "&:hover": {
              borderColor: selected
                ? "primary.main"
                : alpha(theme.palette.text.primary, 0.22),
              boxShadow: theme.shadows[selected ? 4 : 2],
            },
          }
        : {}),
    },
    ...(sxProp ? [sxProp] : []),
  ];

  const body = (
    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            color: selected ? "primary.main" : "text.secondary",
            mt: 0.15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden
        >
          {selected ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 26 }} />
          ) : (
            icon
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} component="div">
            {title}
          </Typography>
          {hint ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block", lineHeight: 1.45 }}
            >
              {hint}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </CardContent>
  );

  return (
    <Card elevation={0} sx={cardSx}>
      {interactive ? (
        <CardActionArea
          onClick={onClick}
          sx={{
            alignItems: "stretch",
            textAlign: "start",
          }}
        >
          {body}
        </CardActionArea>
      ) : (
        body
      )}
    </Card>
  );
}

export default function WizardStepTemplatePick({
  dialogOpen,
  selectionValue,
  onSelectScratch,
  onSelectTemplateRow,
}: WizardStepTemplatePickProps) {
  const t = useTranslations("HRReports.attendanceReport.wizard.templatePick");
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [rows, setRows] = useState<ReportTemplatePickRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [frozenTemplateRow, setFrozenTemplateRow] =
    useState<ReportTemplatePickRow | null>(null);

  useEffect(() => {
    if (!dialogOpen) return;
    let cancelled = false;
    setLoading(true);
    AttendanceReportsApi.getTemplatesList({ page, per_page: perPage })
      .then((res) => res.data)
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseTemplatesListResponse(raw);
        setRows(parsed.items);
        setTotal(parsed.total);
      })
      .catch((err) => {
        if (cancelled) return;
        setRows([]);
        setTotal(0);
        toast({
          variant: "destructive",
          title: t("templatesLoadErrorTitle"),
          description:
            getErrorMessage(err) ?? t("templatesLoadErrorDesc"),
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dialogOpen, page, t]);

  const pageCount = Math.max(1, Math.ceil(total / perPage) || 1);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const templateTitle = useMemo(
    () => (row: ReportTemplatePickRow) =>
      templateDisplayLabel(row, locale, (id) => t("unnamedTemplate", { id })),
    [locale, t],
  );

  useEffect(() => {
    if (selectionValue === SCRATCH_VALUE) {
      setFrozenTemplateRow(null);
      return;
    }
    const onPage = rows.find((r) => r.id === selectionValue);
    if (onPage) setFrozenTemplateRow(onPage);
  }, [selectionValue, rows]);

  const showOffPageCard =
    selectionValue !== SCRATCH_VALUE &&
    !rows.some((r) => r.id === selectionValue);

  const offPageTitle =
    selectionValue !== SCRATCH_VALUE &&
    !rows.some((r) => r.id === selectionValue) &&
    frozenTemplateRow?.id === selectionValue
      ? templateDisplayLabel(frozenTemplateRow, locale, (id) =>
          t("unnamedTemplate", { id }),
        )
      : selectionValue !== SCRATCH_VALUE &&
          !rows.some((r) => r.id === selectionValue)
        ? t("keptTemplateChoice", { id: selectionValue })
        : null;

  const offPageHint =
    frozenTemplateRow?.id === selectionValue
      ? t("selectedFromOtherPageHint")
      : undefined;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {t("title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t("subtitle")}
        </Typography>
      </Box>

      {showOffPageCard && offPageTitle ? (
        <ChoiceCard
          interactive={false}
          selected
          title={offPageTitle}
          hint={offPageHint}
          icon={<ArticleOutlinedIcon sx={{ fontSize: 26 }} />}
        />
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <ChoiceCard
          sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}
          selected={selectionValue === SCRATCH_VALUE}
          onClick={() => onSelectScratch()}
          title={t("startFromScratch")}
          hint={t("scratchCardHint")}
          icon={<NoteAddOutlinedIcon sx={{ fontSize: 26 }} />}
        />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              minHeight: 120,
              gridColumn: { xs: "1", sm: "1 / -1" },
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              borderStyle: "dashed",
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              {t("templatesLoading")}
            </Typography>
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {t("noTemplates")}
            </Alert>
          </Box>
        ) : (
          rows.map((row) => (
            <ChoiceCard
              key={row.id}
              selected={selectionValue === row.id}
              onClick={() => onSelectTemplateRow(row)}
              title={templateTitle(row)}
              hint={t("templateCardHint")}
              icon={<ArticleOutlinedIcon sx={{ fontSize: 26 }} />}
            />
          ))
        )}
      </Box>

      {!loading && rows.length > 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 0.5 }}>
          <Pagination
            color="primary"
            page={page}
            count={pageCount}
            onChange={(_, p) => setPage(p)}
            size="small"
            showFirstButton
            showLastButton
          />
        </Box>
      ) : null}
    </Box>
  );
}

export const WIZARD_TEMPLATE_SCRATCH_VALUE = SCRATCH_VALUE;
