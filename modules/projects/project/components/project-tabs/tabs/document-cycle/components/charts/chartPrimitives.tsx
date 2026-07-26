"use client";

import { useMemo } from "react";
import {
  Box,
  Chip,
  Skeleton,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { AttachmentRequestChartFilters } from "@/modules/projects/project/query/useAttachmentRequestCharts";
import type {
  Chart as AttachmentChart,
  TrendChart as AttachmentTrendChart,
} from "@/services/api/projects/attachment-requests/types/charts";

type ChartFilters = AttachmentRequestChartFilters;
type NotificationChartDimensionData = AttachmentChart;
type NotificationChartsPayload = {
  trend: AttachmentTrendChart;
};

/* ── Color palette for charts ── */

const CHART_COLORS = [
  "#6366F1",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#84CC16",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  "semi-approved": "#8B5CF6",
  approved: "#22C55E",
  declined: "#EF4444",
  update_requested: "#0EA5E9",
  incoming: "#0EA5E9",
  outgoing: "#6366F1",
};

function getColor(index: number, code?: string) {
  if (code && STATUS_COLORS[code]) return STATUS_COLORS[code];
  return CHART_COLORS[index % CHART_COLORS.length];
}

/* ── Custom tooltip for recharts ── */

function ChartTooltip({ active, payload, label }: any) {
  const theme = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: 2,
        px: 1.5,
        py: 1,
        backdropFilter: "blur(8px)",
        boxShadow: 3,
      }}
    >
      {label && (
        <Typography variant="caption" fontWeight={600} sx={{ display: "block", mb: 0.25 }}>
          {label}
        </Typography>
      )}
      {payload.map((entry: any, i: number) => (
        <Typography
          key={i}
          variant="caption"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: entry.color || entry.fill,
              display: "inline-block",
            }}
          />
          {entry.name}: <strong>{entry.value}</strong>
          {entry.payload?.percentage != null && (
            <Typography component="span" variant="inherit" color="text.secondary">
              {" "}
              ({entry.payload.percentage}%)
            </Typography>
          )}
        </Typography>
      ))}
    </Box>
  );
}

/* ── Chart Card wrapper ── */

function ChartCard({
  title,
  total,
  icon,
  children,
  isLoading,
  sx,
}: {
  title: string;
  total?: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  sx?: any;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 3,
        p: 2.5,
        backdropFilter: "blur(12px)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.2),
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
        },
        ...sx,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="subtitle2" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        {total != null && (
          <Chip
            label={total}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: 13,
            }}
          />
        )}
      </Stack>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 240 }}>
          <Skeleton variant="rounded" width="100%" height={240} sx={{ borderRadius: 2 }} />
        </Box>
      ) : (
        children
      )}
    </Box>
  );
}

/* ── KPI Card ── */

function KpiCard({
  label,
  value,
  color,
  icon,
  onClick,
  active,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        bgcolor: active ? alpha(color, 0.12) : alpha(theme.palette.background.paper, 0.6),
        border: `1px solid ${active ? alpha(color, 0.4) : alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 3,
        p: 2,
        backdropFilter: "blur(12px)",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": onClick
          ? {
              borderColor: alpha(color, 0.3),
              transform: "translateY(-2px)",
              boxShadow: `0 4px 20px ${alpha(color, 0.15)}`,
            }
          : {},
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          insetInlineStart: 0,
          width: 4,
          height: "100%",
          bgcolor: color,
          opacity: active ? 1 : 0.5,
        }}
      />
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ps: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(color, 0.12),
            color,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {label}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

/* ── Dimension Chart (clickable bar chart) ── */

function DimensionBarChart({
  data,
  filters,
  filterKey,
  onToggle,
  total,
}: {
  data: NotificationChartDimensionData;
  filters: ChartFilters;
  filterKey?: keyof ChartFilters;
  onToggle: (key: keyof ChartFilters, code: string, label?: string) => void;
  total: number;
}) {
  const theme = useTheme();
  const selectedValue = filterKey ? (filters[filterKey] as string | undefined) : undefined;

  const chartData = useMemo(
    () =>
      data.data.map((item, i) => ({
        name: item.label,
        value: item.count,
        percentage: item.percentage,
        code: item.code,
        fill: getColor(i, item.code),
        isSelected: selectedValue === item.code,
        isDimmed: selectedValue && selectedValue !== item.code,
      })),
    [data, selectedValue],
  );

  if (!data.data.length) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={(props) => {
            const isRtl = theme.direction === "rtl";
            return (
              <g transform={`translate(${props.x},${props.y})`}>
                <text
                  x={0}
                  y={0}
                  dy={3}
                  textAnchor={isRtl ? "start" : "end"}
                  fill={theme.palette.text.secondary}
                  fontSize={11}
                  style={{ direction: isRtl ? "rtl" : "ltr" }}
                >
                  {(props.payload.value as string).length > 22
                    ? `${(props.payload.value as string).slice(0, 22)}…`
                    : props.payload.value}
                </text>
              </g>
            );
          }}
          axisLine={false}
          tickLine={false}
          width={160}
          interval={0}
        />
        <RTooltip content={<ChartTooltip />} cursor={{ fill: alpha(theme.palette.primary.main, 0.05) }} />
        <Bar
          dataKey="value"
          radius={[4, 4, 4, 4]}
          onClick={filterKey ? (payload: any, _index: number, e: any) => {
            const chartDatum = payload?.payload ?? payload;
            onToggle(filterKey, chartDatum?.code, chartDatum?.name);
            e?.stopPropagation?.();
          } : undefined}
          cursor={filterKey ? "pointer" : "default"}
        >
          {chartData.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={entry.fill}
              opacity={entry.isDimmed ? 0.3 : 1}
              stroke={entry.isSelected ? entry.fill : "none"}
              strokeWidth={entry.isSelected ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Status Donut Chart ── */

function StatusDonutChart({
  data,
  filters,
  onToggle,
}: {
  data: NotificationChartDimensionData;
  filters: ChartFilters;
  onToggle: (key: keyof ChartFilters, code: string, label?: string) => void;
}) {
  const theme = useTheme();
  const selectedStatus = filters.type;

  const chartData = useMemo(
    () =>
      data.data.map((item, i) => ({
        name: item.label,
        value: item.count,
        percentage: item.percentage,
        code: item.code,
        fill: getColor(i, item.code),
      })),
    [data],
  );

  if (!data.data.length) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            onClick={(payload: any) => {
              const chartDatum = payload?.payload ?? payload;
              onToggle("type", chartDatum?.code, chartDatum?.name);
            }}
            cursor="pointer"
            stroke={theme.palette.background.paper}
            strokeWidth={2}
          >
            {chartData.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={entry.fill}
                opacity={selectedStatus && selectedStatus !== entry.code ? 0.25 : 1}
              />
            ))}
          </Pie>
          <RTooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <Typography variant="h4" fontWeight={800}>
          {data.total}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total
        </Typography>
      </Box>
    </Box>
  );
}

/* ── Trend Area Chart ── */

function TrendChart({ data }: { data: NotificationChartsPayload["trend"] }) {
  const theme = useTheme();
  const chartData = useMemo(
    () =>
      data.data.map((item) => ({
        month: item.month,
        count: item.count,
      })),
    [data],
  );

  if (!chartData.length) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      </Box>
    );
  }

  const gradientId = "trendGradient";

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
            <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <RTooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke={theme.palette.primary.main}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={{ r: 3, fill: theme.palette.primary.main }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { ChartCard, KpiCard, DimensionBarChart, StatusDonutChart, TrendChart, getColor, ChartTooltip };
