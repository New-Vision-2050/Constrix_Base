"use client";

import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { ZoomIn } from "lucide-react";

function RingBadge({
  value,
  label,
  ringColor,
}: {
  value: string;
  label: string;
  ringColor: string;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
      <Typography sx={{ fontSize: 10, color: "text.secondary" }}>{label}</Typography>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: `3px solid ${ringColor}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: 9, color: "text.secondary" }}>ريال</Typography>
      </Box>
    </Box>
  );
}

function ContractorRow({
  name,
  avatarSrc,
  ringColor,
}: {
  name: string;
  avatarSrc: string;
  ringColor: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar
        src={avatarSrc}
        sx={{
          width: 32,
          height: 32,
          border: `2px solid ${ringColor}`,
        }}
      />
      <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{name}</Typography>
    </Box>
  );
}

function WavyLineChart({ color }: { color: string }) {
  return (
    <svg
      width="180"
      height="60"
      viewBox="0 0 180 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 45 C20 45, 25 15, 40 20 S60 50, 75 35 S95 5, 110 15 S130 45, 145 30 S160 10, 175 20"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5 45 C20 45, 25 15, 40 20 S60 50, 75 35 S95 5, 110 15 S130 45, 145 30 S160 10, 175 20 V60 H5 Z"
        fill="url(#wavyGradient)"
        opacity="0.15"
      />
      <defs>
        <linearGradient id="wavyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Mini Bar Chart Data ────────────────────────────────────────────────
const barChartLabels = ["الاصايل", "الهاجدية", "الانوار"];
const barSeries1 = [700, 450, 600]; // red/orange bars
const barSeries2 = [500, 350, 500]; // yellow bars

export default function ProjectStatsBar() {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 3,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={1.5} sx={{ minWidth: 170 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(palette.primary.main, 0.15),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                fill={palette.primary.main}
              />
            </svg>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
              قيمة المهام
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                sx={{ fontSize: 22, fontWeight: 700, color: "text.primary", lineHeight: 1 }}
              >
                100,000
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>ريال</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(palette.success.main, 0.15),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"
                fill={palette.success.main}
              />
            </svg>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
              القيمة المالية
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                sx={{ fontSize: 22, fontWeight: 700, color: "text.primary", lineHeight: 1 }}
              >
                15,000
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>ريال</Typography>
            </Box>
          </Box>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 220 }}>
        <RingBadge value="500" label="المفوتر" ringColor={palette.text.secondary} />
        <RingBadge value="1000" label="المسدد" ringColor={palette.warning.main} />
        <RingBadge value="500" label="المتبقي" ringColor={palette.primary.main} />
      </Box>

      <Box sx={{ minWidth: 160 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}>
            المقاولين
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>
            4
          </Typography>
        </Box>
        <Stack spacing={0.8}>
          <ContractorRow
            name="الاصايل"
            avatarSrc="https://i.pravatar.cc/40?img=11"
            ringColor={palette.warning.main}
          />
          <ContractorRow
            name="الهاجدية"
            avatarSrc="https://i.pravatar.cc/40?img=32"
            ringColor={palette.secondary.main}
          />
          <ContractorRow
            name="الانوار"
            avatarSrc="https://i.pravatar.cc/40?img=53"
            ringColor={palette.text.secondary}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 200,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>
          عدد التصاريح
        </Typography>
        <Typography sx={{ fontSize: 10, color: "text.secondary", mb: 0.5 }}>
          اجمالي عدد التصاريح للمشروع
        </Typography>
        <WavyLineChart color={palette.primary.main} />
        <Typography
          sx={{ fontSize: 32, fontWeight: 700, color: "text.primary", lineHeight: 1, mt: -0.5 }}
        >
          900
        </Typography>
      </Box>

      <Box sx={{ minWidth: 220, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          <IconButton size="small" sx={{ color: "text.secondary" }} suppressHydrationWarning>
            <ZoomIn size={16} />
          </IconButton>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}>
            أوامر العمل
          </Typography>
        </Box>
        <Box sx={{ height: 120, width: "100%" }}>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: barChartLabels,
                tickLabelStyle: { fontSize: 9, fill: palette.text.secondary },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fontSize: 9, fill: palette.text.secondary },
              },
            ]}
            series={[
              { data: barSeries1, color: palette.error.main },
              { data: barSeries2, color: palette.warning.main },
            ]}
            width={210}
            height={120}
            margin={{ top: 5, right: 5, bottom: 20, left: 30 }}
            slots={{
              legend: () => null,
            }}
            sx={{
              "& .MuiChartsAxis-line": { stroke: palette.divider },
              "& .MuiChartsAxis-tick": { stroke: palette.divider },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
