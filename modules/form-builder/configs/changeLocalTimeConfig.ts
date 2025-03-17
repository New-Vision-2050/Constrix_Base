// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
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
          name: "country_id",
          label: "دولة الشركة",
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
          name: "company_field_id",
          label: "النشاط",
          type: "select",
          isMulti: true,
          placeholder: "اختر النشاط",
          required: true,
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
          validation: [
            {
              type: "required",
              message: "برجاء اختيار النشاط",
            },
          ],
        },
        {
          name: "name",
          label: "الاسم التجاري",
          type: "text",
          placeholder: "برجاء إدخال الاسم التجاري",
          validation: [
            {
              type: "apiValidation",
              message: "This username is already taken",
              apiConfig: {
                url: "/api/validate-username",
                method: "POST",
                debounceMs: 500,
                paramName: "username",
                successCondition: (response) => response.available === true,
              },
            },
          ],
        },
        {
          name: "user_name",
          label: "الاسم المختصر",
          type: "text",
          placeholder: "برجاء إدخال الاسم المختصر",
          postfix: "constrix.com",
          containerClassName: "rtl:flex-row-reverse",
          validation: [
            {
              type: "apiValidation",
              message: "This username is already taken",
              apiConfig: {
                url: "/api/validate-username",
                method: "POST",
                debounceMs: 500,
                paramName: "username",
                successCondition: (response) => response.available === true,
              },
            },
          ],
        },
        {
          type: "select",
          name: "general_manager_id",
          label: "مسؤول الدعم",
          placeholder: "اختر مسؤول الدعم",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/users`,
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
              message: "مسؤول الدعم",
            },
          ],
        },
      ],
    },
  ],
  submitButtonText: "Send Message",
  cancelButtonText: "Cancel",
  showReset: false,
  resetButtonText: "Clear Form",
  showSubmitLoader: true,
  resetOnSuccess: true,
  showCancelButton: false,
  showBackButton: false,

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
