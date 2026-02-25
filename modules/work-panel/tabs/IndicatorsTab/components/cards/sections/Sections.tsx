"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

interface JobTypeData {
    value: number;
    label: string;
    color: string;
}

export function SectionsChart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 200, height: 240 });
  const [jobTypeData, setJobTypeData] = useState<JobTypeData[]>([
    { value: 45, label: "الموارد البشرية", color: "#6FD195" },
    { value: 20, label: "التقنية", color: "#7086FD" },
    { value: 8, label: "المالية", color: "#FFA500" }
  ]);
  const [totalEmployees, setTotalEmployees] = useState(73);
  const { getAllChartsData } = useIndicatorsService();

  useEffect(() => {
    const fetchJobTypeData = async () => {
      try {
        const apiResponse = await getAllChartsData();
        
        if (apiResponse && apiResponse.code === "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT" && 
            apiResponse.payload && apiResponse.payload.job_type) {
          const formattedJobTypeData = apiResponse.payload.job_type.data.map((item: any, index: number) => ({
            value: item.count,
            label: item.label,
            color: index === 0 ? "#6FD195" : index === 1 ? "#7086FD" : "#FFA500",
            labelMarkType: "circle"
          }));
          setJobTypeData(formattedJobTypeData);
          if (apiResponse.payload.job_type.total) {
            setTotalEmployees(apiResponse.payload.job_type.total);
          }
        }
      } catch (error) {
        console.error('Error fetching job type data:', error);
      }
    };

    fetchJobTypeData();
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
            data={jobTypeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
          >
            {jobTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, 'العدد']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
