"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  getOrdersChart,
  ChartPeriod,
} from "@/services/api/ecommerce/home/getOrdersChart";

export default function StatisticsChart() {
  const [period, setPeriod] = useState<ChartPeriod>("week");

  // Fetch chart data based on selected period
  const { data: chartResponse, isLoading } = useQuery({
    queryKey: ["orders-chart", period],
    queryFn: () => getOrdersChart(period),
  });

  // Transform API data to chart format
  const chartData =
    chartResponse?.payload?.labels.map((label, index) => ({
      day: label,
      value: chartResponse.payload.data[index],
    })) || [];

  return (
    <Card className="lg:col-span-2 bg-sidebar/50  p-6">
      <div className="flex flex-row items-center mb-6 justify-around">
        <h2 className="text-white text-xl mb-4">إحصائيات الطلبات</h2>

        {/* Tabs in header */}
        <Tabs
          defaultValue="week"
          value={period}
          onValueChange={(value) => setPeriod(value as ChartPeriod)}
          className="w-auto"
        >
          <TabsList className="bg-transparent border-b-0 h-auto p-0 gap-6">
            <TabsTrigger
              value="week"
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-white text-white data-[state=active]:text-white rounded-none px-0 pb-2 h-auto"
            >
              الاسبوع
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-white text-white data-[state=active]:text-white rounded-none px-0 pb-2 h-auto"
            >
              الشهر
            </TabsTrigger>
            <TabsTrigger
              value="year"
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-white text-white data-[state=active]:text-white rounded-none px-0 pb-2 h-auto"
            >
              السنة
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a2870" />
            <XAxis dataKey="day" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#e91e63"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
