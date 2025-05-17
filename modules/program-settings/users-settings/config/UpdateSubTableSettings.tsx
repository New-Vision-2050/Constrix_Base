import { FormConfig, useFormStore } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useQuery } from "@tanstack/react-query";
import { Entity } from "../types/entity";
import { useTableStore } from "@/modules/table/store/useTableStore";

export const UpdateSubTableSettings = (
  id: string,
  row: Entity,
  slug: string
) => {
  const tableId = `program-settings-sub-table-${slug}`;

  const children_allowed_registration_forms =
    row.allowed_registration_forms.map((item) => item.id);

  const UpdateSubTableSettings: FormConfig = {
    formId: `UpdateSubTableSettings-programSettings-${id}`,
    title: "اعدادات الجدول",
    apiUrl: `${baseURL}/sub_entities/${id}`,
    apiMethod: "PUT",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "checkboxGroup",
            name: "children_allowed_registration_forms",
            label: "",
            optionsTitle: "نماذج التسجيل",
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/registration_forms?super_entity_id=${slug}`,
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
      is_registrable: Boolean(row.is_registrable),
      children_allowed_registration_forms,
    },
    onSuccess: () => {
      const tableStore = useTableStore.getState();
      tableStore.reloadTable(tableId);
      setTimeout(() => {
        tableStore.setLoading(tableId, false);
      }, 100);
    },
  };
  return UpdateSubTableSettings;
};
