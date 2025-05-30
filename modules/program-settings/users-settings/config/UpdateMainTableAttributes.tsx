import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const UpdateMainTableAttributes = (
  id: string,
  payload: {
    optional_attributes: string[];
    default_attributes?: string[];
  }
) => {
  const default_attributes = payload?.default_attributes || [];
  const optional_attributes = payload?.optional_attributes || [];

  const updateMainTableAttributes: FormConfig = {
    formId: `updateMainTableAttributes-programSettings-${id}`,
    title: "محتويات الجدول",
    apiUrl: `${baseURL}/sub_entities/super_entities/attributes/config/${id}`,
    apiMethod: "POST",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        columns: 2,
        fields: [
          {
            type: "checkboxGroup",
            name: "default_attributes",
            label: "",
            optionsTitle: "العناصر الاساسية",
            isMulti: true,
            fieldClassName: "bg-background border border-border rounded-md p-2",
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/attributes/all?super_entity_id=${id}`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            syncWithField: "optional_attributes",
            syncDirection: "unidirectional",
            syncOn: "both",
          },
          {
            type: "checkboxGroup",
            name: "optional_attributes",
            label: "",
            optionsTitle: "العناصر التنقية",
            isMulti: true,
            fieldClassName: "bg-background border border-border rounded-md p-2",
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/attributes/all?super_entity_id=${id}`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            syncWithField: "default_attributes",
            syncDirection: "unidirectional",
            syncOn: "unselect",
          },
        ],
      },
    ],
    subWrapperClassName: "bg-transparent border-none",
    subWrapperParentClassName: "border-none",
    submitButtonText: "تعديل",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    showCancelButton: false,
    showBackButton: false,
    initialValues: {
      default_attributes,
      optional_attributes,
    },
  };
  return updateMainTableAttributes;
};
