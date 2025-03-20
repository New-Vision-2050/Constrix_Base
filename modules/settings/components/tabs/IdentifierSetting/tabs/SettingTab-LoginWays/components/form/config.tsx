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
          name: "contactPersons",
          label: "Contact Persons",
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
                  valueField: "",
                  labelField: "",
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
                name: "drivers",
                label: "Login Driver",
                placeholder: "Select Login Driver",
                dynamicOptions: {
                  url: `${baseURL}/settings/driver/get-drivers-by-login-option`,
                  valueField: "id",
                  labelField: "name",
                  dependsOn: "login_option",
                  filterParam: "login-option",
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
                  url: `${baseURL}/settings/driver/get-alternatives-drivers-by-login-option/:login-option/:driver`,
                  dependsOn: "drivers",
                  filterParam: "drivers",
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

  // Example onError handler
  onError: (values, error) => {
    console.log("Form submission failed with values:", values);
    console.log("Error details:", error);
  },
};
