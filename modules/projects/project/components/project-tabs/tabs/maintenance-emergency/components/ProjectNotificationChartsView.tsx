"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import {
  Search,
  X,
  FilterList,
  TrendingUp,
  NotificationsActive,
  CheckCircle,
  Pending,
  Refresh,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
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
import { useProjectNotificationCharts } from "@/modules/projects/project/query/useProjectNotificationCharts";
import type { ChartFilters } from "@/modules/projects/project/query/useProjectNotificationCharts";
import { useNotificationScope } from "@/modules/projects/project/hooks/useNotificationScope";
import type {
  NotificationChartDimensionData,
  NotificationChartsPayload,
} from "@/services/api/projects/notifications/types/response";

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
  received: "#6366F1",
  in_progress: "#0EA5E9",
  completed: "#22C55E",
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
  onToggle: (key: keyof ChartFilters, code: string) => void;
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
          onClick={filterKey ? (payload: any) => onToggle(filterKey, payload.code) : undefined}
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
  onToggle: (key: keyof ChartFilters, code: string) => void;
}) {
  const theme = useTheme();
  const selectedStatus = filters.status;

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
            onClick={(payload: any) => onToggle("status", payload.code)}
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

/* ── Charts Content (shared between inline and fullscreen) ── */

function ChartsContent({
  data,
  isLoading,
  isFetching,
  filters,
  statusKpis,
  t,
  tCharts,
  theme,
  onToggleFilter,
  onClearFilters,
  onRefetch,
  searchInput,
  setSearchInput,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onApplySearch,
  activeFilterCount,
}: {
  data?: NotificationChartsPayload;
  isLoading: boolean;
  isFetching: boolean;
  filters: ChartFilters;
  statusKpis: any[];
  t: (key: string) => string;
  tCharts: (key: string) => string;
  theme: any;
  onToggleFilter: (key: keyof ChartFilters, code: string) => void;
  onClearFilters: () => void;
  onRefetch: () => void;
  searchInput: string;
  setSearchInput: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  onApplySearch: () => void;
  activeFilterCount: number;
}) {
  return (
    <Box>
      {/* Filter Bar */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 3,
          p: 2,
          mb: 3,
          backdropFilter: "blur(12px)",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "text.secondary" }}>
            <FilterList fontSize="small" />
            <Typography variant="caption" fontWeight={600}>
              {t("filter")}:
            </Typography>
          </Stack>
          <TextField
            size="small"
            placeholder={t("search")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onBlur={onApplySearch}
            onKeyDown={(e) => e.key === "Enter" && onApplySearch()}
            sx={{ minWidth: 180, maxWidth: 240 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            size="small"
            type="date"
            label={t("fromDate")}
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
            }}
            sx={{ minWidth: 140 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            type="date"
            label={t("toDate")}
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
            }}
            sx={{ minWidth: 140 }}
            InputLabelProps={{ shrink: true }}
          />
          {activeFilterCount > 0 && (
            <Button
              size="small"
              variant="text"
              onClick={onClearFilters}
              startIcon={<X />}
              sx={{ color: "text.secondary" }}
            >
              {t("clearFilters")}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                size="small"
                onDelete={() => onToggleFilter(key as keyof ChartFilters, value as string)}
                deleteIcon={<X />}
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  fontSize: 12,
                }}
              />
            );
          })}
        </Stack>
      )}

      {/* KPI Cards */}
      {isLoading ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 3 }} />
          ))}
        </Box>
      ) : statusKpis.length > 0 ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
          {statusKpis.slice(0, 4).map((item) => (
            <KpiCard
              key={item.code}
              label={item.label}
              value={item.count}
              color={item.color}
              icon={
                item.code === "pending" ? <Pending /> :
                item.code === "completed" ? <CheckCircle /> :
                item.code === "received" || item.code === "in_progress" ? <NotificationsActive /> :
                <NotificationsActive />
              }
              onClick={() => onToggleFilter("status", item.code)}
              active={filters.status === item.code}
            />
          ))}
        </Box>
      ) : null}

      {/* Charts Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" }, gap: 2.5, mb: 2.5 }}>
        {/* Status Donut */}
        <ChartCard
          title={tCharts("statusDistribution")}
          total={data?.status?.total}
          icon={<NotificationsActive fontSize="small" />}
          isLoading={isLoading}
        >
          {data && <StatusDonutChart data={data.status} filters={filters} onToggle={onToggleFilter} />}
        </ChartCard>

        {/* Notification Type */}
        <ChartCard
          title={tCharts("notificationTypeDistribution")}
          total={data?.notification_type?.total}
          icon={<NotificationsActive fontSize="small" />}
          isLoading={isLoading}
        >
          {data && (
            <DimensionBarChart
              data={data.notification_type}
              filters={filters}
              filterKey="notification_type"
              onToggle={onToggleFilter}
              total={data.notification_type.total}
            />
          )}
        </ChartCard>

        {/* Work Type */}
        <ChartCard
          title={tCharts("workTypeDistribution")}
          total={data?.work_type?.total}
          icon={<NotificationsActive fontSize="small" />}
          isLoading={isLoading}
        >
          {data && (
            <DimensionBarChart
              data={data.work_type}
              filters={filters}
              filterKey="work_type"
              onToggle={onToggleFilter}
              total={data.work_type.total}
            />
          )}
        </ChartCard>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" }, gap: 2.5, mb: 2.5 }}>
        {/* Project Distribution */}
        <ChartCard
          title={tCharts("projectDistribution")}
          total={data?.project?.total}
          icon={<NotificationsActive fontSize="small" />}
          isLoading={isLoading}
        >
          {data && (
            <DimensionBarChart
              data={data.project}
              filters={filters}
              onToggle={onToggleFilter}
              total={data.project.total}
            />
          )}
        </ChartCard>

        {/* Assigned Employees */}
        <ChartCard
          title={tCharts("assignedEmployeeDistribution")}
          total={data?.assigned_employee?.total}
          icon={<NotificationsActive fontSize="small" />}
          isLoading={isLoading}
        >
          {data && (
            <DimensionBarChart
              data={data.assigned_employee}
              filters={filters}
              filterKey="assigned_user_id"
              onToggle={onToggleFilter}
              total={data.assigned_employee.total}
            />
          )}
        </ChartCard>

        {/* Contractors */}
        <ChartCard
          title={tCharts("contractorDistribution")}
          total={data?.contractor?.total}
          icon={<NotificationsActive fontSize="small" />}
          isLoading={isLoading}
        >
          {data && (
            <DimensionBarChart
              data={data.contractor}
              filters={filters}
              filterKey="contractor_name"
              onToggle={onToggleFilter}
              total={data.contractor.total}
            />
          )}
        </ChartCard>
      </Box>

      {/* Trend Chart - full width */}
      <ChartCard
        title={tCharts("trendDistribution")}
        total={data?.trend?.total}
        icon={<TrendingUp fontSize="small" />}
        isLoading={isLoading}
      >
        {data && <TrendChart data={data.trend} />}
      </ChartCard>

      {/* Loading overlay */}
      {isFetching && !isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            insetInlineEnd: 16,
            zIndex: 9999,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
}

/* ── Main Component ── */

export default function ProjectNotificationChartsView() {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const tCharts = useTranslations("project.maintenanceEmergency.notifications.charts");
  const theme = useTheme();
  const { projectId, contractualEngagementKey } = useNotificationScope();

  const [filters, setFilters] = useState<ChartFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scope = useMemo(
    () => ({ projectId, contractualEngagementKey }),
    [projectId, contractualEngagementKey],
  );

  const { data, isLoading, isFetching, refetch } = useProjectNotificationCharts(scope, filters);

  const handleToggleFilter = useCallback(
    (key: keyof ChartFilters, code: string) => {
      setFilters((prev) => {
        const current = prev[key] as string | undefined;
        const next = { ...prev };
        if (current === code) {
          delete next[key];
        } else {
          next[key] = code;
        }
        return next;
      });
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchInput("");
    setDateFrom("");
    setDateTo("");
  }, []);

  const handleApplySearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }));
  }, [searchInput, dateFrom, dateTo]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v != null && v !== "").length,
    [filters],
  );

  const statusData = data?.status;
  const statusKpis = useMemo(() => {
    if (!statusData) return [];
    return statusData.data.map((item, i) => ({
      ...item,
      color: getColor(i, item.code),
    }));
  }, [statusData]);

  const sharedProps = {
    data,
    isLoading,
    isFetching,
    filters,
    statusKpis,
    t,
    tCharts,
    theme,
    onToggleFilter: handleToggleFilter,
    onClearFilters: handleClearFilters,
    onRefetch: () => refetch(),
    searchInput,
    setSearchInput,
    dateFrom,
    setDateFrom: (v: string) => {
      setDateFrom(v);
      setFilters((prev) => ({ ...prev, date_from: v || undefined }));
    },
    dateTo,
    setDateTo: (v: string) => {
      setDateTo(v);
      setFilters((prev) => ({ ...prev, date_to: v || undefined }));
    },
    onApplySearch: handleApplySearch,
    activeFilterCount,
  };

  return (
    <Box>
      {/* Header with fullscreen button */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" fontWeight={700}>
          {tCharts("title")}
        </Typography>
        <Tooltip title={tCharts("fullscreen")}>
          <IconButton
            onClick={() => setIsFullscreen(true)}
            size="small"
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
              borderRadius: 2,
              px: 1,
            }}
          >
            <Fullscreen fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Inline charts */}
      <ChartsContent {...sharedProps} />

      {/* Fullscreen Dialog */}
      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.default,
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 1.5,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(8px)",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {tCharts("title")}
          </Typography>
          <Tooltip title={tCharts("exitFullscreen")}>
            <IconButton onClick={() => setIsFullscreen(false)} size="small">
              <FullscreenExit fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <ChartsContent {...sharedProps} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
