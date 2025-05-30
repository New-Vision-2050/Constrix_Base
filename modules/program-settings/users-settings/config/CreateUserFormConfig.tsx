import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTableStore } from "@/modules/table/store/useTableStore";
import SelectIcon from "../components/sub-tables/SelectIcon";
import { useTranslations } from "next-intl";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";

export const CreateUserFormConfig = (slug: string) => {
  const { refetch } = useSidebarMenu();
  const t = useTranslations("Companies");

  const formId = `CreateUserFormConfig-programSettings`;
  const tableId = `program-settings-sub-table-${slug}`;
  const CreateUserFormConfig: FormConfig = {
    formId,
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
            name: "slug",
            label: "الاسم المختصر",
            type: "text",
            placeholder: "ادخل الاسم المختصر",
            validation: [
              {
                type: "required",
                message: "ادخل الاسم المختصر",
              },
              {
                type: "pattern",
                value: /^[a-zA-Z]+$/,
                message: t("Validation.englishName"),
              },
              {
                type: "apiValidation",
                message: "تم اخذ هذا الاسم بالفعل",
                apiConfig: {
                  url: `${baseURL}/sub_entities/slug-validate`,
                  method: "POST",
                  debounceMs: 422,
                  paramName: "slug",
                  successCondition: (response) =>
                    response?.payload?.valid === true,
                },
              },
            ],
          },
          {
            name: "icon",
            label: "ايقونة الجدول",
            type: "text",
            required: true,
            render(field, value, onChange) {
              return (
                <SelectIcon
                  formId={formId}
                  field={field}
                  value={value}
                  onChange={onChange}
                />
              );
            },
            validation: [
              {
                type: "required",
                message: "اختر ايقونة الجدول",
              },
            ],
          },
          {
            type: "select",
            name: "main_program_id",
            label: "البرنامج الرئيسي",
            placeholder: "البرنامج الرئيسي",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/programs`,
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
            required: true,
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
            required: true,
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/default_attributes`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "super_entity",
              filterParam: "super_entity_id",
            },
            syncWithField: "optional_attributes",
            syncDirection: "unidirectional",
            syncOn: "both",
            condition: (values) => !!values["super_entity"],
            validation: [
              {
                type: "required",
                message: "ادخل العناصر الاساسية",
              },
            ],
          },
          {
            type: "checkboxGroup",
            name: "optional_attributes",
            label: "",
            optionsTitle: "العناصر التنقية",
            required: true,
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/optional_attributes`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "super_entity",
              filterParam: "super_entity_id",
            },
            syncWithField: "default_attributes",
            syncDirection: "unidirectional",
            syncOn: "unselect",
            condition: (values) => !!values["super_entity"],
            validation: [
              {
                type: "required",
                message: "ادخل العناصر التنقية",
              },
            ],
          },
          {
            type: "select",
            name: "registration_form_id",
            label: "نموذج التسجيل",
            placeholder: "نموذج التسجيل",
            dynamicOptions: {
              url: `${baseURL}/sub_entities/super_entities/registration_forms`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "super_entity",
              filterParam: "super_entity_id",
            },
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
      refetch();
      const tableStore = useTableStore.getState();
      tableStore.reloadTable(tableId);
      setTimeout(() => {
        tableStore.setLoading(tableId, false);
      }, 100);
    },
  };
  return CreateUserFormConfig;
};
