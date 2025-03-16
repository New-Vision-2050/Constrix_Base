// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { defaultStepSubmitHandler } from "@/modules/form-builder/utils/defaultStepSubmitHandler";

export const companiesFormConfig: FormConfig = {
  title: "اضافة شركة جديدة",
  apiUrl: `${baseURL}/companies`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors", // This is the default in Laravel
  },
  sections: [
    {
      title: "إنشاء شركة",
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
    {
      title: "إنشاء مستخدم",
      collapsible: false,
      fields: [
        {
          type: "text",
          name: "company_id",
          label: "الشركة",
          placeholder: "اختر الشركة",
          required: true,
          disabled: true,
          hidden: true,
          validation: [
            {
              type: "required",
              message: "الشركة",
            },
          ],
        },
        {
          name: "first_name",
          label: "اسم المستخدم الاول",
          type: "text",
          placeholder: "Enter your name",
          required: true,
          validation: [
            {
              type: "required",
              message: "Name is required",
            },
            {
              type: "minLength",
              value: 2,
              message: "Name must be at least 2 characters",
            },
          ],
        },
        {
          name: "last_name",
          label: "اسم المستخدم ألأحير",
          type: "text",
          placeholder: "سم المستخدم ألأحير",
          required: true,
          validation: [
            {
              type: "required",
              message: "Name is required",
            },
            {
              type: "minLength",
              value: 2,
              message: "Name must be at least 2 characters",
            },
          ],
        },
        {
          name: "email",
          label: "البريد الإلكتروني",
          type: "email",
          placeholder: "Enter your email",
          required: true,
          validation: [
            {
              type: "required",
              message: "Email is required",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
          ],
        },
        {
          name: "phone",
          label: "الهاتف",
          type: "phone",
          placeholder: "Enter your phone",
          validation: [
            {
              type: "required",
              message: "برجاء إدخال رقم الهاتف",
            },
          ],
        },
        {
          type: "select",
          name: "job_title_id",
          label: "المسمى الوظيفي",
          placeholder: "اختر المسمى الوظيفي",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/job_titles`,
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
              message: "المسمى الوظيفي",
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

  // Enable wizard mode
  //   wizard: true,
  accordion: true,
  wizardOptions: {
    showStepIndicator: false,
    showStepTitles: false,
    validateStepBeforeNext: true,
    allowStepNavigation: false,
    nextButtonText: "Continue",
    prevButtonText: "Back",
    finishButtonText: "حفظ",
    // Enable submitting each step individually
    submitEachStep: true,
    submitButtonTextPerStep: "التالي",

    // API URLs for each step
    stepApiUrls: {
      0: `${baseURL}/companies`,
      1: `${baseURL}/company-users`,
    },

    // API headers for each step
    stepApiHeaders: {
      0: {
        "X-Location-API-Key": "location-api-key",
      },
      1: {
        "X-User-API-Key": "user-api-key",
      },
    },

    // Custom step submission handler (optional - will use defaultStepSubmitHandler if not provided)
    onStepSubmit: async (step, values) => {
           // Option to call default way to handle the step
      const result =   await defaultStepSubmitHandler(step, values, companiesFormConfig);
      if(result.success) {
          // Simulate API call
          return new Promise((resolve) => {
              resolve({
                  success: true,
                  message: `Step ${step + 1} submitted successfully`,
                  data: {
                      // For step 0 (location), return a generated ID
                      ...(step === 0 && result.data?.payload?.id && {
                          company_id: result.data.payload.id
                      }),

                  },
              });
          });
      }
      return result;
    },
    // Handle step change
    onStepChange: (prevStep, nextStep, values) => {
      console.log(`Moving from step ${prevStep + 1} to step ${nextStep + 1}`);
      console.log("Current values:", values);
    },
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
