import { FormConfig, useFormStore } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { useQuery } from "@tanstack/react-query";

const fetchChecked = async (id: string) => {
  const res = await apiClient.get(`/sub_entities/${id}/show/attributes`);

  return res.data;
};

export const UpdateSubTableAttributes = (id: string) => {

  const { data } = useQuery({
    queryKey: ["show-attributes", id],
    queryFn: () => fetchChecked(id),
  });

  const default_attributes = data?.payload?.default_attributes ?? [];
  const optional_attributes = data?.payload?.optional_attributes ?? [];

  const updateSubTableAttributes: FormConfig = {
    formId: `UpdateSubTableAttributes-programSettings`,
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
            onChange: (a) => {
              console.log(
                "changed;    ",

                a
              );
            },
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
