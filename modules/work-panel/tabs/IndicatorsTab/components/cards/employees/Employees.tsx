"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

interface GenderData {
    value: number;
    label: string;
    color: string;
}

export const EmployeesChart = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 200, height: 240 });
  const [genderData, setGenderData] = useState<GenderData[]>([
    { value: 90, label: "ذكر", color: "#7086FD" },
    { value: 50, label: "انثي", color: "#6fd195" },
    { value: 10, label: "غير محدد", color: "#FFA500" }
  ]);
  const { getAllChartsData } = useIndicatorsService();

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const apiResponse = await getAllChartsData();
        
        if (apiResponse && apiResponse.code === "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT" && 
            apiResponse.payload && apiResponse.payload.gender) {
          const formattedGenderData = apiResponse.payload.gender.data.map((item: any) => ({
            value: item.count,
            label: item.label,
            color: item.code === "male" ? "#7086FD" : 
                   item.code === "female" ? "#6fd195" : "#FFA500",
            labelMarkType: "circle"
          }));
          setGenderData(formattedGenderData);
        }
      } catch (error) {
        console.error('Error fetching gender data:', error);
      }
    };

    fetchGenderData();
  }, [getAllChartsData]);

  useEffect(() => {
    const updateChartSize = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 200;
      const containerHeight = Math.max(220, Math.min(380, Math.round(containerWidth * 0.65)));
      setChartSize({ width: containerWidth, height: containerHeight });
    };
    updateChartSize();
    window.addEventListener("resize", updateChartSize);
    return () => window.removeEventListener("resize", updateChartSize);
  }, []);

  return (
    <Box
      ref={containerRef}
      className="mt-6 flex justify-center items-center"
    >
      <ResponsiveContainer width={chartSize.width} height={chartSize.height}>
        <PieChart>
          <Pie
            data={genderData}
            cx="50%"
            cy="50%"
            outerRadius={Math.min(chartSize.width, chartSize.height) / 3}
            fill="#8884d8"
            dataKey="value"
            label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
          >
            {genderData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, 'العدد']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};
