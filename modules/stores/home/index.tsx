"use client";

import StatisticsChart from "./components/StatisticsChart";
import StoresStatistics from "./components/StoresStatistics";
import RequestsTable from "./components/RequestsTable";

export default function HomeStore() {
  return (
    <div className="w-full min-h-screen   p-6" dir="rtl">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Statistics and Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatisticsChart />
          <StoresStatistics />
        </div>

        {/* Requests Table */}
        <RequestsTable />
      </div>
    </div>
  );
}
