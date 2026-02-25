"use client";

import React from "react";
import { Box, Typography, Avatar, Stack, IconButton } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ZoomIn } from "lucide-react";

// ─── Circular Ring Badge ────────────────────────────────────────────────
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
      <Typography sx={{ fontSize: 10, color: "grey.500" }}>{label}</Typography>
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
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: 9, color: "grey.500" }}>ريال</Typography>
      </Box>
    </Box>
  );
}

// ─── Contractor Row ─────────────────────────────────────────────────────
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
      <Typography sx={{ fontSize: 11, color: "grey.400" }}>{name}</Typography>
    </Box>
  );
}

// ─── Wavy Line SVG (permits trend) ─────────────────────────────────────
function WavyLineChart() {
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
        stroke="#E91E90"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5 45 C20 45, 25 15, 40 20 S60 50, 75 35 S95 5, 110 15 S130 45, 145 30 S160 10, 175 20 V60 H5 Z"
        fill="url(#gradient)"
        opacity="0.15"
      />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E91E90" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Mini Bar Chart Data ────────────────────────────────────────────────
const barChartData = [
  { name: "الاصايل", series1: 700, series2: 500 },
  { name: "الهاجدية", series1: 450, series2: 350 },
  { name: "الانوار", series1: 600, series2: 500 },
];

// ─── Main Stats Bar ─────────────────────────────────────────────────────
export default function ProjectStatsBar() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#1a1333",
        borderRadius: 3,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* ──────── Section 1: قيمة المهام + القيمة المالية ──────── */}
      <Stack spacing={1.5} sx={{ minWidth: 170 }}>
        {/* قيمة المهام */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "#2c2550",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                fill="#7C6AE8"
              />
            </svg>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 10, color: "grey.500" }}>
              قيمة المهام
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                sx={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}
              >
                100,000
              </Typography>
              <Typography sx={{ fontSize: 11, color: "grey.500" }}>ريال</Typography>
            </Box>
          </Box>
        </Box>

        {/* القيمة المالية */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "#1a2e2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"
                fill="#4CAF50"
              />
            </svg>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 10, color: "grey.500" }}>
              القيمة المالية
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                sx={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}
              >
                15,000
              </Typography>
              <Typography sx={{ fontSize: 11, color: "grey.500" }}>ريال</Typography>
            </Box>
          </Box>
        </Box>
      </Stack>


      {/* ──────── Section 2: المفوتر / المسدد / المتبقي ──────── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 220 }}>
        <RingBadge value="500" label="المفوتر" ringColor="#555" />
        <RingBadge value="1000" label="المسدد" ringColor="#D4A017" />
        <RingBadge value="500" label="المتبقي" ringColor="#E91E90" />
      </Box>


      {/* ──────── Section 3: المقاولين ──────── */}
      <Box sx={{ minWidth: 160 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
            المقاولين
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            4
          </Typography>
        </Box>
        <Stack spacing={0.8}>
          <ContractorRow
            name="الاصايل"
            avatarSrc="https://i.pravatar.cc/40?img=11"
            ringColor="#D4A017"
          />
          <ContractorRow
            name="الهاجدية"
            avatarSrc="https://i.pravatar.cc/40?img=32"
            ringColor="#9C27B0"
          />
          <ContractorRow
            name="الانوار"
            avatarSrc="https://i.pravatar.cc/40?img=53"
            ringColor="#555"
          />
        </Stack>
      </Box>


      {/* ──────── Section 4: عدد التصاريح ──────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 200,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
          عدد التصاريح
        </Typography>
        <Typography sx={{ fontSize: 10, color: "grey.500", mb: 0.5 }}>
          اجمالي عدد التصاريح للمشروع
        </Typography>
        <WavyLineChart />
        <Typography
          sx={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1, mt: -0.5 }}
        >
          900
        </Typography>
      </Box>


      {/* ──────── Section 5: أوامر العمل ──────── */}
      <Box sx={{ minWidth: 220, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          <IconButton size="small" sx={{ color: "grey.400" }}>
            <ZoomIn size={16} />
          </IconButton>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
            أوامر العمل
          </Typography>
        </Box>
        <Box sx={{ height: 120, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={barChartData} 
              margin={{ top: 5, right: 5, bottom: 20, left: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 9, fill: "#888" }}
                stroke="#333"
              />
              <YAxis 
                tick={{ fontSize: 9, fill: "#888" }}
                stroke="#333"
              />
              <Bar dataKey="series1" fill="#E65100" />
              <Bar dataKey="series2" fill="#FDD835" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
