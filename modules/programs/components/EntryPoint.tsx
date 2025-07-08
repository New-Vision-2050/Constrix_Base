import React, { useState, useEffect } from "react";
import { TableBuilder } from "@/modules/table";
import {
  SheetFormBuilder,
  FormConfig
} from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { programsConfig } from "@/modules/table/utils/configs/programsTableConfig";
import { Button } from "@/components/ui/button";
import { GetProgramFormConfig } from "@/modules/form-builder/configs/programFormConfig";
import PersonStaticIcon from "@/public/icons/person-static";
import StatisticsCardHeader from "@/modules/organizational-structure/components/StatisticsCard/StatisticsCardHeader";
import { apiClient, baseURL } from "@/config/axios-config";

// Interface for API response
interface Root {
  code: string;
  message: any;
  payload: Payload;
}

interface Payload {
  total_company_access_programs: number;
  active_company_access_programs: number;
  company_fields: number;
  active_packages: number;
}

function EntryPointPrograms() {
  const t = useTranslations("Companies");
  const config = programsConfig();
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statisticsData, setStatisticsData] = useState<Payload | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState<boolean>(true);

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatisticsLoading(true);
        const response = await apiClient.get(`${baseURL}/company_access_programs/counts`);
        console.log('Statistics API Response:', response.data);
        
        // Handle API response structure
        const data: Root = response.data;
        setStatisticsData(data.payload);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        // Set default values on error
        setStatisticsData({
          total_company_access_programs: 0,
          active_company_access_programs: 0,
          company_fields: 0,
          active_packages: 0
        });
      } finally {
        setStatisticsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const loadFormConfig = async () => {
      try {
        setLoading(true);
        const config = await GetProgramFormConfig(t);
        setFormConfig(config);
        setError(null);
      } catch (err) {
        console.error("Failed to load program form config:", err);
        setError("Failed to load form configuration");
      } finally {
        setLoading(false);
      }
    };

    loadFormConfig();
  }, [t]);

  return (
    <div className="px-8 space-y-7">
      {/* Statistics Cards Group */}
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        <StatisticsCardHeader 
          title="اجمالي عدد البرامج" 
          number={statisticsLoading ? "..." : String(statisticsData?.total_company_access_programs || 0)} 
          icon={<PersonStaticIcon />} 
        />
        <StatisticsCardHeader 
          title="اجمالي المجالات" 
          number={statisticsLoading ? "..." : String(statisticsData?.company_fields || 0)} 
          icon={<PersonStaticIcon />} 
        />
        <StatisticsCardHeader 
          title="اجمالي البرامج الفعالة" 
          number={statisticsLoading ? "..." : String(statisticsData?.active_company_access_programs || 0)} 
          icon={<PersonStaticIcon />} 
        />
        <StatisticsCardHeader 
          title="اجمالي الباقات الفعالة" 
          number={statisticsLoading ? "..." : String(statisticsData?.active_packages || 0)} 
          icon={<PersonStaticIcon />} 
        />
      </div>

      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            {loading ? (
              <Button disabled>جاري التحميل...</Button>
            ) : error ? (
              <Button variant="destructive" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
            ) : formConfig ? (
              <SheetFormBuilder
                config={formConfig}
                trigger={<Button>اضافة برنامج</Button>}
                onSuccess={(values) => {
                  console.log("Form submitted successfully:", values);
                }}
              />
            ) : null}
          </div>
        }
      />
    </div>
  );
}

export default EntryPointPrograms;
