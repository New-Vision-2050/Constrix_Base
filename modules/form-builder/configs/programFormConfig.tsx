import {FormConfig, useFormStore, FieldConfig} from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";
import axios from "axios";

// Define interfaces matching the API response structure
export interface ApiResponse {
  code: string;
  message: any;
  payload: Payload[];
}

// Define interfaces for the company access programs submission
export interface Root {
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

export interface Payload {
  id: string;
  name: string;
  slug: string;
  is_active: number;
  sub_entities: SubEntity[];
  children: Children[];
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

// Define a toast interface to handle the case where window.toast might not exist
interface ToastInterface {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// Safe toast function to avoid TypeScript errors
const safeToast = (): ToastInterface | undefined => {
  if (typeof window !== 'undefined' && (window as any).toast) {
    return (window as any).toast;
  }
  return undefined;
};

// Dynamic form configuration generator
export async function GetProgramFormConfig(t: ReturnType<typeof useTranslations>): Promise<FormConfig> {
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
      const processProgram = (program: Payload | Children, level: number = 0, parentPath: string = '') => {
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
      programs.forEach((program: Payload) => {
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
  
  // Get dynamic fields
  const dynamicFields = await generateDynamicFields();
  
  // Return the form configuration
  return {
    formId: "program-form",
    title: "اضافة برنامج",
    apiUrl: `${baseURL}/programs`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        collapsible: false,
        fields: [
          {
            type: "hiddenObject",
            name: "exist_user_id",
            label: "exist_user_id",
            defaultValue: "",
          },
          {
            name: "name",
            label: "اسم البرنامج",
            type: "text",
            placeholder: "اسم البرنامج",
            required: true,
          },
          // Add all dynamically generated checkbox fields
          ...dynamicFields
          ,  {
            name: "company_types",
            label: "الكيانات",
            type: "select",
            isMulti: true,
            placeholder: "اختر الكيانات",
            dynamicOptions: {
              url: `${baseURL}/company_types`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
          },
          {
            name: "company_fields",
            label: "مجالات ظهور البرنامج",
            type: "select",
            isMulti: true,
            placeholder: "اختر مجالات ظهور البرنامج",
            dynamicOptions: {
              url: `${baseURL}/company_fields`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
          },
           {
            name: "country_id",
            label: "دول الظهور",
            type: "select",
            isMulti: true,
            placeholder: "اختر دول الظهور",
            dynamicOptions: {
              url: `${baseURL}/countries`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
          },
        ],
      },
    ],
    // Dynamic fields are already loaded and included in the fields array
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    editDataTransformer: (data: any) => {
      return data;
    },
    // Success handler with proper error handling
    onSuccess: (values: any, result: any) => {
      console.log("Form submitted successfully with values:", values);
      console.log("Result from API:", result);

      // Show success notification
      const toast = safeToast();
      if (toast) {
        toast.success("تم إضافة البرنامج بنجاح");
      }
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      console.log("Form data received:", formData);
      
      try {
        // Transform form data to match the Root interface
        const transformedData: Root = {
          name: formData.name as string,
          programs: [],
          company_fields: Array.isArray(formData.company_fields) 
            ? (formData.company_fields as string[]) 
            : [],
          company_types: Array.isArray(formData.company_types) 
            ? (formData.company_types as string[]) 
            : [],
          countries: Array.isArray(formData.country_id) 
            ? (formData.country_id as number[]) 
            : []
        };

        // Process dynamic program fields to build programs array recursively
        const processedPrograms = new Map<string, Program>();
        
        // Helper function to collect all children (flattened structure)
        const collectAllChildren = (parentKey: string, allFormData: Record<string, unknown>): ApiChildren[] => {
          const children: ApiChildren[] = [];
          console.log(`Collecting children for parent key: ${parentKey}`);
          
          // Collect direct children
          Object.keys(allFormData).forEach(key => {
            if (key.startsWith(`${parentKey}_child_`) && !key.includes('_data')) {
              console.log(`Found child key: ${key}`);
              const childId = key.replace(`${parentKey}_child_`, '');
              const selectedOptions = (allFormData[key] as string[]) || [];
              const childDataKey = `${key}_data`;
              const childData = allFormData[childDataKey] as any;
              
              console.log(`Child ID: ${childId}`);
              console.log(`Child selected options:`, selectedOptions);
              console.log(`Child data key: ${childDataKey}`);
              console.log(`Child data:`, childData);
              
              // Include child program even if it has no selected sub_entities
              if (childData) {
                const childProgram: ApiChildren = {
                  id: childId,
                  sub_entities: selectedOptions.filter(option => option !== 'empty') // Remove 'empty' placeholder
                };
                
                console.log(`Adding child program:`, childProgram);
                children.push(childProgram);
                
                // Recursively collect nested children and add them to the same flat array
                const nestedChildren = collectAllChildren(key, allFormData);
                children.push(...nestedChildren);
              } else {
                console.log(`No child data found for key: ${childDataKey}`);
              }
            }
          });
          
          console.log(`Returning children for ${parentKey}:`, children);
          return children;
        };
        
        // Debug: Log all form data keys
        console.log('=== FORM DATA KEYS ===');
        Object.keys(formData).forEach(key => {
          console.log(`Key: ${key}, Value:`, formData[key]);
        });
        console.log('=== END FORM DATA KEYS ===');
        
        // Process main programs first
        Object.keys(formData).forEach(key => {
          if (key.startsWith('program_') && !key.includes('_data') && !key.includes('_child_')) {
            console.log(`Processing main program key: ${key}`);
            const programId = key.replace('program_', '');
            const selectedOptions = (formData[key] as string[]) || [];
            const programDataKey = `program_data_${programId}`;
            const programData = formData[programDataKey] as any;
            
            console.log(`Program ID: ${programId}`);
            console.log(`Selected options:`, selectedOptions);
            console.log(`Program data key: ${programDataKey}`);
            console.log(`Program data:`, programData);

            // Include program even if it has no selected sub_entities
            if (programData) {
              const program: Program = {
                id: programId,
                sub_entities: selectedOptions,
                children: collectAllChildren(key, formData)
              };
              
              console.log(`Adding program:`, program);
              processedPrograms.set(programId, program);
            } else {
              console.log(`No program data found for key: ${programDataKey}`);
            }
          }
        });
        
        // Convert to array
        transformedData.programs = Array.from(processedPrograms.values());

        console.log("Transformed data:", transformedData);

        // Send to the specified endpoint
        const response = await apiClient.post(`${baseURL}/company_access_programs`, transformedData);
        
        return {
          success: true,
          message: "تم إرسال البيانات بنجاح",
          data: response.data
        };
      } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
      }
    },
    // Comprehensive error handler
    onError: (values: any, error: any) => {
      console.error("Form submission failed with values:", values);
      console.error("Error details:", error);

      // Extract error message from different possible error formats
      let errorMessage = "حدث خطأ أثناء إضافة البرنامج";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Show error notification
      const toast = safeToast();
      if (toast) {
        toast.error(errorMessage);
      }
    },
  };
}
