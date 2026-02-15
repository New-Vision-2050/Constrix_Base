"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { ChartsLabelCustomMarkProps } from "@mui/x-charts/ChartsLabel";
import { useIndicatorsService } from '@/services/api/indicators/indicatorsService';

interface GenderData {
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

export const EmployeesChart = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 200, height: 240 });
  const [genderData, setGenderData] = useState<GenderData[]>([
    { value: 90, label: "ذكر", color: "#7086FD", labelMarkType: "circle" },
    { value: 50, label: "انثي", color: "#6fd195", labelMarkType: "circle" },
    { value: 10, label: "غير محدد", color: "#FFA500", labelMarkType: "circle" }
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
      <PieChart
        series={[
          {
            data: genderData,
            innerRadius: 0,
            outerRadius: undefined,
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
};
