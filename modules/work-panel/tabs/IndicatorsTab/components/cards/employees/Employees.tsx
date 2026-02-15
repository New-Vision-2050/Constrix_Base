"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { ChartsLabelCustomMarkProps } from "@mui/x-charts/ChartsLabel";

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

export const Employees = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 200, height: 240 });
  const data = [
    { value: 90, label: "ذكر", color: "#7086FD", labelMarkType: "circle" },
    { value: 50, label: "انثي", color: "#6fd195", labelMarkType: "circle" },
    { value: 10, label: "غير محدد", color: "#FFA500", labelMarkType: "circle" }
  ];

  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.clientWidth ?? 200;
      const h = Math.max(220, Math.min(380, Math.round(w * 0.65)));
      setSize({ width: w, height: h });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Box
      ref={containerRef}
      className="mt-6 flex justify-center items-center"
    >
      <PieChart
        series={[
          {
            data: data,
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
        width={size.width}
        height={size.height}
      />
    </Box>
  );
};
