import {FormConfig, useFormStore} from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";
import { defaultSubmitHandler } from "../utils/defaultSubmitHandler";
import { useParams } from "next/navigation";

// Create a config function that accepts id as a parameter instead of using hooks directly
export function GetBouquetFormConfig(t:ReturnType<typeof useTranslations>, id?: string): FormConfig {
  const params = useParams();
  const packageId = params && typeof params.id === 'string' ? params.id : '';
  
    return {
      formId: "bouquet-form",
      title: "اضافة باقة",
      apiUrl: `${baseURL}/packages`,
      laravelValidation: {
        enabled: true,
        errorsPath: "errors", // This is the default in Laravel
      },
      sections: [
        {
          collapsible: false,
          fields: [
            {
              name: "name",
              label: "اسم الباقة",
              type: "text",
              placeholder: "اسم الباقة",
              required: true,
            },
             {
              name: "currency",
              label: "currency",
              placeholder: "currency",
              type: "hiddenObject",
             
            },
            {
              name: "price",
              label: "قيمة الاشتراك",
              type: "number",
              placeholder: "أدخل قيمة الاشتراك",
              required: true,
              defaultValue: "12",
              postfix: (
                <div className="w-full h-full">
                  <select
                    className="rounded-lg p-2 bg-transparent border-0 outline-none"
                    defaultValue="EGP"
                    onChange={(e) => {
                      useFormStore
                        .getState()
                        .setValues("bouquet-form", {
                          currency: e.target.value,
                        });
                    }}
                  >
                    <option value="USD" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                    ر.س
                    </option>
                    <option value="EGP" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                    ج.م
                    </option>
                  </select>
                </div>
              ),
            },
           
            {
            name: "subscription_period_unit",
            label: "subscription_period_unit",
            placeholder: "subscription_period_unit",
            type: "hiddenObject",
           
            },
            {
              name: "subscription_period",
              label: "مدة الاشتراك",
              type: "number",
              placeholder: "أدخل مدة الاشتراك",
              required: true,
              defaultValue: "12",
              postfix: (
                <div className="w-full h-full">
                  <select
                    className="rounded-lg p-2 bg-transparent border-0 outline-none"
                    defaultValue="month"
                    onChange={(e) => {
                      useFormStore
                        .getState()
                        .setValues("bouquet-form", {
                          subscription_period_unit: e.target.value,
                        });
                    }}
                  >
                    <option value="day" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      يوم
                    </option>
                    <option value="week" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      أسبوع
                    </option>
                    <option value="month" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      شهر
                    </option>
                    <option value="year" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      سنة
                    </option>
                  </select>
                </div>
              ),
            },
           
            {
              name: "trial_period_unit",
              label: "trial_period_unit",
              placeholder: "trial_period_unit",
              type: "hiddenObject",
             
            },
            {
              name: "trial_period",
              label: "مدة الفترة التجريبية",
              type: "number",
              placeholder: "أدخل مدة الفترة التجريبية",
              required: true,
              defaultValue: "12",
              postfix: (
                <div className="w-full h-full">
                  <select
                    className="rounded-lg p-2 bg-transparent border-0 outline-none"
                    defaultValue="month"
                    onChange={(e) => {
                      useFormStore
                        .getState()
                        .setValues("bouquet-form", {
                          trial_period_unit: e.target.value,
                        });
                    }}
                  >
                    <option value="day" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      يوم
                    </option>
                    <option value="week" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      أسبوع
                    </option>
                    <option value="month" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      شهر
                    </option>
                    <option value="year" className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      سنة
                    </option>
                  </select>
                </div>
              ),
            },
          
          {
            name: "company_fields",
            label: "مجالات ظهور البرنامج",
            type: "select",
            isMulti: true,
            placeholder: "اختر مجالات ظهور البرنامج",
            dynamicOptions: {
              url: `${baseURL}/company_fields?company_access_program_id=${packageId}`,
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
            name: "countries",
            label: "دول الظهور",
            type: "select",
            isMulti: true,
            placeholder: "اختر دول الظهور",
            dynamicOptions: {
              url: `${baseURL}/countries?company_access_program_id=${packageId}`,
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
      editDataTransformer: (data) => {
        return {
          name: data.name,
          price: data.price,
          duration: data.duration,
          category: data.category,
          features_count: data.features_count,
          description: data.description,
          features: data.features,
          status: data.status,
        };
      },

      // Example onSuccess handler
      onSuccess: (values, result) => {
        console.log("Bouquet form submitted successfully with values:", values);
        console.log("Result from API:", result);

        // You can perform additional actions here, such as:
        // - Show a custom notification
        // - Navigate to another page
        // - Update application state
        // - Trigger analytics events
        // - etc.
      },
      onSubmit: async (formData: Record<string, unknown>, formConfig: FormConfig) => {
        // Log the form data
        console.log("Form data received:", formData);
        
        try {
          // Transform form data to match API structure
          const transformedData = {
            id:formData.id,
            company_access_program_id: packageId,
            name: formData.name as string,
            price: Number(formData.price) ,
            currency: (formData.currency as string) || 'EGP', // Default to EGP if not selected
            subscription_period: Number(formData.subscription_period) ,
            subscription_period_unit: (formData.subscription_period_unit as string) || 'month', // Default to month if not selected
            trial_period: Number(formData.trial_period) ,
            trial_period_unit: (formData.trial_period_unit as string) || 'month', // Default to month if not selected
            countries: formData.countries as string[] ,
            company_fields: formData.company_fields as string[] ,
            company_types: formData.company_types as string[] 
          };
          return await defaultSubmitHandler(transformedData, formConfig);

        } catch (error) {
          console.error("Failed to create package:", error);
          return {
            success: false,
            message: "Failed to create package"
          };
        }
      },
      onError: (values, error) => {
        console.log("Bouquet form submission failed with values:", values);
        console.log("Error details:", error)
      },
    };
}
