import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const OrgStructureDepartmentsSettingsFormConfig: FormConfig = {
  formId: "OrgStructureDepartmentsSettingsFormConfig",
  title: "اضافة قسم",
  apiUrl: `${baseURL}/management_hierarchies/create-department-with-relations`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors",
  },
  sections: [
    {
      fields: [
        {
          name: "name",
          label: "اسم القسم",
          type: "text",
          placeholder: "برجاء إدخال اسم القسم",
          required: true,
          validation: [
            {
              type: "required",
              message: `اسم القسم مطلوب`,
            },
          ],
        },
        {
          name: "managements",
          label: "اسم الادارة التابع لها",
          type: "select",
          placeholder: "اختر الادارة",
          required: true,
          isMulti: true,
          dynamicOptions: {
            url: `${baseURL}/management_hierarchies/list?type=management`,
            valueField: "id",
            labelField: "name",
            searchParam: "name",
            paginationEnabled: true,
            totalCountHeader: "X-Total-Count",
          },
          validation: [
            {
              type: "required",
              message: "الادارة مطلوبة",
            },
          ],
        },
      ],
    },
  ],
  submitButtonText: "حفظ",
  showSubmitLoader: true,
  resetOnSuccess: true,
  showCancelButton: false,
};
