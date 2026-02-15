"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export function ZoomBarChart() {
  const data = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 22 },
    { month: 'May', count: 18 },
    { month: 'Jun', count: 25 },
    { month: 'Jul', count: 30 },
    { month: 'Aug', count: 28 },
    { month: 'Sep', count: 20 },
    { month: 'Oct', count: 16 },
    { month: 'Nov', count: 12 },
    { month: 'Dec', count: 10 }
  ];

  const xLabels = data.map(d => d.month);

  return (
    <Box className="mt-6">
      <Typography variant="h6" className="text-right mb-4">
        انتهاء التأشيرات شهرياً
      </Typography>
      <BarChart
        xAxis={[{ scaleType: 'band', data: xLabels }]}
        series={[
          { data: data.map(d => d.count), label: 'Visa Expiration Count', color: '#8884d8' }
        ]}

      />
    </Box>
  );
}

export default ZoomBarChart;
