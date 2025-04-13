import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {
  temporaryDomain,
  temporaryToken,
} from "@/modules/dashboard/constants/dummy-domain";

export const BankingDataFormConfig = () => {
  const BankingFormConfig: FormConfig = {
    formId: "Banking-data-form",
    title: "البيانات البنكية",
    apiUrl: `${temporaryDomain}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "البيانات البنكية",
        fields: [
          {
            name: "",
            label: "حساب بنكي",
            type: "dynamicRows",
            dynamicRowOptions: {
              enableDrag: true,
              rowFields: [
                {
                  type: "select",
                  name: "login_option",
                  label: "Login Option",
                  placeholder: "Select Login Option",
                  dynamicOptions: {
                    url: `${baseURL}/settings/login-way/login-options`,
                    valueField: "login_option",
                    labelField: "login_option",
                    searchParam: "login_option",
                    transformResponse: (data: string[]) =>
                      data.map((option) => ({ value: option, label: option })),
                  },
                  validation: [
                    {
                      type: "required",
                      message: "Login Option is required",
                    },
                  ],
                },
                {
                  type: "select",
                  // isMulti: true,
                  name: "drivers",
                  label: "Login Driver",
                  placeholder: "Select Login Driver",
                  dynamicOptions: {
                    url: `${baseURL}/settings/driver/get-drivers-by-login-option`,
                    valueField: "value",
                    labelField: "name",
                    dependsOn: "login_option",
                    filterParam: "login_option",
                  },
                  validation: [
                    {
                      type: "required",
                      message: "Login Driver is required",
                    },
                  ],
                },
                {
                  type: "select",
                  name: "login_option_alternatives",
                  label: "Login Way Alternative",
                  placeholder: "Select Login Way Alternative",
                  dynamicOptions: {
                    url: `${baseURL}/settings/driver/get-alternatives-drivers-by-login-option`,
                    dependsOn: "drivers",
                    filterParam: "login_option_driver",
                    valueField: "key",
                    labelField: "key",
                    searchParam: "key",
                  },
                  validation: [
                    {
                      type: "required",
                      message: "Login Way Alternative is required",
                    },
                  ],
                },
              ],
              minRows: 1,
              maxRows: 5,
              columns: 1,
            },
          },
        ],
      },
    ],
    submitButtonText: "Submit",
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
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
      };
      console.log("body-body", body);
      const response = await apiClient.put(
        `${temporaryDomain}/company-users/contact-info`,
        body,
        {
          headers: {
            Authorization: `Bearer ${temporaryToken}`,
            "X-Tenant": "560005d6-04b8-53b3-9889-d312648288e3",
          },
        }
      );
      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },

    // Example onError handler
    onError: (values, error) => {
      console.log("Form submission failed with values:", values);
      console.log("Error details:", error);
    },
  };
  return BankingFormConfig;
};
