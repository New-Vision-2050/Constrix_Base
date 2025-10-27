import React, { useState, useEffect } from "react";
import { TableBuilder } from "@/modules/table";
import {
  SheetFormBuilder,
} from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GetBouquetFormConfig } from "@/modules/form-builder/configs/bouquetFormConfig";
import StatisticsCardHeader from "@/modules/organizational-structure/components/StatisticsCard/StatisticsCardHeader";
import PersonStaticIcon from "@/public/icons/person-static";
import { apiClient, baseURL } from "@/config/axios-config";
import { bouquetConfig } from "@/modules/table/utils/configs/bouquetTableConfig";
import { useTableStore } from "@/modules/table/store/useTableStore";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import Can from "@/lib/permissions/client/Can";

// Interface for API response
interface Root {
  code: string;
  message: any;
  payload: Payload;
}

interface Payload {
  total_packages: number;
  active_packages: number;
  inactive_packages: number;
  total_companies: number;
}

function EntryPointBouquets() {
  const t = useTranslations("Bouquets");
  const config =  bouquetConfig();
  const [statisticsData, setStatisticsData] = useState<Payload | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState<boolean>(true);
  const {can} = usePermissions();
   const handleFormSuccess = (values: Record<string, unknown>) => {
      // Import the store directly to avoid hooks in callbacks
      const tableStore = useTableStore.getState();
  
      // Use the centralized reloadTable method from the TableStore
      tableStore.reloadTable(config.tableId);
  
      // After a short delay, set loading back to false
      setTimeout(() => {
        tableStore.setLoading(config.tableId, false);
      }, 100);
  
    
  
    };
  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatisticsLoading(true);
        const response = await apiClient.get(`${baseURL}/packages/counts`);
        console.log('Packages Statistics API Response:', response.data);
        
        // Handle API response structure
        const data: Root = response.data;
        setStatisticsData(data.payload);
      } catch (err) {
        console.error("Failed to fetch packages statistics:", err);
        // Set default values on error
        setStatisticsData({
          total_packages: 0,
          active_packages: 0,
          inactive_packages: 0,
          total_companies: 0
        });
      } finally {
        setStatisticsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="px-8 space-y-7">
      {/* Statistics Cards Group */}
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        <StatisticsCardHeader 
          title="اجمالي عدد الباقات" 
          number={statisticsLoading ? "..." : String(statisticsData?.total_packages || 0)} 
          icon={<PersonStaticIcon />} 
        />
        <StatisticsCardHeader 
          title="اجمالي مستخدمين البرنامج" 
          number={statisticsLoading ? "..." : String(statisticsData?.total_companies || 0)} 
          icon={<PersonStaticIcon />} 
        />
        <StatisticsCardHeader 
          title="اجمالي الباقات الفعالة" 
          number={statisticsLoading ? "..." : String(statisticsData?.active_packages || 0)} 
          icon={<PersonStaticIcon />} 
        />
        <StatisticsCardHeader 
          title="اجمالي الباقات غير الفعالة" 
          number={statisticsLoading ? "..." : String(statisticsData?.inactive_packages || 0)} 
          icon={<PersonStaticIcon />} 
        />
      </div>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
          <Can check={[PERMISSIONS.package.create]}>
            <SheetFormBuilder
              config={GetBouquetFormConfig(t, undefined)}
              trigger={<Button>اضافة باقة</Button>}
              onSuccess={handleFormSuccess}
              />
          </Can>
          </div>
        }
      />
    </div>
  );
}

export default withPermissions(EntryPointBouquets, [PERMISSIONS.package.list]);

