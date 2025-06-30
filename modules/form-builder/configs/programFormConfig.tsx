import {FormConfig, useFormStore, FieldConfig} from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
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
      const response = await axios.get(`${baseURL}/programs/sub_entities/list`);
      console.log('API Response:', response.data);
      
      // Array to store generated fields
      const generatedData: FieldConfig[] = [];
      
      // Check if the response has the expected structure
      if (response.data && response.data.payload && Array.isArray(response.data.payload)) {
        // Process each program in the payload
        response.data.payload.forEach((program: any) => {
          // Check if the program has sub_entities
          if (program.sub_entities && Array.isArray(program.sub_entities) && program.sub_entities.length > 0) {
            // Add a header/divider for this program section
            generatedData.push({
              type: "checkboxGroup" as const,
              name: `program_header_${program.id}`,
              label: program.name,
              placeholder: "",
              disabled: true,
              className: "font-bold text-lg border-b border-border pb-2 mb-4 mt-6"
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
