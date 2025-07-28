import {FormConfig, useFormStore, FieldConfig} from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";
import axios from "axios";
import { defaultSubmitHandler } from "../utils/defaultSubmitHandler";

// Define interfaces matching the API response structure
export interface ApiResponse {
  code: string;
  message: any;
  payload: Payload[];
}

// Define interfaces for the company access programs submission
export interface Root {
  id: string;
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
  children?: ApiChildren[];
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
export  function GetProgramFormConfig(t: ReturnType<typeof useTranslations>, dynamicFields: FieldConfig[]):FormConfig {
  // Return the form configuration
  return {
    formId: "program-form",
    title: "اضافة برنامج",
    apiUrl: `${baseURL}/company_access_programs`,
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
            validation: [
              {
                type: "required",
                message: "ادخل اسم البرنامج",
                
              },
            ],
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
            label: " انشطة ظهور البرنامج",
            type: "select",
            isMulti: true,
            placeholder: "اختر انشطة ظهور البرنامج",
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
      // Transform array objects to just IDs for select fields
      data.company_fields = data.company_fields?.map((item: any) => item.id);
      data.company_types = data.company_types?.map((item: any) => item.id);
      data.country_id = data.countries?.map((item: any) => item.id);
      
      return data;
    },
    // Success handler with proper error handling
    onSuccess: (values: any, result: any) => {
      console.log("Form submitted successfully with values:", values);

      // Show success notification
      const toast = safeToast();
      if (toast) {
        toast.success("تم إضافة البرنامج بنجاح");
      }
    },
    onSubmit: async (formData: Record<string, unknown>, formConfig: FormConfig) => {
      console.log("Form data received:", formData);
      
      try {
        // Transform form data to match the Root interface
        const transformedData: Root = {
          id:formData.id as string,
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
                         
              // Include child program even if it has no selected sub_entities
              if (childData) {
                const childProgram: ApiChildren = {
                  id: childId,
                  sub_entities: selectedOptions.filter(option => option !== 'empty') // Remove 'empty' placeholder
                };
                
                children.push(childProgram);
                
                // Recursively collect nested children and add them to the same flat array
                const nestedChildren = collectAllChildren(key, allFormData);
                children.push(...nestedChildren);
              } else {
                console.log(`No child data found for key: ${childDataKey}`);
              }
            }
          });
          
          return children;
        };
        
        // Process main programs first
        Object.keys(formData).forEach(key => {
          if (key.startsWith('program_') && !key.includes('_data') && !key.includes('_child_')) {
            const programId = key.replace('program_', '');
            const selectedOptions = (formData[key] as string[]) || [];
            const programDataKey = `program_data_${programId}`;
            const programData = formData[programDataKey] as any;

            // Include program even if it has no selected sub_entities
            if (programData) {
              const program: Program = {
                id: programId,
                sub_entities: selectedOptions,
                children: collectAllChildren(key, formData)
              };
              
              processedPrograms.set(programId, program);
            } else {
            }
          }
        });
        
        // Convert to array
        transformedData.programs = Array.from(processedPrograms.values());

        // Send to the specified endpoint
       return await defaultSubmitHandler(transformedData,formConfig);
      } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
      }
    },

  };
}
