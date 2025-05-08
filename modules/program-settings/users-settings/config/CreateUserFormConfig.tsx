import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useQueryClient } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "next/navigation";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { SubTableConfig } from "./SubTableConfig";

export const CreateUserFormConfig = () => {
  const queryClient = useQueryClient();
  const CreateUserFormConfig: FormConfig = {
    formId: `CreateUserFormConfig-programSettings`,
    title: "اضافة بيان قانوني",
    apiUrl: `${baseURL}/sub_entities`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "icon",
            label: "",
            type: "hiddenObject",
            placeholder: "ادخل اسم الجدول",
            defaultValue: 1,
          },
          {
            name: "name",
            label: "اسم الجدول",
            type: "text",
            placeholder: "ادخل اسم الجدول",
            validation: [
              {
                type: "required",
                message: "ادخل اسم الجدول",
              },
            ],
          },
          {
            type: "select",
            name: "super_entity",
            label: "الجدول الرئيسي",
            placeholder: "الجدول الرئيسي",
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/list`,
              valueField: "name",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "ادخل الجدول الرئيسي",
              },
            ],
          },
          {
            type: "select",
            name: "main_program_id",
            label: "الجدول الرئيسي",
            placeholder: "الجدول الرئيسي",
            dynamicOptions: {
              url: `${baseURL}/programs?program_name=users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "ادخل الجدول الرئيسي",
              },
            ],
          },
          {
            type: "checkboxGroup",
            name: "default_attributes",
            label: "",
            optionsTitle: "العناصر الاساسية",
            isMulti: true,
            options: [
              { value: "name", label: "name" },
              { value: "email", label: "email" },
              { value: "phone", label: "phone" },
              { value: "phone_code", label: "phone_code" },
              { value: "login_way_id", label: "login_way_id" },
              {
                value: "global_company_user_id",
                label: "global_company_user_id",
              },
              { value: "company_id", label: "company_id" },
              { value: "is_owner", label: "is_owner" },
              {
                value: "management_hierarchy_id",
                label: "management_hierarchy_id",
              },
            ],
          },
          {
            type: "checkboxGroup",
            name: "optional_attributes",
            label: "",
            optionsTitle: "العناصر التنقية",
            isMulti: true,
            options: [
              { value: "created_at", label: "created_at" },
              { value: "updated_at", label: "updated_at" },
            ],
          },
          {
            type: "select",
            name: "form",
            label: "نموذج التسجيل",
            placeholder: "نموذج التسجيل",
            options: [{ value: "نموذج 1", label: "form 1" }],
            validation: [
              {
                type: "required",
                message: "ادخل نموذج التسجيل",
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

    onSuccess: () => {
      const tableStore = useTableStore.getState();
      tableStore.reloadTable("program-settings-sub-table");
      setTimeout(() => {
        tableStore.setLoading("program-settings-sub-table", false);
      }, 100);
    },
  };
  return CreateUserFormConfig;
};
