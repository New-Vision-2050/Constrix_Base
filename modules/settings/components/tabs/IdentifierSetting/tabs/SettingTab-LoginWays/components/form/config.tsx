// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const loginWayFormConfig: FormConfig = {
  formId: "login-way-form",
  title: "اضافة اعداد",
  apiUrl: `${baseURL}/settings/login-way`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors",
  },
  sections: [
    {
      title: "اضافة اعداد",
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
          label: "اسم الاعداد",
          type: "text",
          placeholder: "برجاء إدخال اسم الاعداد",
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
