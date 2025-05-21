import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const UpdateMainTableAttributes = (
  id: string,
  payload: Record<string, string>[]
) => {
  const allowed_attributes = payload.map((item) => item.id);
  const updateMainTableAttributes: FormConfig = {
    formId: `updateMainTableAttributes-programSettings-${id}`,
    title: "محتويات الجدول",
    apiUrl: `${baseURL}/sub_entities/super_entities/allowed_attributes/config/${id}`,
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
            name: "allowed_attributes",
            label: "",
            optionsTitle: "عناصر الجدول",
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/attributes?super_entity_id=${id}`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            // syncWithField: "optional_attributes",
            // syncDirection: "unidirectional",
            // syncOn: "both",
          },
          //   {
          //     type: "checkboxGroup",
          //     name: "optional_attributes",
          //     label: "",
          //     optionsTitle: "العناصر التنقية",
          //     isMulti: true,
          //     dynamicOptions: {
          //       url: `${baseURL}/sub_entities/super_entities/attributes?super_entity_id=${id}`,
          //       valueField: "id",
          //       labelField: "name",
          //       searchParam: "name",
          //       paginationEnabled: true,
          //       pageParam: "page",
          //       limitParam: "per_page",
          //       itemsPerPage: 10,
          //       totalCountHeader: "X-Total-Count",
          //     },
          //     syncWithField: "default_attributes",
          //     syncDirection: "unidirectional",
          //     syncOn: "unselect",
          //   },
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
        allowed_attributes,
    },
  };
  return updateMainTableAttributes;
};
