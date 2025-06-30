import {FormConfig, useFormStore, FieldConfig} from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";
import axios from "axios";

// Define interfaces for the dynamic options
interface SubEntity {
  id: string | number;
  name: string;
  options: Array<{
    id: string | number;
    name: string;
    [key: string]: any;
  }>;
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
      const response = await apiClient.get(`${baseURL}/programs/sub_entities/list`);
      console.log('API Response:', response.data);
      
      // Array to store generated fields
      const generatedData: FieldConfig[] = [];
      
      // Process the response data
      if (Array.isArray(response.data)) {
        // Process each main program
        response.data.forEach((program: any) => {
          // Check if the program has sub_entities
          if (program.sub_entities && Array.isArray(program.sub_entities) && program.sub_entities.length > 0) {
            // Create options array from sub_entities
            const options = program.sub_entities.map((subEntity: any) => ({
              id: subEntity.id,
              name: subEntity.name,
              // Include any additional fields needed
              value: subEntity.id,
              label: subEntity.name
            }));
            
            // Add a checkboxGroup for the main program with its sub-entities as options
            generatedData.push({
              type: "checkboxGroup" as const,
              name: `program_${program.id}`,
              label: program.name,
              optionsTitle: program.name,
              options: options,
              className: "font-bold text-lg border-b border-border pb-2 mb-2 mt-6"
            });
            
            // Store program sub_entities in a hidden field for reference
            generatedData.push({
              type: "hiddenObject" as const,
              name: `program_data_${program.id}`,
              label: "",
              defaultValue: {
                programId: program.id,
                programName: program.name,
                subEntities: program.sub_entities
              }
            });
          } else {
            // For programs without sub-entities, just show a regular checkbox
            generatedData.push({
              type: "checkbox" as const,
              name: `program_${program.id}`,
              label: program.name,
              className: "font-bold text-lg border-b border-border pb-2 mb-2 mt-6"
            });
          }
        });
      } else if (response.data && response.data.payload && Array.isArray(response.data.payload)) {
        // Alternative response structure
        response.data.payload.forEach((program: any) => {
          // Check if the program has sub_entities
          if (program.sub_entities && Array.isArray(program.sub_entities) && program.sub_entities.length > 0) {
            // Create options array from sub_entities
            const options = program.sub_entities.map((subEntity: any) => ({
              id: subEntity.id,
              name: subEntity.name,
              // Include any additional fields needed
              value: subEntity.id,
              label: subEntity.name
            }));
            
            // Add a checkboxGroup for the main program with its sub-entities as options
            generatedData.push({
              type: "checkboxGroup" as const,
              name: `program_${program.id}`,
              label: program.name,
              isMulti:true,
              optionsTitle: program.name,
              options: options,
              className: "font-bold text-lg border-b border-border pb-2 mb-2 mt-6"
            });
            
            // Store program sub_entities in a hidden field for reference
            generatedData.push({
              type: "hiddenObject" as const,
              name: `program_data_${program.id}`,
              label: "",
              defaultValue: {
                programId: program.id,
                programName: program.name,
                subEntities: program.sub_entities
              }
            });
          } else {
            // For programs without sub-entities, just show a regular checkbox
            generatedData.push({
              type: "checkbox" as const,
              name: `program_${program.id}`,
              label: program.name,
              className: "font-bold text-lg border-b border-border pb-2 mb-2 mt-6"
            });
          }
        });
      } else {
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
