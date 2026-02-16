"use client";

import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Box} from "@mui/material";

const data = [
  { value: 41,label: "figma",color: '#6FD195',labelMarkType: "circle" }, // Green
  { value: 80,label: "figma",color: '#7086FD',labelMarkType:"HTMLDiamond" },  // Blue
];

const size = {
  width: 200,
  height: 200,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export function Sections() {
  return (
    <Box 
      className="mt-6 flex justify-center items-center"
    >

      <PieChart series={[{ data, innerRadius: 80, outerRadius: 100 }]} {...size}>
        <PieCenterLabel>121</PieCenterLabel>
      </PieChart>
    </Box>
  );
}
