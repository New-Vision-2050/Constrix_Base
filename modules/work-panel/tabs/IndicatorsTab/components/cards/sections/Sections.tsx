"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { ChartsLabelCustomMarkProps } from "@mui/x-charts/ChartsLabel";
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

interface JobTypeData {
    value: number;
    label: string;
    color: string;
    labelMarkType: string;
}

function HTMLDiamond({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <div
      className={className}
      style={{ transform: "scale(0.6, 0.75) rotate(45deg)", background: color }}
    />
  );
}

function SVGStar({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path
        className={className}
        d="M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z"
        fill={color}
      />
    </svg>
  );
}

export function SectionsChart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 200, height: 240 });
  const [jobTypeData, setJobTypeData] = useState<JobTypeData[]>([
    { value: 45, label: "الموارد البشرية", color: "#6FD195", labelMarkType: "circle" },
    { value: 20, label: "التقنية", color: "#7086FD", labelMarkType: "circle" },
    { value: 8, label: "المالية", color: "#FFA500", labelMarkType: "circle" }
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
      <PieChart
        series={[
          {
            data: jobTypeData,
            innerRadius: 60,
            outerRadius: 80,
          },
        ]}
        slotProps={{
          legend: { 
            hidden: true,
            position: { vertical: 'middle', horizontal: 'end' },
          },
        }}
        width={chartSize.width}
        height={chartSize.height}
      />
    </Box>
  );
}
