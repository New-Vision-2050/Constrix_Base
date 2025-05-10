import { FormConfig, useFormStore } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useQuery } from "@tanstack/react-query";
import { Entity } from "../types/entity";
import { useTableStore } from "@/modules/table/store/useTableStore";

const fetchChecked = async (id: string) => {
  const res = await apiClient.get(`/sub_entities/${id}/show/attributes`);

  return res.data;
};

interface attr {
  id: string;
  name: string;
}

export const UpdateSubTableAttributes = (id: string, row: Entity) => {
  const { optional_attributes: OA, default_attributes: DA } = row;
  // const { data } = useQuery({
  //   queryKey: ["show-attributes", id],
  //   queryFn: () => fetchChecked(id),
  // });

  const default_attributes = DA.map((item: attr) => item.id) ?? [];
  const optional_attributes = OA.map((item: attr) => item.id) ?? [];

  console.log({ default_attributes, optional_attributes });

  const updateSubTableAttributes: FormConfig = {
    formId: `UpdateSubTableAttributes-programSettings-${id}`,
    title: "محتويات جدول الموظفين",
    apiUrl: `${baseURL}/sub_entities/${id}/update/attributes`,
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
            name: "default_attributes",
            label: "",
            optionsTitle: "العناصر الاساسية",
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/users/attributes`,
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
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/users/attributes`,
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
    onSuccess: () => {
      const tableStore = useTableStore.getState();
      tableStore.reloadTable("program-settings-sub-table");
      setTimeout(() => {
        tableStore.setLoading("program-settings-sub-table", false);
      }, 100);
    },

    // onSubmit: async (formData: Record<string, unknown>) => {
    //   const obj = {
    //     registration_type_id: formData.registration_type_id,
    //     regestration_number: formData.regestration_number,
    //     start_date: formData.start_date,
    //     end_date: formData.end_date,
    //     file: formData.file,
    //   };

    //   const newFormData = serialize(obj);

    //   return await defaultSubmitHandler(newFormData, CreateUserFormConfig, {
    //     config: {
    //       params: {},
    //     },
    //     url: `${baseURL}/companies/company-profile/legal-data/create-legal-data`,
    //   });
    // },
  };
  return updateSubTableAttributes;
};
