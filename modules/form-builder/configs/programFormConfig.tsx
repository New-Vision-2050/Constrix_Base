import {FormConfig, useFormStore, FieldConfig} from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";
import axios from "axios";

// Define interfaces matching the user's API structure
export interface Root {
  code: string;
  message: any;
  payload: Payload[];
}

export interface Payload {
  id: string;
  name: string;
  slug: string;
  is_active: number;
  sub_entities: SubEntity[];
  children: any[];
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
          
      // Process each main program
      programs.forEach((program: Payload) => {
        // Check if the program has sub_entities (subprograms) and they are not empty
        if (program.sub_entities && Array.isArray(program.sub_entities) && program.sub_entities.length > 0) {
          // Filter out inactive or empty sub-entities if needed
          const activeSubEntities = program.sub_entities.filter((subEntity: SubEntity) => 
            subEntity.name && subEntity.name.trim() !== ''
          );
          
          // Only create checkboxGroup if there are active sub-entities
          if (activeSubEntities.length > 0) {
            // Create subprogram options from active sub_entities
            const subProgramOptions: SubProgramOption[] = activeSubEntities.map((subEntity: SubEntity) => ({
              id: subEntity.id,
              name: subEntity.name,
              value: subEntity.id,
              label: subEntity.name,
              parentId: program.id
            }));
            
            // Create main program checkboxGroup with subprograms as options
            generatedData.push({
              type: "checkboxGroup" as const,
              name: `program_${program.id}`,
              label: program.name, // Main program name from Payload
              optionsTitle: `${program.name}`,
              isMulti: true,
              options: subProgramOptions,
              className: "font-bold text-xl border-b border-border pb-2 mb-4 mt-6",
              onChange: (value: any, formState: any) => {
                // Optional: Add any custom logic when subprograms are selected/deselected
                console.log(`Selected subprograms for ${program.name}:`, value);
                return value;
              }
            });
            
            // Store program data in a hidden field for reference
            generatedData.push({
              type: "hiddenObject" as const,
              name: `program_data_${program.id}`,
              label: "",
              defaultValue: {
                programId: program.id,
                programName: program.name,
                programSlug: program.slug,
                isActive: program.is_active,
                subEntities: activeSubEntities
              }
            });
          }
        }
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
    onSubmit:async (formData: Record<string, unknown>) => {
      // Log the form data (to use the parameter)
      console.log("Form data received:", formData);
      
      return {
        success: true,
        message: "Item added successfully",
      };
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
