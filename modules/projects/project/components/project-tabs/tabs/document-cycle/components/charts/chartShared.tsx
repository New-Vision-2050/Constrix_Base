"use client";

import {
  Box,
  Chip,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

export const CHART_COLORS = [
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

export const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  "semi-approved": "#8B5CF6",
  approved: "#22C55E",
  declined: "#EF4444",
  update_requested: "#0EA5E9",
  incoming: "#0EA5E9",
  outgoing: "#6366F1",
};

export function getColor(index: number, code?: string) {
  if (code && STATUS_COLORS[code]) return STATUS_COLORS[code];
  return CHART_COLORS[index % CHART_COLORS.length];
}

export function ChartTooltip({ active, payload, label }: any) {
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
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ display: "block", mb: 0.25 }}
        >
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
            <Typography
              component="span"
              variant="inherit"
              color="text.secondary"
            >
              {" "}
              ({entry.payload.percentage}%)
            </Typography>
          )}
        </Typography>
      ))}
    </Box>
  );
}

export function ChartCard({
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
  sx?: object;
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 240,
          }}
        >
          <Skeleton
            variant="rounded"
            width="100%"
            height={240}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      ) : (
        children
      )}
    </Box>
  );
}

export function KpiCard({
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
        bgcolor: active
          ? alpha(color, 0.12)
          : alpha(theme.palette.background.paper, 0.6),
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
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
          >
            {label}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export function EmptyChartState({ message }: { message: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
