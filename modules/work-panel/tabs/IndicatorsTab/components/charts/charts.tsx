"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

export function ZoomBarChart() {
  const [data, setData] = useState<any[]>([]);
  const { getAllChartsData } = useIndicatorsService();

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

  return (
    <Box className="mt-6">
      <Typography variant="h6" className="text-right mb-2">
        انتهاء التأشيرات شهرياً
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="عدد انتهاء التأشيرات" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default ZoomBarChart;
