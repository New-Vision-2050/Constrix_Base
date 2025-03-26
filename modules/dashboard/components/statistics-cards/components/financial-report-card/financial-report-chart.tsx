"use client";

import Chart from "react-apexcharts";

export default function FinancialReportChart() {
  const totalHours = "231h";

  // declare and define chart options
  const options = {
    chart: { sparkline: { enabled: true }, background: "transparent" },
    colors: ["#F42588", "#F7F7F9"],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: { theme: "dark" },
    dataLabels: { enabled: false },
    labels: ["74%", "26%"],
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
              formatter: (val) => `${val}%`,
            },
            total: {
              show: true,
              fontSize: "0.8125rem",
              label: "Total",
              formatter: () => totalHours,
            },
          },
        },
      },
    },
  };

  return (
    <div>
      <Chart
        type="donut"
        height={140}
        width={140}
        options={options}
        series={[74, 26]}
      />
    </div>
  );
}
