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
            name: { offsetY: 14, fontSize: "0.7rem" },
            value: {
              offsetY: -10,
              fontSize: "0.875rem",
              fontWeight: 500,
              formatter: (val: string) => `${val}`,
            },
            total: {
              show: true,
              fontSize: "0.65rem",
              label: "Total",
              formatter: (): string => totalHours,
            },
          },
        },
      },
    },
  };

  return (
    <div className="w-[110px] h-[110px] flex items-center justify-center rounded-full overflow-hidden">
      <Chart
        type="donut"
        height={110}
        width={110}
        options={options}
        series={[35, 65]}
      />
    </div>
  );
}
