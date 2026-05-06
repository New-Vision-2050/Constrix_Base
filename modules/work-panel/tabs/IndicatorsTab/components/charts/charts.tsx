"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';
import { useTranslations } from "next-intl";

export function ZoomBarChart() {
  const [data, setData] = useState<any[]>([]);
  const { getAllChartsData } = useIndicatorsService();
  const t = useTranslations("WorkPanel");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllChartsData();
        
        if (response && response.code === "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT" && 
            response.payload && response.payload.visa_expiration_by_month) {
          const visaData = response.payload.visa_expiration_by_month.data.map((item: any) => ({
            month: item.label,
            count: item.count
          }));
          setData(visaData);
        }
      } catch (error) {
        console.error('Error fetching visa expiration data:', error);
      }
    };

    fetchData();
  }, [getAllChartsData]);

  const xLabels = data.map(d => d.month);

  return (
    <Box className="mt-6">
      <Typography variant="h6" className="text-right mb-2">
        {t("visaExpiryMonthly")}
      </Typography>
      <BarChart
        xAxis={[{ scaleType: 'band', data: xLabels }]}
        series={[
          { data: data.map(d => d.count), label: t("visaExpiryCount"), color: '#8884d8' }
        ]}

      />
    </Box>
  );
}

export default ZoomBarChart;
