// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { defaultStepSubmitHandler } from "@/modules/form-builder/utils/defaultStepSubmitHandler";
import { TimeZoneCheckbox } from "../components/TimeZoneCheckbox";

export const customerRelationFormConfig: FormConfig = {
  formId: "CustomerRelation-form",
  title: "اضافة عميل",
  apiUrl: `${baseURL}/companies`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors", // This is the default in Laravel
  },
  sections: [
    {
      title: " اضافة عميل",
      fields: [
        {
          type: "select",
          name: "country_id",
          label: "نوع العميل",
          placeholder: "اختر نوع العميل",
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
          label: "اسم العميل",
          type: "text",
          isMulti: true,
          validation: [
            {
              type: "required",
              message: "برجاء اختيار النشاط",
            },
          ],
        },
        {
          type: "select",
          name: "country_id",
          label: "الجنسية",
          placeholder: "اختر الجنسية",
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
          label: "رقم الهوية",
          type: "text",
          isMulti: true,
          validation: [
            {
              type: "required",
              message: "برجاء اختيار النشاط",
            },
          ],
        },
        {
          name: "company_field_id",
          label: "البريد الالكتروني",
          type: "text",
          isMulti: true,
          required: true,
          validation: [
            {
              type: "required",
              message: "برجاء اختيار النشاط",
            },
          ],
        },
        {
          type: "phone",
          name: "phone",
          label: "رقم الجوال ",
          validation: [
            {
              type: "required",
              message: "ادخل دولة الشركة",
            },
          ],
        },
        {
          type: "select",
          name: "country_id",
          label: "الفرع",
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
          name: "country_id",
          label: "الوسيط",
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
          type: "text",
          name: "country_id",
          label: "المراسلات",
          validation: [
            {
              type: "required",
              message: "ادخل دولة الشركة",
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
      const result = await defaultStepSubmitHandler(
        step,
        values,
        companiesFormConfig
      );
      if (result.success) {
        // Simulate API call
        return new Promise((resolve) => {
          resolve({
            success: true,
            message: `Step ${step + 1} submitted successfully`,
            data: {
              // For step 0 (location), return a generated ID
              ...(step === 0 &&
                result.data?.payload?.id && {
                  company_id: result.data.payload.id,
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
  editDataTransformer: (data) => {
    if (!Array.isArray(data.company_field_id)) {
      data.company_field_id = data?.company_field_id?.split(",");
    }
    return data;
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
