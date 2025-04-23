// Define the form configuration
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const changeLocalTimeConfig: FormConfig = {
  formId: "change-local-time-form",
  title: "تغيير المنطقة الزمنية",
  apiUrl: `${baseURL}/companies`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors", // This is the default in Laravel
  },
  sections: [
    {
      columns: 2,
      fields: [
        {
          type: "select",
          name: "country-id",
          label: "الدولة",
          placeholder: "اختر دولة الشركة",
          required: true,
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
          validation: [
            {
              type: "required",
              message: "ادخل دولة الشركة",
            },
          ],
        },
        {
          type: "select",
          name: "time-zone",
          label: "المنطقة الزمنية",
          placeholder: "اختر المنطقة الزمنية",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/time_zones`,
            valueField: "id",
            labelField: "time_zone",
            searchParam: "name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
            dependsOn: "country-id",
            filterParam: "country_id",
          },
          validation: [
            {
              type: "required",
              message: "ادخل المنطقة الزمنية",
            },
          ],
        },
        {
          type: "select",
          name: "currency",
          label: "العملة",
          placeholder: "اختر العملة",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/currencies`,
            valueField: "id",
            labelField: "short_name",
            searchParam: "short_name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
            dependsOn: "country-id",
            filterParam: "country_id",
          },
          validation: [
            {
              type: "required",
              message: "ادخل العملة",
            },
          ],
        },
        {
          type: "select",
          name: "language",
          label: "اللغة",
          placeholder: "اختر اللغة",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/languages`,
            valueField: "id",
            labelField: "name",
            searchParam: "name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
            dependsOn: "country-id",
            filterParam: "country_id",
          },
          validation: [
            {
              type: "required",
              message: "ادخل اللغة",
            },
          ],
        },
      ],
    },
  ],
  isEditMode: true,
  submitButtonText: "حفظ",
  cancelButtonText: "Cancel",
  showReset: false,
  resetButtonText: "Clear Form",
  showSubmitLoader: true,
  resetOnSuccess: false,
  showCancelButton: false,
  showBackButton: false,

  onSubmit: async (values) => {
    console.log("Form submitted with values:", values);
    const formStore = useFormStore.getState();
    formStore.setValue("companies-form", "local-time", values);
    return { success: true };
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
