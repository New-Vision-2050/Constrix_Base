import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export function GetOrgStructureManagementFormConfig(): FormConfig {
  return {
    formId: "org-structure-management-form",
    title: "اضافة ادارة",
    apiUrl: `${baseURL}/organization-structure/management`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "اضافة ادارة",
        fields: [
          {
            name: "management_id",
            label: "الادارة التابعة الى",
            type: "select",
            placeholder: "الادارة التابعة الى",
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
            name: "name",
            label: "اسم الادارة",
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
            name: "description",
            label: "وصف الادارة",
            type: "text",
            placeholder: "برجاء إدخال وصف الادارة",
            required: true,
            validation: [
              {
                type: "required",
                message: `وصف الادارة مطلوب`,
              },
            ],
          },
          {
            name: "manager_id",
            label: "اسم المدير",
            type: "select",
            placeholder: "اسم المدير",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/company-users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "اسم المدير مطلوب",
              },
            ],
          },
          {
            name: "deputy_manager_id",
            label: "نائب المدير",
            type: "select",
            placeholder: "نائب المدير",
            required: true,
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/company-users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "نائب المدير مطلوب",
              },
            ],
          },
          {
            name: "reference_person_id",
            label: "الشخص المرجعي",
            type: "select",
            placeholder: "الشخص المرجعي",
            required: true,
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/company-users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "الشخص المرجعي مطلوب",
              },
            ],
          },
          {
            name: "status",
            label: "الحالة",
            type: "select",
            placeholder: "الحالة",
            required: true,
            options: [
              { value: "active", label: "نشط" },
              { value: "inactive", label: "غير نشط" },
            ],
            validation: [
              {
                type: "required",
                message: "الحالة مطلوب",
              },
            ],
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
  };
}
