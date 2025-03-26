"use client";
import Chart from "react-apexcharts";
import "./working-time-chart.css";

// Dummy data
const shiftData = {
  totalHours: "231h",
  totalMinutes: "14m",
  percentageChange: "+18.4%",
  chartSeries: [23, 35, 10, 20, 35, 23],
  chartLabels: ["36h", "56h", "16h", "32h", "56h", "16h"],
};

const chartOptions = {
  chart: {
    sparkline: { enabled: true },
    background: "transparent", // ✅ Removes overall chart background
  },
  labels: shiftData.chartLabels,
  colors: ["#1E40AF", "#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"],
  stroke: { width: 0 },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: { theme: "dark" },
  plotOptions: {
    pie: {
      customScale: 0.9,
      donut: {
        size: "70%",
        labels: {
          show: true,
          name: { offsetY: 20, fontSize: "0.875rem" },
          value: {
            offsetY: -15,
            fontWeight: 500,
            fontSize: "1.125rem",
            formatter: (value: string) => `${value}%`,
          },
          total: {
            show: true,
            fontSize: "0.8125rem",
            label: "Total",
            formatter: () => shiftData.totalHours,
          },
        },
      },
    },
  },
};

export default function WorkingTimeCardChart() {
  return (
    <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded-full">
      {/* Placeholder for the chart */}
      <Chart
        options={chartOptions}
        series={shiftData.chartSeries}
        type="donut"
        height={140}
        width={140}
      />
    </div>
  );
}
