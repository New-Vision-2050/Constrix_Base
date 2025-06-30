import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const OrgStructureDepartmentsSettingsFormConfig: FormConfig = {
  formId: "OrgStructureDepartmentsSettingsFormConfig",
  title: "اضافة قسم",
  apiUrl: `${baseURL}/write-url`,
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
          name: "management_id",
          label: "اسم الادارة التابع لها",
          type: "select",
          placeholder: "اختر الادارة",
          required: true,
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
        {
          name: "job_titles",
          label: "المسميات الوظيفية",
          type: "select",
          isMulti: true,
          placeholder: "اختر المسميات الوظيفية",
          dynamicOptions: {
            url: `${baseURL}/write-url`,
            valueField: "id",
            labelField: "name",
            searchParam: "name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
          },
        },
      ],
    },
  ],
  submitButtonText: "حفظ",
  showSubmitLoader: true,
  resetOnSuccess: true,
  showCancelButton: false,
};
