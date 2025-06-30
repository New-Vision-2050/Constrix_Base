import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const OrgStructureManagementsSettingsFormConfig: FormConfig = {
  formId: "OrgStructureManagementsSettingsFormConfig",
  title: "اضافة ادارة",
  apiUrl: `${baseURL}/write-url`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors", // This is the default in Laravel
  },
  sections: [
    {
      fields: [
        {
          name: "name",
          label: "اضافة ادارة جديدة",
          type: "text",
          placeholder: "برجاء إدخال اسم الادارة",
          required: true,
          validation: [
            {
              type: "required",
              message: `اسم الادارة مطلوب`,
            },
          ],
        },
        {
        name: "management_id",
        label: "اسم الادارة التابع لها",
        type: "select",
        placeholder: "اسم الادارة التابع لها",
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
            message: "الادارة مطلوب",
            },
        ],
        },
        {
            name: "1",
            label: "انواع الوظائف",
            type: "select",
            isMulti: true,
            placeholder: "اختر انواع الوظائف",
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
        {
            name: "2",
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
        {
            name: "branch_ids",
            label: "الفروع",
            type: "select",
            isMulti: true,
            placeholder: "اختر الفروع",
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=branch`,
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
