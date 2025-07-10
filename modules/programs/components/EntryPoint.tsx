import React, { useState, useEffect } from "react";
import { TableBuilder } from "@/modules/table";
import {
  SheetFormBuilder,
  FormConfig
} from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { programsConfig } from "@/modules/table/utils/configs/programsTableConfig";
import { Button } from "@/components/ui/button";
import { GetProgramFormConfig } from "@/modules/form-builder/configs/programFormConfig";
import PersonStaticIcon from "@/public/icons/person-static";
import StatisticsCardHeader from "@/modules/organizational-structure/components/StatisticsCard/StatisticsCardHeader";
import { apiClient, baseURL } from "@/config/axios-config";
import { FieldConfig } from "@/modules/form-builder";
import { useTableStore } from "@/modules/table/store/useTableStore";

// Define interfaces matching the API response structure
export interface ApiResponse {
  code: string;
  message: any;
  payload: ProgramPayload[];
}

// Define interfaces for the company access programs submission
export interface SubmitRoot {
  name: string;
  programs: Program[];
  company_fields: string[];
  company_types: string[];
  countries: number[];
}

export interface Program {
  id: string;
  sub_entities: any[];
  children: ApiChildren[];
}

export interface ApiChildren {
  id: string;
  sub_entities: any[];
}

export interface Children {
  id: string;
  name: string;
  slug: string;
  is_active: number;
  sub_entities: SubEntity[];
  children?: Children[]; // Recursive children
}

export interface SubEntity {
  id: string;
  name: string;
  slug: string;
  main_program_id: string;
  super_entity: string;
  origin_super_entity: string;
  is_active: number;
  children: any[];
}

// Interface for checkbox options
interface SubProgramOption {
  id: string;
  name: string;
  value: string;
  label: string;
  parentId?: string;
  [key: string]: any;
}

// Interface for API response

interface StatisticsPayload {
  total_company_access_programs: number;
  active_company_access_programs: number;
  company_fields: number;
  active_packages: number;
}

// The payload from the API for programs list
export interface ProgramPayload {
    id: string;
    name: string;
    slug: string;
    is_active: number;
    sub_entities: SubEntity[];
    children: Children[];
}

// This function generates dynamic fields based on API data
const generateDynamicFields = async (): Promise<FieldConfig[]> => {
  try {
    // Fetch data from API
    const response = await apiClient.get(`${baseURL}/programs/sub_entities/select/list`);
    console.log('API Response:', response.data);
    
    // Array to store generated fields
    const generatedData: FieldConfig[] = [];
    
    // Process the response data
    const programs = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.payload && Array.isArray(response.data.payload)) 
        ? response.data.payload 
        : [];
        
    // Recursive function to process programs and their children
    const processProgram = (program: ProgramPayload | Children, level: number = 0, parentPath: string = '') => {
      const indent = '  '.repeat(level);
      const programKey = parentPath ? `${parentPath}_child_${program.id}` : `program_${program.id}`;
      const displayName = level > 0 ? `${indent}↳ ${program.name}` : program.name;
      
      // Collect all options for this program level
      const allOptions: SubProgramOption[] = [];
      
      // Add sub_entities as options
      if (program.sub_entities && Array.isArray(program.sub_entities) && program.sub_entities.length > 0) {
        const activeSubEntities = program.sub_entities.filter((subEntity: SubEntity) => 
          subEntity.name && subEntity.name.trim() !== ''
        );
        
        activeSubEntities.forEach((subEntity: SubEntity) => {
          allOptions.push({
            id: subEntity.id,
            name: subEntity.name,
            value: subEntity.id,
            label: subEntity.name,
            parentId: program.id
          });
        });
      }
      
      // Children programs are not added to main program options
      // They will be processed separately as their own checkbox groups
      
      // Create checkbox group if there are options
      if (allOptions.length > 0) {
        generatedData.push({
          type: "checkboxGroup" as const,
          name: programKey,
          label: displayName,
          optionsTitle: displayName,
          isMulti: true,
          options: allOptions,
          className: level === 0 
            ? "font-bold text-xl border-b border-border pb-2 mb-4 mt-6"
            : "font-semibold text-lg ml-4 border-l-2 border-gray-300 pl-4 mb-3 mt-3",
          onChange: (value: any, formState: any) => {
            console.log(`Selected options for ${program.name}:`, value);
            return value;
          }
        });
        
        // Store program data
        generatedData.push({
          type: "hiddenObject" as const,
          name: level === 0 ? `program_data_${program.id}` : `${programKey}_data`,
          label: "",
          defaultValue: {
            programId: program.id,
            programName: program.name,
            programSlug: program.slug,
            isActive: program.is_active,
            subEntities: program.sub_entities || [],
            children: program.children || [],
            level: level,
            parentPath: parentPath
          }
        });
      }
      
      // Recursively process children programs
      if (program.children && Array.isArray(program.children) && program.children.length > 0) {
        program.children.forEach((child: Children) => {
          // Check if child has sub_entities
          if (child.sub_entities && Array.isArray(child.sub_entities) && child.sub_entities.length > 0) {
            // Child has sub_entities, process normally
            processProgram(child, level + 1, programKey);
          } else {
            // Child has no sub_entities, create a special checkbox group with only ↳
            const childProgramKey = `${programKey}_child_${child.id}`;
            const childDisplayName = `${' '.repeat((level + 1) * 2)}↳ ${child.name}`;
            
            generatedData.push({
              type: "checkboxGroup" as const,
              name: childProgramKey,
              label: childDisplayName,
              optionsTitle: childDisplayName,
              isMulti: true,
              options: [{
                id: 'empty',
                name: '↳',
                value: 'empty',
                label: '↳',
                parentId: child.id
              } as SubProgramOption],
              className: "font-semibold text-lg ml-4 border-l-2 border-gray-300 pl-4 mb-3 mt-3",
              onChange: (value: any, formState: any) => {
                console.log(`Empty child program ${child.name} - no sub_entities`);
                return [];
              }
            });
            
            // Store child data
            generatedData.push({
              type: "hiddenObject" as const,
              name: `${childProgramKey}_data`,
              label: "",
              defaultValue: {
                programId: child.id,
                programName: child.name,
                programSlug: child.slug,
                isActive: child.is_active,
                subEntities: [],
                children: child.children || [],
                level: level + 1,
                parentPath: programKey
              }
            });
            
            // Continue processing nested children if they exist
            if (child.children && Array.isArray(child.children) && child.children.length > 0) {
              child.children.forEach((nestedChild: Children) => {
                processProgram(nestedChild, level + 2, childProgramKey);
              });
            }
          }
        });
      }
    };
    
    // Process each main program recursively
    programs.forEach((program: ProgramPayload) => {
      processProgram(program, 0);
    });
    
    if (programs.length === 0) {
      console.error('Unexpected API response structure:', response.data);
    }
    
    return generatedData;
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return []; // Return empty array if there's an error
  }
};

function EntryPointPrograms() {
  const t = useTranslations("Companies");
  const router = useRouter();
  const [config, setConfig] = useState<any>(null);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statisticsData, setStatisticsData] = useState<StatisticsPayload | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState<boolean>(true);

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
        const response = await apiClient.get(`${baseURL}/company_access_programs/counts`);
        console.log('Statistics API Response:', response.data);
        
        // Handle API response structure
        const data: { payload: StatisticsPayload } = response.data;
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
        const dynamicFields = await generateDynamicFields();
        const formConfig = GetProgramFormConfig(t, dynamicFields);
        const tableConfig = programsConfig(t, router, dynamicFields);
        setFormConfig(formConfig);
        setConfig(tableConfig);
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

      <div className="bg-white rounded-lg shadow-lg">
        {config ? (
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
                     onSuccess={handleFormSuccess}
                  />
                ) : null}
              </div>
            }
          />
        ) : (
          <div>Loading configuration...</div>
        )}
      </div>
    </div>
  );
}

export default EntryPointPrograms;
