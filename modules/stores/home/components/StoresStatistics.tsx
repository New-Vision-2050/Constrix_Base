"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { getWarehousesTable } from "@/services/api/ecommerce/home/getWarehousesTable";

export default function StoresStatistics() {
  // Fetch warehouses data
  const { data: warehousesResponse, isLoading } = useQuery({
    queryKey: ["warehouses-table"],
    queryFn: getWarehousesTable,
  });

  const statistics = warehousesResponse?.payload || [];

  return (
    <Card className="bg-sidebar/50 p-6">
      <h2 className="text-white text-xl mb-6 text-right">المخازن</h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      ) : (
        <div className="space-y-0">
          {/* Header Row */}
          <div className="grid grid-cols-2 gap-4 text-gray-400 text-sm pb-3 border-b ">
            <div className="text-center">المخزن</div>
            <div className="text-center">عدد المنتجات في المخزن</div>
          </div>

          {/* Data Rows */}
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-4 text-white py-4 border-b "
            >
              <div className="text-center">{stat.name}</div>
              <div className="text-center">{stat.products_count}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
