// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

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
          name: "name",
          label: "اسم الاعداد",
          type: "text",
          placeholder: "برجاء إدخال اسم الاعداد",
        },
        {
          name: "login_options",
          label: "",
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
                  paginationEnabled: true,
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
                  paginationEnabled: true,
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
                  paginationEnabled: true,
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
      id: data.id,
      name: data.name,
      login_options: data.steps,
    };
  },

  onSubmit: async (formData: Record<string, unknown>) => {
    const body = {
      name: formData.name,
      login_options: Array.isArray(formData?.login_options)
        ? formData.login_options.map((ele: any) => {
            let login_option_alternatives: any[] = [];
            let drivers: string[] = [];

            if (
              ele?.login_option_alternatives &&
              Array.isArray(ele?.login_option_alternatives)
            ) {
              login_option_alternatives = ele.login_option_alternatives;
            }

            if (ele?.drivers) {
              const _driver = ele.drivers?.split("-")?.[1] ?? "";
              drivers = [_driver];
            }

            return {
              login_option: ele?.login_option ?? "",
              drivers,
              login_option_alternatives,
            };
          })
        : [],
    };

    // Log the form data
    return await defaultSubmitHandler(body, loginWayFormConfig);
  },

  // Example onSuccess handler
  onSuccess: (
    values: Record<string, any>,
    result: { success: boolean; message?: string }
  ) => {
    console.log("Form submitted successfully with values:", values);
    console.log("Result from API:", result);
    // const response = await apiClient.post(`${baseURL}/settings/login-way`,{})
  },

  // Example onError handler
  onError: (
    values: Record<string, any>,
    error: { message?: string; errors?: Record<string, string | string[]> }
  ) => {
    console.log("Form submission failed with values:", values);
    console.log("Error details:", error);
  },
};
