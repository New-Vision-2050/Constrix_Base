import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {
  temporaryDomain,
  temporaryToken,
} from "@/modules/dashboard/constants/dummy-domain";

export const QualificationFormConfig = () => {
  const qualificationFormConfig: FormConfig = {
    formId: "qualification-data-form",
    apiUrl: `${temporaryDomain}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "",
            label: "مؤهل",
            type: "dynamicRows",
            dynamicRowOptions: {
              enableDrag: true,
              rowFields: [
                {
                  type: "select",
                  name: "country_id",
                  label: "دولة التخرج",
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
                  name: "university_id",
                  label: "الجامعة",
                  placeholder: "اختر الجامعة",
                  required: true,
                  dynamicOptions: {
                    url: `${baseURL}/universities`,
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
                      message: "ادخل الجامعة",
                    },
                  ],
                },
                {
                  type: "select",
                  name: "qualification_id",
                  label: "المؤهل",
                  placeholder: "اختر المؤهل",
                  required: true,
                  dynamicOptions: {
                    url: `${baseURL}/qualifications`,
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
                      message: "ادخل المؤهل",
                    },
                  ],
                },
                {
                  type: "select",
                  name: "classification_id",
                  label: "التخصص الأكاديمي",
                  placeholder: "اختر التخصص الأكاديمي",
                  required: true,
                  dynamicOptions: {
                    url: `${baseURL}/classifications`,
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
                      message: "ادخل التخصص الأكاديمي",
                    },
                  ],
                },
                {
                  type: "date",
                  name: "graduation_date",
                  label: "تاريخ الحصول على الشهادة",
                  placeholder: "تاريخ الحصول على الشهادة",
                  validation: [
                    {
                      type: "required",
                      message: "graduation date is required",
                    },
                  ],
                },
                {
                  type: "text",
                  name: "graduation_grade",
                  label: "المعدلات الدراسية",
                  placeholder: "المعدلات الدراسية",
                  validation: [
                    {
                      type: "required",
                      message: "graduation grade is required",
                    },
                  ],
                },
                {
                  type: "image",
                  name: "graduation_file",
                  label: "ارفاق شهادة",
                  placeholder: "ارفاق شهادة",
                  validation: [
                    {
                      type: "required",
                      message: "graduation file is required",
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
  return qualificationFormConfig;
};
