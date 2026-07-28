"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  FilterList,
  Fullscreen,
  FullscreenExit,
  NotificationsActive,
  Pending,
  Search,
  TrendingUp,
  X,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import {
  useAttachmentRequestCharts,
  type AttachmentRequestChartFilters,
} from "@/modules/projects/project/query/useAttachmentRequestCharts";
import { useNotificationScope } from "@/modules/projects/project/hooks/useNotificationScope";
import type { Chart } from "@/services/api/projects/attachment-requests/types/charts";
import {
  ChartCard,
  DimensionBarChart,
  KpiCard,
  StatusDonutChart,
  TrendChart,
  getColor,
} from "./charts/chartPrimitives";

type ChartFilters = AttachmentRequestChartFilters;

function getFilterKeyLabel(key: keyof ChartFilters, tCharts: (key: string) => string): string {
  switch (key) {
    case "type":
    case "status":
      return tCharts("filterStatus");
    case "direction":
      return tCharts("filterDirection");
    case "procedure_setting_id":
      return tCharts("filterProcedure");
    case "attachment_type_id":
      return tCharts("filterAttachmentType");
    case "item_status":
      return tCharts("filterItemStatus");
    case "file_type":
      return tCharts("filterFileType");
    case "project_requirement_id":
      return tCharts("filterRequirement");
    case "date_from":
      return tCharts("fromDate");
    case "date_to":
      return tCharts("toDate");
    case "name":
      return tCharts("search");
    default:
      return String(key);
  }
}


function EmptyState({ message }: { message: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
}

function OptionalBar({
  title, chart, filters, filterKey, onToggle, isLoading, emptyMessage,
}: {
  title: string;
  chart?: Chart;
  filters: ChartFilters;
  filterKey?: keyof ChartFilters;
  onToggle: (key: keyof ChartFilters, code: string, label?: string) => void;
  isLoading?: boolean;
  emptyMessage: string;
}) {
  if (!chart && !isLoading) return null;
  return (
    <ChartCard title={title} total={chart?.total} icon={<NotificationsActive fontSize="small" />} isLoading={isLoading}>
      {chart && Array.isArray(chart.data) && chart.total > 0 ? (
        <DimensionBarChart data={chart as any} filters={filters} filterKey={filterKey} onToggle={onToggle} total={chart.total} />
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </ChartCard>
  );
}

function OptionalDonut({
  title, chart, filters, onToggle, isLoading, emptyMessage,
}: {
  title: string;
  chart?: Chart;
  filters: ChartFilters;
  onToggle: (key: keyof ChartFilters, code: string, label?: string) => void;
  isLoading?: boolean;
  emptyMessage: string;
}) {
  if (!chart && !isLoading) return null;
  return (
    <ChartCard title={title} total={chart?.total} icon={<NotificationsActive fontSize="small" />} isLoading={isLoading}>
      {chart && Array.isArray(chart.data) && chart.total > 0 ? (
        <StatusDonutChart data={chart as any} filters={filters} onToggle={onToggle} />
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </ChartCard>
  );
}
function ChartsContent(props: {
  data?: ReturnType<typeof useAttachmentRequestCharts>["data"];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string;
  filters: ChartFilters;
  filterLabels?: Partial<Record<keyof ChartFilters, string>>;
  tCharts: (key: string) => string;
  theme: any;
  onToggleFilter: (key: keyof ChartFilters, code: string, label?: string) => void;
  onClearFilters: () => void;
  searchInput: string;
  setSearchInput: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  onApplySearch: () => void;
  activeFilterCount: number;
}) {
  const {
    data, isLoading, isFetching, isError, errorMessage, filters, filterLabels, tCharts, theme,
    onToggleFilter, onClearFilters, searchInput, setSearchInput, dateFrom, setDateFrom,
    dateTo, setDateTo, onApplySearch, activeFilterCount,
  } = props;
  const emptyMessage = tCharts("noData");
  const attachment = data?.attachment_requests;
  const requirements = data?.requirement_submissions;

  const attachmentKpis = [
    { code: "pending", label: tCharts("pendingRequests"), count: attachment?.summary?.pending_requests ?? 0 },
    { code: "semi-approved", label: tCharts("semiApprovedRequests"), count: attachment?.summary?.semi_approved_requests ?? 0 },
    { code: "approved", label: tCharts("approvedRequests"), count: attachment?.summary?.approved_requests ?? 0 },
    { code: "declined", label: tCharts("declinedRequests"), count: attachment?.summary?.declined_requests ?? 0 },
  ].map((item, i) => ({ ...item, color: getColor(i, item.code) }));

  const requirementKpis = [
    { code: "pending", label: tCharts("pendingSubmissions"), count: requirements?.summary?.pending_submissions ?? 0 },
    { code: "approved", label: tCharts("approvedSubmissions"), count: requirements?.summary?.approved_submissions ?? 0 },
    { code: "declined", label: tCharts("declinedSubmissions"), count: requirements?.summary?.declined_submissions ?? 0 },
    { code: "total", label: tCharts("totalSubmissions"), count: requirements?.summary?.total_submissions ?? 0 },
  ].map((item, i) => ({ ...item, color: item.code === "total" ? theme.palette.primary.main : getColor(i, item.code) }));

  return (
    <Box>
      <Box sx={{ bgcolor: alpha(theme.palette.background.paper, 0.4), border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, borderRadius: 3, p: 2, mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "text.secondary" }}>
            <FilterList fontSize="small" />
            <Typography variant="caption" fontWeight={600}>{tCharts("filter")}:</Typography>
          </Stack>
          <TextField size="small" placeholder={tCharts("searchPlaceholder")} value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} onBlur={onApplySearch}
            onKeyDown={(e) => e.key === "Enter" && onApplySearch()} sx={{ minWidth: 180, maxWidth: 260 }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Search fontSize="small" sx={{ color: "text.secondary" }} /></InputAdornment>) }} />
          <TextField size="small" type="date" label={tCharts("fromDate")} value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)} sx={{ minWidth: 140 }} InputLabelProps={{ shrink: true }} />
          <TextField size="small" type="date" label={tCharts("toDate")} value={dateTo}
            onChange={(e) => setDateTo(e.target.value)} sx={{ minWidth: 140 }} InputLabelProps={{ shrink: true }} />
          {activeFilterCount > 0 && (
            <Button size="small" variant="text" onClick={onClearFilters} startIcon={<X />} sx={{ color: "text.secondary" }}>
              {tCharts("clearFilters")}
            </Button>
          )}
        </Stack>
      </Box>

      {activeFilterCount > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            const k = key as keyof ChartFilters;
            return (
              <Chip key={key} label={`${getFilterKeyLabel(k, tCharts)}: ${filterLabels?.[k] ?? value}`} size="small"
                onDelete={() => onToggleFilter(k, value as string)} deleteIcon={<X />}
                sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main, fontSize: 12 }} />
            );
          })}
        </Stack>
      )}

      {isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {attachment && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{tCharts("attachmentRequestsSection")}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 2.5 }}>
            {isLoading
              ? [0,1,2,3].map((i) => <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 3 }} />)
              : attachmentKpis.map((item) => (
                  <KpiCard key={item.code} label={item.label} value={item.count} color={item.color}
                    icon={item.code === "approved" ? <CheckCircle /> : <Pending />}
                    onClick={() => onToggleFilter("type", item.code, item.label)}
                    active={filters.type === item.code} />
                ))}
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 2.5 }}>
            <KpiCard label={tCharts("totalRequests")} value={attachment.summary?.total_requests ?? 0} color={theme.palette.primary.main} icon={<NotificationsActive />} />
            <KpiCard label={tCharts("totalItems")} value={attachment.summary?.total_items ?? 0} color="#14B8A6" icon={<NotificationsActive />} />
            <KpiCard label={tCharts("outgoingRequests")} value={attachment.summary?.outgoing_requests ?? 0} color={getColor(0, "outgoing")} icon={<NotificationsActive />}
              onClick={() => onToggleFilter("direction", "outgoing", tCharts("outgoingRequests"))} active={filters.direction === "outgoing"} />
            <KpiCard label={tCharts("incomingRequests")} value={attachment.summary?.incoming_requests ?? 0} color={getColor(1, "incoming")} icon={<NotificationsActive />}
              onClick={() => onToggleFilter("direction", "incoming", tCharts("incomingRequests"))} active={filters.direction === "incoming"} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" }, gap: 2.5, mb: 2.5 }}>
            <OptionalDonut title={tCharts("statusDistribution")} chart={attachment.status} filters={filters} onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
            <OptionalDonut title={tCharts("directionDistribution")} chart={attachment.direction} filters={filters} onToggle={(_k, code, label) => onToggleFilter("direction", code, label)} isLoading={isLoading} emptyMessage={emptyMessage} />
            <OptionalDonut title={tCharts("itemStatusDistribution")} chart={attachment.item_status} filters={filters} onToggle={(_k, code, label) => onToggleFilter("item_status", code, label)} isLoading={isLoading} emptyMessage={emptyMessage} />
          </Box>
          {attachment.trend !== undefined && (
            <Box sx={{ mb: 2.5 }}>
              <ChartCard title={tCharts("trendDistribution")} total={attachment.trend?.total} icon={<TrendingUp fontSize="small" />} isLoading={isLoading}>
                {attachment.trend && Array.isArray(attachment.trend.data) && attachment.trend.total > 0
                  ? <TrendChart data={attachment.trend as any} />
                  : <EmptyState message={emptyMessage} />}
              </ChartCard>
            </Box>
          )}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" }, gap: 2.5, mb: 2.5 }}>
            <OptionalBar title={tCharts("procedureDistribution")} chart={attachment.procedure} filters={filters} filterKey="procedure_setting_id" onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
            <OptionalBar title={tCharts("attachmentTypeDistribution")} chart={attachment.attachment_type} filters={filters} filterKey="attachment_type_id" onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
            <OptionalBar title={tCharts("fileTypeDistribution")} chart={attachment.file_type} filters={filters} filterKey="file_type" onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
          </Box>
          <OptionalBar title={tCharts("projectDistribution")} chart={attachment.project} filters={filters} onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
        </Box>
      )}
      {requirements && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{tCharts("requirementSubmissionsSection")}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 2.5 }}>
            {isLoading
              ? [0,1,2,3].map((i) => <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 3 }} />)
              : requirementKpis.map((item) => (
                  <KpiCard key={item.code} label={item.label} value={item.count} color={item.color}
                    icon={item.code === "approved" ? <CheckCircle /> : <Pending />}
                    onClick={item.code === "total" ? undefined : () => onToggleFilter("type", item.code, item.label)}
                    active={item.code !== "total" && filters.type === item.code} />
                ))}
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" }, gap: 2.5, mb: 2.5 }}>
            <OptionalDonut title={tCharts("statusDistribution")} chart={requirements.status} filters={filters} onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
            <OptionalDonut title={tCharts("directionDistribution")} chart={requirements.direction} filters={filters} onToggle={(_k, code, label) => onToggleFilter("direction", code, label)} isLoading={isLoading} emptyMessage={emptyMessage} />
            <OptionalBar title={tCharts("requirementDistribution")} chart={requirements.requirement} filters={filters} filterKey="project_requirement_id" onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
          </Box>
          {requirements.trend !== undefined && (
            <Box sx={{ mb: 2.5 }}>
              <ChartCard title={tCharts("trendDistribution")} total={requirements.trend?.total} icon={<TrendingUp fontSize="small" />} isLoading={isLoading}>
                {requirements.trend && Array.isArray(requirements.trend.data) && requirements.trend.total > 0
                  ? <TrendChart data={requirements.trend as any} />
                  : <EmptyState message={emptyMessage} />}
              </ChartCard>
            </Box>
          )}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" }, gap: 2.5 }}>
            <OptionalBar title={tCharts("procedureDistribution")} chart={requirements.procedure} filters={filters} filterKey="procedure_setting_id" onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
            <OptionalBar title={tCharts("fileTypeDistribution")} chart={requirements.file_type} filters={filters} filterKey="file_type" onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
            <OptionalBar title={tCharts("projectDistribution")} chart={requirements.project} filters={filters} onToggle={onToggleFilter} isLoading={isLoading} emptyMessage={emptyMessage} />
          </Box>
        </Box>
      )}

      {!isLoading && !attachment && !requirements && !isError && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">{tCharts("noSections")}</Typography>
        </Box>
      )}

      {isFetching && !isLoading && (
        <Box sx={{ position: "fixed", top: 16, insetInlineEnd: 16, zIndex: 9999 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
}

export default function AttachmentRequestChartsView() {
  const tCharts = useTranslations("project.documentCycle.charts");
  const theme = useTheme();
  const { projectId, contractualEngagementKey, hasScope } = useNotificationScope();

  const [filters, setFilters] = useState<ChartFilters>({});
  const [filterLabels, setFilterLabels] = useState<Partial<Record<keyof ChartFilters, string>>>({});
  const [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data, isLoading, isFetching, isError, error } = useAttachmentRequestCharts(
    projectId,
    contractualEngagementKey,
    filters,
  );

  const handleToggleFilter = useCallback(
    (key: keyof ChartFilters, code: string, label?: string) => {
      setFilters((prev) => {
        const current = prev[key] as string | undefined;
        const next = { ...prev };
        if (current === code) delete next[key];
        else (next as any)[key] = code;
        return next;
      });
      if (label) {
        setFilterLabels((prev) => {
          const next = { ...prev };
          if (prev[key] === label) delete next[key];
          else next[key] = label;
          return next;
        });
      }
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setFilterLabels({});
    setSearchInput("");
    setDateFrom("");
    setDateTo("");
  }, []);

  const handleApplySearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      name: searchInput.trim() || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }));
  }, [searchInput, dateFrom, dateTo]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v != null && v !== "").length,
    [filters],
  );

  const errorMessage = useMemo(() => {
    const status = (error as any)?.response?.status;
    if (status === 400) return tCharts("errorBadRequest");
    if (status === 401) return tCharts("errorUnauthorized");
    if (status === 403) return tCharts("errorForbidden");
    if (status === 404) return tCharts("errorNotFound");
    if (status === 422) return tCharts("errorValidation");
    return tCharts("errorGeneric");
  }, [error, tCharts]);

  if (!hasScope) return null;

  const sharedProps = {
    data, isLoading, isFetching, isError, errorMessage, filters, filterLabels, tCharts, theme,
    onToggleFilter: handleToggleFilter, onClearFilters: handleClearFilters,
    searchInput, setSearchInput,
    dateFrom,
    setDateFrom: (v: string) => { setDateFrom(v); setFilters((prev) => ({ ...prev, date_from: v || undefined })); },
    dateTo,
    setDateTo: (v: string) => { setDateTo(v); setFilters((prev) => ({ ...prev, date_to: v || undefined })); },
    onApplySearch: handleApplySearch, activeFilterCount,
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>{tCharts("title")}</Typography>
        <Tooltip title={tCharts("fullscreen")}>
          <IconButton onClick={() => setIsFullscreen(true)} size="small"
            sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.15)}`, borderRadius: 2, px: 1 }}>
            <Fullscreen fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <ChartsContent {...sharedProps} />
      <Dialog fullScreen open={isFullscreen} onClose={() => setIsFullscreen(false)}
        PaperProps={{ sx: { bgcolor: theme.palette.background.default } }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 1.5, bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: "blur(8px)", borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="h6" fontWeight={700}>{tCharts("title")}</Typography>
          <Tooltip title={tCharts("exitFullscreen")}>
            <IconButton onClick={() => setIsFullscreen(false)} size="small"><FullscreenExit fontSize="small" /></IconButton>
          </Tooltip>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <ChartsContent {...sharedProps} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

