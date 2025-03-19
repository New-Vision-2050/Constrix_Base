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
          name: "name",
          label: "اسم الاعداد",
          type: "text",
          placeholder: "برجاء إدخال اسم الاعداد",
        },
        {
          type: "select",
          name: "login_option_id",
          label: "Login Option",
          placeholder: "Select Login Option",
          dynamicOptions: {
            url: `${baseURL}/settings/login-way/login-options`,
            valueField: "login_option",
            labelField: "login_option",
            searchParam: "login_option",
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
          name: "login_driver_id",
          label: "Login Driver",
          placeholder: "Select Login Driver",
          dynamicOptions: {
            url: `${baseURL}/settings/drivers`,
            valueField: "id",
            labelField: "name",
            dependsOn: "login_option_id",
            filterParam: "login_option_id",
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
          name: "login_alternative_id",
          label: "Login Way Alternative",
          placeholder: "Select Login Way Alternative",
          dynamicOptions: {
            url: `${baseURL}/settings/alternatives`,
            valueField: "login_alternative",
            labelField: "login_alternative",
            searchParam: "login_alternative",
          },
          validation: [
            {
              type: "required",
              message: "Login Way Alternative is required",
            },
          ],
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

  // Example onError handler
  onError: (values, error) => {
    console.log("Form submission failed with values:", values);
    console.log("Error details:", error);
  },
};
