import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTableStore } from "@/modules/table/store/useTableStore";

export const CreateUserFormConfig = () => {
  const CreateUserFormConfig: FormConfig = {
    formId: `CreateUserFormConfig-programSettings`,
    title: "اضافة جدول",
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
            name: "main_program_id",
            label: "البرنامج الرئيسي",
            placeholder: "البرنامج الرئيسي",
            required:true,
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
            type: "select",
            name: "super_entity",
            label: "الجدول المرجعي",
            placeholder: "الجدول المرجعي",
            required:true,
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/list`,
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
            required:true,
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
              syncWithField:"optional_attributes",
              syncDirection:"unidirectional",
              syncOn:"both",
            condition: (values) => !!values["super_entity"],
          },
          {
            type: "checkboxGroup",
            name: "optional_attributes",
            label: "",
            optionsTitle: "العناصر التنقية",
            required:true,
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
            syncWithField:"default_attributes",
            syncDirection:"unidirectional",
            syncOn:"unselect",
            condition: (values) => !!values["super_entity"],
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
