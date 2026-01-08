import React, { useState, useEffect } from "react";
import { TableBuilder } from "@/modules/table";
import TableSkeleton from "@/modules/table/components/TableSkeleton";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { useRouter } from "@i18n/navigation";
import { programsConfig } from "@/modules/table/utils/configs/programsTableConfig";
import { Button } from "@/components/ui/button";
import { GetProgramFormConfig } from "@/modules/form-builder/configs/programFormConfig";
import PersonStaticIcon from "@/public/icons/person-static";
import StatisticsCardHeader from "@/modules/organizational-structure/components/StatisticsCard/StatisticsCardHeader";
import { apiClient, baseURL } from "@/config/axios-config";
import { FieldConfig } from "@/modules/form-builder";
import { useTableStore } from "@/modules/table/store/useTableStore";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

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

// Helper function to fetch programs data from API
const fetchProgramsData = async (): Promise<ProgramPayload[]> => {
  const response = await apiClient.get(
    `${baseURL}/role_and_permissions/permissions/hierarchy/detailed`
  );

  // Check HTTP status code
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `API request failed with status ${response.status}: ${response.statusText}`
    );
  }

  // Check if response has data
  if (!response.data) {
    throw new Error("API response contains no data");
  }

  // Process the response data
  const programs = Array.isArray(response.data)
    ? response.data
    : response.data?.payload && Array.isArray(response.data.payload)
    ? response.data.payload
    : [];

  if (programs.length === 0) {
    throw new Error("No programs data found in API response");
  }

  return programs;
};

// Helper function to generate program key and display name
const generateProgramIdentifiers = (
  program: ProgramPayload | Children,
  level: number,
  parentPath: string
) => {
  const indent = "  ".repeat(level);
  const programKey = parentPath
    ? `${parentPath}_child_${program.id}`
    : `program_${program.id}`;
  const displayName = level > 0 ? `${indent}↳ ${program.name}` : program.name;

  return { programKey, displayName };
};

// Helper function to extract sub-entity options from program
const extractSubEntityOptions = (
  program: ProgramPayload | Children
): SubProgramOption[] => {
  const allOptions: SubProgramOption[] = [];

  if (
    program.sub_entities &&
    Array.isArray(program.sub_entities) &&
    program.sub_entities.length > 0
  ) {
    const activeSubEntities = program.sub_entities.filter(
      (subEntity: SubEntity) => subEntity.name && subEntity.name.trim() !== ""
    );

    activeSubEntities.forEach((subEntity: SubEntity) => {
      allOptions.push({
        id: subEntity.id,
        name: subEntity.name,
        value: subEntity.id,
        label: subEntity.name,
        parentId: program.id,
      });
    });
  }

  return allOptions;
};

// Helper function to create checkbox group field
const createCheckboxGroupField = (
  programKey: string,
  displayName: string,
  options: SubProgramOption[],
  level: number,
  program: ProgramPayload | Children
): FieldConfig => {
  return {
    type: "checkboxGroup" as const,
    name: programKey,
    label: displayName,
    optionsTitle: displayName,
    isMulti: true,
    options: options,
    className:
      level === 0
        ? "font-bold text-xl border-b border-border pb-2 mb-4 mt-6"
        : "font-semibold text-lg ml-4 border-l-2 border-gray-300 pl-4 mb-3 mt-3",
    onChange: (value: any, formState: any) => {
      console.log(`Selected options for ${program.name}:`, value);
      return value;
    },
  };
};

// Helper function to create hidden data field
const createHiddenDataField = (
  programKey: string,
  program: ProgramPayload | Children,
  level: number,
  parentPath: string
): FieldConfig => {
  return {
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
      parentPath: parentPath,
    },
  };
};

const createEmptyChildField = (
  child: Children,
  level: number,
  programKey: string
): FieldConfig[] => {
  const childProgramKey = `${programKey}_child_${child.id}`;
  const childDisplayName = `${" ".repeat((level + 1) * 2)}↳ ${child.name}`;

  const checkboxField: FieldConfig = {
    type: "checkboxGroup" as const,
    name: childProgramKey,
    label: childDisplayName,
    optionsTitle: childDisplayName,
    isMulti: true,
    options: [
      {
        id: "empty",
        name: "↳",
        value: "empty",
        label: "↳",
        parentId: child.id,
      } as SubProgramOption,
    ],
    className:
      "font-semibold text-lg ml-4 border-l-2 border-gray-300 pl-4 mb-3 mt-3",
    onChange: (value: any, formState: any) => {
      console.log(`Empty child program ${child.name} - no sub_entities`);
      return [];
    },
  };

  const hiddenField: FieldConfig = {
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
      parentPath: programKey,
    },
  };

  return [checkboxField, hiddenField];
};

const processChildrenPrograms = (
  program: ProgramPayload | Children,
  level: number,
  programKey: string,
  generatedData: FieldConfig[],
  processProgram: (
    program: ProgramPayload | Children,
    level: number,
    parentPath: string
  ) => void
): void => {
  if (
    program.children &&
    Array.isArray(program.children) &&
    program.children.length > 0
  ) {
    program.children.forEach((child: Children) => {
      if (
        child.sub_entities &&
        Array.isArray(child.sub_entities) &&
        child.sub_entities.length > 0
      ) {
        processProgram(child, level + 1, programKey);
      } else {
        const emptyChildFields = createEmptyChildField(
          child,
          level,
          programKey
        );
        generatedData.push(...emptyChildFields);

        if (
          child.children &&
          Array.isArray(child.children) &&
          child.children.length > 0
        ) {
          const childProgramKey = `${programKey}_child_${child.id}`;
          child.children.forEach((nestedChild: Children) => {
            processProgram(nestedChild, level + 2, childProgramKey);
          });
        }
      }
    });
  }
};

const generateDynamicFields = async (): Promise<FieldConfig[]> => {
  try {
    const programs = await fetchProgramsData();

    const generatedData: FieldConfig[] = [];

    const processProgram = (
      program: ProgramPayload | Children,
      level: number = 0,
      parentPath: string = ""
    ) => {
      const { programKey, displayName } = generateProgramIdentifiers(
        program,
        level,
        parentPath
      );

      const allOptions = extractSubEntityOptions(program);

      if (allOptions.length > 0) {
        const checkboxField = createCheckboxGroupField(
          programKey,
          displayName,
          allOptions,
          level,
          program
        );
        const hiddenField = createHiddenDataField(
          programKey,
          program,
          level,
          parentPath
        );

        generatedData.push(checkboxField, hiddenField);
      }

      processChildrenPrograms(
        program,
        level,
        programKey,
        generatedData,
        processProgram
      );
    };

    programs.forEach((program: ProgramPayload) => {
      processProgram(program, 0);
    });

    return generatedData;
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return [];
  }
};

function EntryPointPrograms() {
  const t = useTranslations("Companies");
  const router = useRouter();
  const { can } = usePermissions();
  const [config, setConfig] = useState<any>(null);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statisticsData, setStatisticsData] =
    useState<StatisticsPayload | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState<boolean>(true);

  const handleFormSuccess = (values: Record<string, unknown>) => {
    const tableStore = useTableStore.getState();
    tableStore.reloadTable(config.tableId);
    setTimeout(() => {
      tableStore.setLoading(config.tableId, false);
    }, 100);
  };
  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatisticsLoading(true);
        const response = await apiClient.get(
          `${baseURL}/company_access_programs/counts`
        );
        console.log("Statistics API Response:", response.data);

        const data: { payload: StatisticsPayload } = response.data;
        setStatisticsData(data.payload);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);

        setStatisticsData({
          total_company_access_programs: 0,
          active_company_access_programs: 0,
          company_fields: 0,
          active_packages: 0,
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
        const tableConfig = programsConfig(
          t,
          router,
          dynamicFields,
          can(PERMISSIONS.companyAccessProgram.update),
          can(PERMISSIONS.companyAccessProgram.delete),
          can(PERMISSIONS.companyAccessProgram.export),
          can(PERMISSIONS.companyAccessProgram.view)
        );
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
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        <StatisticsCardHeader
          title="اجمالي عدد البرامج"
          number={
            statisticsLoading
              ? "..."
              : String(statisticsData?.total_company_access_programs || 0)
          }
          icon={<PersonStaticIcon />}
        />
        <StatisticsCardHeader
          title="اجمالي المجالات"
          number={
            statisticsLoading
              ? "..."
              : String(statisticsData?.company_fields || 0)
          }
          icon={<PersonStaticIcon />}
        />
        <StatisticsCardHeader
          title="اجمالي البرامج الفعالة"
          number={
            statisticsLoading
              ? "..."
              : String(statisticsData?.active_company_access_programs || 0)
          }
          icon={<PersonStaticIcon />}
        />
        <StatisticsCardHeader
          title="اجمالي الباقات الفعالة"
          number={
            statisticsLoading
              ? "..."
              : String(statisticsData?.active_packages || 0)
          }
          icon={<PersonStaticIcon />}
        />
      </div>

      <div>
        {config ? (
          <TableBuilder
            config={config}
            searchBarActions={
              <div className="flex items-center gap-3">
                <Can check={[PERMISSIONS.companyAccessProgram.create]}>
                  {loading ? (
                    <Button disabled>جاري التحميل...</Button>
                  ) : error ? (
                    <Button
                      variant="destructive"
                      onClick={() => window.location.reload()}
                    >
                      إعادة المحاولة
                    </Button>
                  ) : formConfig ? (
                    <SheetFormBuilder
                      config={formConfig}
                      trigger={<Button>اضافة برنامج</Button>}
                      onSuccess={handleFormSuccess}
                    />
                  ) : null}
                </Can>
              </div>
            }
          />
        ) : (
          <TableSkeleton
            columns={6}
            rows={5}
            showLoader={true}
            loadingText="جاري تحميل إعدادات الجدول..."
          />
        )}
      </div>
    </div>
  );
}

export default withPermissions(EntryPointPrograms, [
  PERMISSIONS.companyAccessProgram.list,
]);
