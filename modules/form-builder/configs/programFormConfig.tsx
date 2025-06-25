import {FormConfig, useFormStore} from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";

export function ProgramFormConfig(t:ReturnType<typeof useTranslations>): FormConfig {
    return {
      formId: "company-user-form",
      title: "اضافة برنامج",
      apiUrl: `${baseURL}/company-users`,
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
            {
              type: "checkboxGroup",
              name: "default_attributes",
              label: "",
              optionsTitle: "لوحة التحكم",
              isMulti: true,
              fieldClassName:
                "bg-background border border-border rounded-md p-2",
              dynamicOptions: {
                url: `${baseURL}/modules`,
                valueField: "id",
                labelField: "name",
                searchParam: "name",
                paginationEnabled: true,
                pageParam: "page",
                limitParam: "per_page",
                itemsPerPage: 10,
                totalCountHeader: "X-Total-Count",
                
                
              },
              syncWithField: "optional_attributes",
              syncDirection: "unidirectional",
              syncOn: "both",
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
          company_id: data.company.id,
          first_name: data.name,
          last_name: data.name,
          email: data.email,
          phone: data.phone,
          job_title_id: data.job_title_id,
        };
      },

      // Example onSuccess handler
      onSuccess: (values, result) => {
        console.log("Form submitted successfully with values:", values);
        console.log("Result from API:", result);

        // You can perform additional actions here, such as:
        // - Show a custom notification
        // - Navigate to another page
        // - Update application state
        // - Trigger analytics events
        // - etc.
      },

      // Example onError handler
      onError: (values, error) => {
        console.log("Form submission failed with values:", values);
        console.log("Error details:", error);

        // You can perform additional actions here, such as:
        // - Show a custom error notification
        // - Log the error to an analytics service
        // - Attempt to recover from the error
        // - etc.
      },

      // No onSubmit handler needed - will use the default handler
    };
}
