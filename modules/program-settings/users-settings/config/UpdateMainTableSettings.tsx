import { FormConfig, useFormStore } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useQuery } from "@tanstack/react-query";
import { Entity } from "../types/entity";
import { useTableStore } from "@/modules/table/store/useTableStore";

export const UpdateMainTableSettings = (
  id: string,
  payload: {
    registration_forms: Record<string, string>[];
    is_registrable: boolean;
  }
) => {
  const updateMainTableSettings: FormConfig = {
    formId: `UpdateMainTableSettings-programSettings-${id}`,
    title: "اعدادات الجدول",
    apiUrl: `${baseURL}/sub_entities/super_entities/registration/config?super_entity_id=${id}`,
    apiMethod: "POST",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "checkboxGroup",
            name: "registration_forms",
            label: "",
            optionsTitle: "نماذج التسجيل",
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/sub_entities/registration_forms/selection/list`,
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
            type: "checkbox",
            name: "is_registrable",
            label: "امكانية استخدام النموذج",
          },
        ],
      },
    ],
    submitButtonText: "تعديل",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    showCancelButton: false,
    showBackButton: false,
    initialValues: {
      registration_forms: payload?.registration_forms,
      is_registrable: Boolean(payload?.is_registrable),
    },
  };
  return updateMainTableSettings;
};
