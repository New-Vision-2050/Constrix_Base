"use client";
import dynamic from "next/dynamic";
import "./working-time-chart.css";
import { useUserDashboardCxt } from "@/modules/dashboard/context/user-dashboard-cxt";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function WorkingTimeCardChart() {
  const { overview } = useUserDashboardCxt();

  const attendance = overview?.attendance;
  const workedHours = attendance?.worked?.hours ?? 0;
  const totalHours = `${workedHours}h`;
  const donut = attendance?.donut ?? [{ key: "worked", value: 0 }, { key: "remaining", value: 1 }];
  const series = donut.map((d) => d.value);
  const labels = donut.map((d) => d.key);

  const safeSeriesTotal = series.reduce((a, b) => a + b, 0);
  const safeSeries = safeSeriesTotal === 0 ? series.map((_, i) => (i === 1 ? 1 : 0)) : series;

  // declare chart options
  const options = {
    chart: { sparkline: { enabled: true }, background: "transparent" },
    colors: ["#1E40AF", "#3B82F6"],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: { theme: "dark" },
    dataLabels: { enabled: false },
    labels,
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
        series={safeSeries}
      />
    </div>
  );
}
