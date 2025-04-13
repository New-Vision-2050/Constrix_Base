"use client";
import dynamic from "next/dynamic";
import "./working-time-chart.css";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function WorkingTimeCardChart() {
  // declare and define component state and variables
  const totalHours = "231h";

  // declare chart options
  const options = {
    chart: { sparkline: { enabled: true }, background: "transparent" },
    colors: ["#1E40AF", "#3B82F6"],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: { theme: "dark" },
    dataLabels: { enabled: false },
    labels: ["36%", "56%"],
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
              fontSize: "1.125rem",
              fontWeight: 500,
              formatter: (val: string) => `${val}`,
            },
            total: {
              show: true,
              fontSize: "0.8125rem",
              label: "Total",
              formatter: (): string => totalHours,
            },
          },
        },
      },
    },
  };

  return (
    <div className="w-36 h-36 flex items-center justify-center  rounded-full">
      {/* Placeholder for the chart */}
      <Chart
        type="donut"
        height={140}
        width={140}
        options={options}
        series={[35, 65]}
      />
    </div>
  );
}
