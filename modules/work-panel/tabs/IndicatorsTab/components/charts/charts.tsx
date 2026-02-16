"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";


const data = [
  { y1: 443.28, y2: 153.9 },
  { y1: 110.5, y2: 217.8 },
  { y1: 175.23, y2: 286.32 },
  { y1: 195.97, y2: 325.12 },
  { y1: 351.77, y2: 144.58 },
  { y1: 43.253, y2: 146.51 },
  { y1: 376.34, y2: 309.69 },
  { y1: 31.514, y2: 236.38 },
  { y1: 231.31, y2: 440.72 },
  { y1: 108.04, y2: 20.29 },
  { y1: 321.77, y2: 484.17 },
  { y1: 120.18, y2: 54.962 },
  { y1: 366.2, y2: 418.5 },
  { y1: 451.45, y2: 181.32 },
  { y1: 294.8, y2: 440.9 },
  { y1: 121.83, y2: 273.52 },
  { y1: 287.7, y2: 346.7 },
  { y1: 134.06, y2: 74.528 },
  { y1: 330.72, y2: 488.06 },
];


const series = [
  {
    label: "Series A",
    data: data.map((v) => v.y1),
    color: "#7086FD",
  },
  {
    label: "Series B",
    data: data.map((v) => v.y2),
    color: "#6FD195",
  },
];


export function ZoomBarChart() {

  const xLabels = data.map((_, i) => `Item ${i + 1}`);

  return (
    <BarChart
      xAxis={[{ scaleType: "band", data: xLabels }]}
      series={series}
      height={360}
      slotProps={{ legend: { hidden: false } }}
    />
  );
}

export function charts() {
  return (
    <Box className="mt-6 ml-10 ">
      <Typography variant="h6" sx={{ mb: 2 }}>

      </Typography>
      <ZoomBarChart />
    </Box>
  );
}

export default charts;
