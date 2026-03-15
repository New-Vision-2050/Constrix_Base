import {FormConfig, useFormStore} from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";

export function GetCompanyUserFormConfig(t:ReturnType<typeof useTranslations>, onClose?: () => void, tUsers?: ReturnType<typeof useTranslations>): FormConfig {
  const u = tUsers ?? ((key: string) => {
    const map: Record<string, string> = {
      "form.title": "إنشاء مستخدم",
      "form.company": "الشركة",
      "form.companyPlaceholder": "اختر الشركة",
      "form.companyRequired": "اختر الشركة",
      "form.firstName": "اسم المستخدم الاول",
      "form.firstNamePlaceholder": "ادخل اسم المستخدم الاول",
      "form.firstNameRequired": "اسم المستخدم الاول مطلوب",
      "form.nameMinLength": "الاسم يجب أن يحتوي على حرفين على الأقل.",
      "form.lastName": "اسم المستخدم الأخير",
      "form.lastNamePlaceholder": "اسم المستخدم الأخير",
      "form.lastNameRequired": "الاسم مطلوب",
      "form.email": "البريد الإلكتروني",
      "form.emailPlaceholder": "ادخل البريد الإلكتروني",
      "form.emailRequired": "البريد الإلكتروني مطلوب",
      "form.emailInvalid": "يرجى إدخال عنوان بريد إلكتروني صالح.",
      "form.phone": "الهاتف",
      "form.phonePlaceholder": "يرجى إدخال رقم هاتفك.",
      "form.jobTitle": "المسمى الوظيفي",
      "form.jobTitlePlaceholder": "اختر المسمى الوظيفي",
      "form.jobTitleRequired": "المسمى الوظيفي مطلوب.",
      "form.save": "حفظ",
      "form.cancel": "إلغاء",
    };
    return map[key] ?? key;
  }) as ReturnType<typeof useTranslations>;

  return {
    formId: "company-user-form",
    title: u("form.title"),
    apiUrl: `${baseURL}/company-users`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        collapsible: false,
        fields: [
          {
            type: "hiddenObject",
            name: "exist_user_id",
            label: "exist_user_id",
            defaultValue: "",
          },
          {
            type: "select",
            name: "company_id",
            label: u("form.company"),
            placeholder: u("form.companyPlaceholder"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/companies`,
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
                message: u("form.companyRequired"),
              },
            ],
          },
          {
            name: "first_name",
            label: u("form.firstName"),
            type: "text",
            placeholder: u("form.firstNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: u("form.firstNameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicFirstName"),
              },
              {
                type: "minLength",
                value: 2,
                message: u("form.nameMinLength"),
              },
            ],
          },
          {
            name: "last_name",
            label: u("form.lastName"),
            type: "text",
            placeholder: u("form.lastNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: u("form.lastNameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicLastName"),
              },
              {
                type: "minLength",
                value: 2,
                message: u("form.nameMinLength"),
              },
            ],
          },
          {
            name: "email",
            label: u("form.email"),
            type: "email",
            placeholder: u("form.emailPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: u("form.emailRequired"),
              },
              {
                type: "email",
                message: u("form.emailInvalid"),
              },
              {
                type: "apiValidation",
                                message: <InvalidMessage formId="company-user-form"/>,
                apiConfig: {
                  url: `${baseURL}/company-users/check-email`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  successCondition: (response) => {
                    useFormStore.getState().setValues("company-user-form", {
                      exist_user_id: response.payload?.[0]?.id,
                    });
                    useFormStore.getState().setValues("company-user-form", {
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
            label: u("form.phone"),
            type: "phone",
            required: true,
            placeholder: u("form.phonePlaceholder"),
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
            disabled: true,
            label: u("form.jobTitle"),
            placeholder: u("form.jobTitlePlaceholder"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/job_titles/list`,
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
                message: u("form.jobTitleRequired"),
              },
            ],
          },
        ],
      },
    ],
    submitButtonText: u("form.save"),
    cancelButtonText: u("form.cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    editDataTransformer: (data) => {
      return {
                'company_id': data.company.id,
                'first_name': data.name,
                'last_name': data.name,
                'email': data.email,
                'phone': data.phone,
                'job_title_id': data.job_title_id
      };
    },

    // Example onSuccess handler
    onSuccess: (values, result) => {
      console.log("Form submitted successfully with values:", values);
      console.log("Result from API:", result);

      // You can perform additional actions here, such as:
      // - Show a custom notification
      // - Navigate to another page
      // - Update application state
      // - Trigger analytics events
      // - etc.
    },

    // Example onError handler
    onError: (values, error) => {
      console.log("Form submission failed with values:", values);
      console.log("Error details:", error);

      // You can perform additional actions here, such as:
      // - Show a custom error notification
      // - Log the error to an analytics service
      // - Attempt to recover from the error
      // - etc.
    },

    // No onSubmit handler needed - will use the default handler
  };
}
