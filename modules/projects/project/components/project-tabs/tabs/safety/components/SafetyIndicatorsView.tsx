"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CheckCircleOutline,
  ErrorOutline,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { useLocale, useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectSafety } from "@/modules/projects/project/query/useProjectSafety";
import {
  EMPTY_SAFETY_INDICATOR_FILTERS,
  computeSafetyIndicators,
  filterVisitsForIndicators,
  getRatingBand,
  getRatingColor,
  type SafetyIndicatorFilters,
} from "../utils/computeSafetyIndicators";

const CHART_COLORS = [
  "#14B8A6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#EAB308",
  "#0EA5E9",
  "#22C55E",
];

const RADIAN = Math.PI / 180;

type PieInsideLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  payload?: { percentage?: number };
};

function PieInsideLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}: PieInsideLabelProps) {
  if (
    cx == null ||
    cy == null ||
    midAngle == null ||
    outerRadius == null ||
    (percent ?? 0) < 0.04
  ) {
    return null;
  }

  const radius = (innerRadius ?? 0) + (outerRadius - (innerRadius ?? 0)) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const label =
    payload?.percentage != null
      ? `${payload.percentage}%`
      : `${Math.round((percent ?? 0) * 1000) / 10}%`;

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {label}
    </text>
  );
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  const theme = useTheme();
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: 2,
        px: 1.5,
        py: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="caption" fontWeight={600}>
        {entry.payload?.label ?? entry.name}
      </Typography>
      <Typography variant="caption" sx={{ display: "block" }}>
        {entry.value}
        {entry.payload?.percentage != null ? ` (${entry.payload.percentage}%)` : ""}
      </Typography>
    </Box>
  );
}

function IndicatorKpiCard({
  title,
  value,
  suffix,
  statusLabel,
  statusColor,
  sparklineData,
  sparklineColor,
  icon,
}: {
  title: string;
  value: number | string;
  suffix?: string;
  statusLabel: string;
  statusColor: string;
  sparklineData: { value: number }[];
  sparklineColor: string;
  icon: React.ReactNode;
}) {
  const theme = useTheme();
  const gradientId = `spark-${title.replace(/\s/g, "-")}`;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: alpha(theme.palette.background.paper, 0.4),
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(statusColor, 0.12),
            color: statusColor,
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={600} textAlign="end">
          {title}
        </Typography>
      </Stack>

      <Typography variant="h4" fontWeight={800} sx={{ mt: 1.5, lineHeight: 1.1 }}>
        {value}
        {suffix}
      </Typography>

      <Box sx={{ flex: 1, minHeight: 48, mt: 1 }}>
        {sparklineData.length > 1 ? (
          <ResponsiveContainer width="100%" height={48}>
            <AreaChart data={sparklineData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={sparklineColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Chip
          label={statusLabel}
          size="small"
          sx={{
            bgcolor: alpha(statusColor, 0.15),
            color: statusColor,
            fontWeight: 700,
            borderRadius: 1.5,
          }}
        />
      </Box>
    </Paper>
  );
}

function AssessmentLegend({ t }: { t: (key: string) => string }) {
  const items = [
    { key: "excellent", color: getRatingColor("excellent") },
    { key: "good", color: getRatingColor("good") },
    { key: "attention", color: getRatingColor("attention") },
    { key: "critical", color: getRatingColor("critical") },
  ] as const;

  return (
    <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
      {items.map((item) => (
        <Stack key={item.key} direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
          <Typography variant="caption" color="text.secondary">
            {t(`charts.legend.${item.key}`)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default function SafetyIndicatorsView() {
  const { projectId } = useProject();
  const locale = useLocale();
  const theme = useTheme();
  const isRtl = theme.direction === "rtl" || locale.startsWith("ar");
  const t = useTranslations("project.safetyTab.indicators");
  const tFilters = useTranslations("project.safetyTab.indicators.filters");

  const [filters, setFilters] = useState<SafetyIndicatorFilters>(
    EMPTY_SAFETY_INDICATOR_FILTERS,
  );

  const safetyQuery = useProjectSafety(projectId);
  const allRows = safetyQuery.data ?? [];

  const contractorOptions = useMemo(
    () =>
      [...new Set(allRows.map((row) => row.contractor).filter(Boolean))].sort(),
    [allRows],
  );

  const consultantOptions = useMemo(
    () =>
      [...new Set(allRows.map((row) => row.consultant).filter(Boolean))].sort(),
    [allRows],
  );

  const filteredRows = useMemo(
    () => filterVisitsForIndicators(allRows, filters),
    [allRows, filters],
  );

  const indicators = useMemo(
    () => computeSafetyIndicators(filteredRows, locale),
    [filteredRows, locale],
  );

  const updateFilter = <K extends keyof SafetyIndicatorFilters>(
    key: K,
    value: SafetyIndicatorFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const overallBand = getRatingBand(indicators.overallRating);
  const overallColor = getRatingColor(overallBand);
  const overallStatusKey =
    overallBand === "critical"
      ? "critical"
      : overallBand === "attention"
        ? "attention"
        : "good";

  const committedStatusKey = indicators.committedSites > 0 ? "good" : "attention";
  const highRiskStatusKey =
    indicators.highRiskObservations === 0
      ? "good"
      : indicators.highRiskObservations <= 2
        ? "attention"
        : "critical";
  const repeatedStatusKey =
    indicators.repeatedViolations === 0
      ? "good"
      : indicators.repeatedViolations <= 3
        ? "attention"
        : "critical";

  const statusColors = {
    good: getRatingColor("excellent"),
    attention: getRatingColor("attention"),
    critical: getRatingColor("critical"),
  };

  const assessmentChartData = indicators.monthlyAssessment.map((item) => ({
    name: item.label,
    percentage: item.percentage,
    fill: getRatingColor(item.band),
  }));

  const contractorPieData = indicators.contractorConsultantErrors.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const violationsPieData = indicators.topViolations.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const assessmentBarCount = assessmentChartData.length;
  const assessmentChartMargins = { top: 8, bottom: 24, left: 8, right: 0 };
  const assessmentChartHeight = Math.max(260, assessmentBarCount * 48);
  const assessmentPlotHeight =
    assessmentChartHeight -
    assessmentChartMargins.top -
    assessmentChartMargins.bottom;
  const assessmentBandSize =
    assessmentBarCount > 0 ? assessmentPlotHeight / assessmentBarCount : 0;

  if (!projectId) {
    return null;
  }

  return (
    <Box>
      {safetyQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
        </Alert>
      ) : null}

      <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          {t("filtersTitle")}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              type="date"
              label={tFilters("dateFrom")}
              value={filters.dateFrom}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              type="date"
              label={tFilters("dateTo")}
              value={filters.dateTo}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("contractor")}
              value={filters.contractor}
              onChange={(e) => updateFilter("contractor", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {contractorOptions.map((contractor) => (
                <MenuItem key={contractor} value={contractor}>
                  {contractor}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("consultant")}
              value={filters.consultant}
              onChange={(e) => updateFilter("consultant", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {consultantOptions.map((consultant) => (
                <MenuItem key={consultant} value={consultant}>
                  {consultant}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {safetyQuery.isLoading ? (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[1, 2, 3, 4].map((key) => (
            <Grid key={key} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <IndicatorKpiCard
              title={t("kpis.overallRating")}
              value={`${indicators.overallRating}%`}
              statusLabel={t(`status.${overallStatusKey}`)}
              statusColor={overallColor}
              sparklineData={indicators.ratingSparkline}
              sparklineColor={overallColor}
              icon={<CheckCircleOutline fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <IndicatorKpiCard
              title={t("kpis.committedSites")}
              value={indicators.committedSites}
              statusLabel={t(`status.${committedStatusKey}`)}
              statusColor={statusColors[committedStatusKey]}
              sparklineData={indicators.committedSparkline}
              sparklineColor={statusColors[committedStatusKey]}
              icon={<CheckCircleOutline fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <IndicatorKpiCard
              title={t("kpis.highRiskObservations")}
              value={indicators.highRiskObservations}
              statusLabel={t(`status.${highRiskStatusKey}`)}
              statusColor={statusColors[highRiskStatusKey]}
              sparklineData={indicators.highRiskSparkline}
              sparklineColor={statusColors[highRiskStatusKey]}
              icon={<ErrorOutline fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <IndicatorKpiCard
              title={t("kpis.repeatedViolations")}
              value={indicators.repeatedViolations}
              statusLabel={t(`status.${repeatedStatusKey}`)}
              statusColor={statusColors[repeatedStatusKey]}
              sparklineData={indicators.repeatedSparkline}
              sparklineColor={statusColors[repeatedStatusKey]}
              icon={<WarningAmberOutlined fontSize="small" />}
            />
          </Grid>
        </Grid>
      )}

      <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          {t("charts.siteAssessment")}
        </Typography>
        <AssessmentLegend t={t} />

        {safetyQuery.isLoading ? (
          <Skeleton variant="rounded" height={280} />
        ) : assessmentChartData.length ? (
          <Box
            sx={{
              display: "grid",
              width: "100%",
              direction: "rtl",
              gap: 0.75,
              gridTemplateColumns: isRtl
                ? "minmax(0, 1fr) auto"
                : "auto minmax(0, 1fr)",
              gridTemplateAreas: isRtl ? '"chart labels"' : '"labels chart"',
            }}
          >
            <Box sx={{ gridArea: "chart", minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={assessmentChartHeight}>
                <BarChart
                  data={assessmentChartData}
                  layout="vertical"
                  margin={assessmentChartMargins}
                  barCategoryGap={4}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    reversed={isRtl}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis type="category" dataKey="name" hide width={0} />
                  <RTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0]?.payload;
                      return (
                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.background.paper, 0.95),
                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            borderRadius: 2,
                            px: 1.5,
                            py: 1,
                          }}
                        >
                          <Typography variant="caption" fontWeight={600}>
                            {item?.name}: {item?.percentage}%
                          </Typography>
                        </Box>
                      );
                    }}
                  />
                  <Bar
                    dataKey="percentage"
                    radius={isRtl ? [4, 0, 0, 4] : [0, 4, 4, 0]}
                    barSize={22}
                  >
                    {assessmentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box
              sx={{
                gridArea: "labels",
                position: "relative",
                width: 96,
                height: assessmentChartHeight,
              }}
            >
              {assessmentChartData.map((item, index) => (
                <Typography
                  key={item.name}
                  variant="caption"
                  sx={{
                    position: "absolute",
                    top:
                      assessmentChartMargins.top +
                      assessmentBandSize * index +
                      (assessmentBandSize - 14) / 2,
                    right: isRtl ? 0 : undefined,
                    left: isRtl ? 0 : 0,
                    direction: isRtl ? "rtl" : "ltr",
                    textAlign: isRtl ? "right" : "left",
                    fontSize: 11,
                    color: "text.secondary",
                    lineHeight: 1.2,
                  }}
                >
                  {item.name}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : (
          <EmptyChart message={t("noData")} />
        )}
      </Paper>

      <Grid container spacing={2} direction="row-reverse">
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              {t("charts.topViolations")}
            </Typography>

            {safetyQuery.isLoading ? (
              <Skeleton variant="rounded" height={280} />
            ) : violationsPieData.length ? (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                  {violationsPieData.map((item) => (
                    <Stack key={item.code ?? item.label} direction="row" spacing={1} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: item.fill,
                          mt: 0.6,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Box sx={{ width: "100%", maxWidth: 280, height: 260, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={violationsPieData}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label={PieInsideLabel}
                        labelLine={false}
                        stroke={theme.palette.background.paper}
                        strokeWidth={2}
                      >
                        {violationsPieData.map((entry, index) => (
                          <Cell key={`violation-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RTooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>                
              </Stack>
            ) : (
              <EmptyChart message={t("noData")} />
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              {t("charts.contractorConsultantErrors")}
            </Typography>

            {safetyQuery.isLoading ? (
              <Skeleton variant="rounded" height={280} />
            ) : contractorPieData.length ? (
              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contractorPieData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={105}
                      label={PieInsideLabel}
                      labelLine={false}
                      stroke={theme.palette.background.paper}
                      strokeWidth={2}
                    >
                      {contractorPieData.map((entry, index) => (
                        <Cell key={`contractor-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RTooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <EmptyChart message={t("noData")} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
