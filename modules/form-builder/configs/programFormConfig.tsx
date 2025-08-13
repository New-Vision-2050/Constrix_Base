import {FormConfig, FieldConfig} from "@/modules/form-builder";
import {  baseURL } from "@/config/axios-config";
import {useTranslations} from "next-intl";
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
  children?: Children[];
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
            required: true,
            dynamicOptions: {
              url: `${baseURL}/company_fields`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "برجاء اختيار النشاط",
              },
            ],
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
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    editDataTransformer: (data: any) => {
      data.company_fields = data.company_fields?.map((item: any) => item.id);
      data.company_types = data.company_types?.map((item: any) => item.id);
      data.country_id = data.countries?.map((item: any) => item.id);
  
      if (data.programs && Array.isArray(data.programs)) {
        const processProgram = (program: any, level: number = 0, parentPath: string = '') => {
          let programKey: string;
          if (level === 0) {
            programKey = `program_${program.id}`;
          } else {
            programKey = `${parentPath}_child_${program.id}`;
          }
          
          if (program.sub_entities && Array.isArray(program.sub_entities)) {
            const subEntityIds = program.sub_entities.map((item: any) => item.id || item);
            data[programKey] = subEntityIds;
          } else {
            data[programKey] = [];
          }
          
          const dataKey = level === 0 ? `program_data_${program.id}` : `${programKey}_data`;
          data[dataKey] = program;
          
          if (program.children && Array.isArray(program.children)) {
            program.children.forEach((child: any) => {
              processProgram(child, level + 1, programKey);
            });
          }
        };
        
        data.programs.forEach((program: any) => {
          processProgram(program, 0);
        });
        
        delete data.programs;
      }
      
      return data;
    },
    onSuccess: (values: any, result: any) => {
      console.log("Form submitted successfully with values:", values);

      const toast = safeToast();
      if (toast) {
        toast.success("تم إضافة البرنامج بنجاح");
      }
    },
    onSubmit: async (formData: Record<string, unknown>, formConfig: FormConfig) => {
      try {
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

        const processedPrograms = new Map<string, Program>();
        
        const collectAllChildren = (parentKey: string, allFormData: Record<string, unknown>): ApiChildren[] => {
          const children: ApiChildren[] = [];
          console.log(`Collecting children for parent key: ${parentKey}`);
          
          Object.keys(allFormData).forEach(key => {
            if (key.startsWith(`${parentKey}_child_`) && !key.includes('_data')) {
              console.log(`Found child key: ${key}`);
              const childId = key.replace(`${parentKey}_child_`, '');
              const selectedOptions = (allFormData[key] as string[]) || [];
              const childDataKey = `${key}_data`;
              const childData = allFormData[childDataKey] as any;
                         
              if (childData) {
                const childProgram: ApiChildren = {
                  id: childId,
                  sub_entities: selectedOptions.filter(option => option !== 'empty')
                };
                
                children.push(childProgram);
                
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
        
        transformedData.programs = Array.from(processedPrograms.values());

       return await defaultSubmitHandler(transformedData,formConfig);
      } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
      }
    },

  };
}
