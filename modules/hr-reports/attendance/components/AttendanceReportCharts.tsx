"use client";

import React, { useMemo } from "react";
import { Box, Paper, Typography, Grid, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

const WEEKDAY_KEYS = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const;

const CHECK_INS_BY_DAY = [142, 128, 135, 121, 118, 45, 38];

export default function AttendanceReportCharts() {
  const theme = useTheme();
  const tc = theme.palette.text.secondary;

  const t = useTranslations("HRReports.attendanceReport");
  const tWd = useTranslations("HRReports.attendanceReport.chartWeekdays");

  const weekdayBand = useMemo(
    () => WEEKDAY_KEYS.map((k) => tWd(k)),
    [tWd],
  );

  const barPrimary =
    theme.palette.mode === "dark" ? theme.palette.primary.light : "#5c6bc0";

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, lg: 7 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            height: "100%",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            {t("chartDailyTitle")}
          </Typography>
          <BarChart
            height={280}
            margin={{ left: 48, right: 16, top: 16, bottom: 40 }}
            xAxis={[
              {
                scaleType: "band",
                data: weekdayBand,
                tickLabelStyle: { fill: tc, fontSize: 12 },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: tc, fontSize: 11 },
              },
            ]}
            series={[
              {
                data: CHECK_INS_BY_DAY,
                label: t("chartDailySeries"),
                color: barPrimary,
              },
            ]}
            grid={{ horizontal: true }}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            height: "100%",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            {t("chartStatusTitle")}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <PieChart
              width={320}
              height={260}
              series={[
                {
                  innerRadius: 48,
                  outerRadius: 92,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  data: [
                    {
                      id: "present",
                      value: 72,
                      label: t("statusPresent"),
                      color: "#6fd195",
                    },
                    {
                      id: "late",
                      value: 18,
                      label: t("statusLate"),
                      color: "#ffb74d",
                    },
                    {
                      id: "absent",
                      value: 10,
                      label: t("statusAbsent"),
                      color: "#ef5350",
                    },
                  ],
                },
              ]}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                  padding: { top: 12 },
                },
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
