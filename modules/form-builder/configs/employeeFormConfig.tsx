import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { InvalidMessage } from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import { useTranslations } from "next-intl";

export function employeeFormConfig(
  t: ReturnType<typeof useTranslations>
): FormConfig {
  return {
    formId: "employee-form",
    title: "اضافة موظف",
    apiUrl: `${baseURL}/write-url`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        collapsible: false,
        fields: [
          {
            name: "first_name",
            label: "اسم المستخدم الاول",
            type: "text",
            placeholder: "ادخل اسم المستخدم الاول",
            required: true,
            validation: [
              {
                type: "required",
                message: "اسم المستخدم الاول مطلوب",
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicFirstName"),
              },
              {
                type: "minLength",
                value: 2,
                message: "الاسم يجب أن يحتوي على حرفين على الأقل.",
              },
            ],
          },
          {
            name: "last_name",
            label: "اسم المستخدم الأخير",
            type: "text",
            placeholder: "اسم المستخدم الأخير",
            required: true,
            validation: [
              {
                type: "required",
                message: "الاسم مطلوب",
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicLastName"),
              },
              {
                type: "minLength",
                value: 2,
                message: "الاسم يجب أن يحتوي على حرفين على الأقل.",
              },
            ],
          },
          {
            name: "country_id",
            label: "الجنسية",
            type: "select",
            placeholder: "اختر الجنسية",
            dynamicOptions: {
              url: "/countries",
              valueField: "id",
              labelField: "name",
            },
            validation: [
              {
                type: "required",
                message: "الجنسية مطلوب",
              },
            ],
          },
          {
            name: "email",
            label: "البريد الإلكتروني",
            type: "email",
            placeholder: "ادخل البريد الإلكتروني",
            required: true,
            validation: [
              {
                type: "required",
                message: "البريد الإلكتروني مطلوب",
              },
              {
                type: "email",
                message: "يرجى إدخال عنوان بريد إلكتروني صالح.",
              },
              {
                type: "apiValidation",
                message: <InvalidMessage formId="companies-form" />,
                apiConfig: {
                  url: `${baseURL}/company-users/check-email`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  successCondition: (response) => {
                    useFormStore.getState().setValues("companies-form", {
                      exist_user_id: response.payload?.[0]?.id,
                    });
                    useFormStore.getState().setValues("companies-form", {
                      error_sentence: response.payload?.[0]?.sentence,
                    });

                    return response.payload?.[0]?.status === 1;
                  },
                },
              },
            ],
          },
          {
            name: "phone",
            label: "الهاتف",
            type: "phone",
            required: true,
            placeholder: "يرجى إدخال رقم هاتفك.",
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },

          {
            type: "select",
            name: "job_title_id",
            label: "المسمى الوظيفي",
            placeholder: "اختر المسمى الوظيفي",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/job_titles/list?type=general_manager`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              setFirstAsDefault: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "المسمى الوظيفي مطلوب.",
              },
            ],
          },
          {
            name: "company_field_id",
            label: "الفرع - ستاتيك",
            type: "select",
            isMulti: true,
            placeholder: "اختر الفرع",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/company_fields`,
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
                message: "برجاء اختيار الفرع",
              },
            ],
          },

          {
            name: "state",
            label: "حالة الموظف",
            type: "select",
            isMulti: true,
            placeholder: "اختر الفرع",
            required: true,
            options: [
              { label: "نشط", value: "active" },
              { label: "غير نشط", value: "inactive" },
            ],
            validation: [
              {
                type: "required",
                message: "برجاء اختيار الفرع",
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
