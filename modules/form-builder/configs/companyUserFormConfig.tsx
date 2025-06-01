import {FormConfig, useFormStore} from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import {InvalidMessage} from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import {useTranslations} from "next-intl";

export function GetCompanyUserFormConfig(t:ReturnType<typeof useTranslations>): FormConfig {
    return {
        formId: "company-user-form",
        title: "إنشاء مستخدم",
        apiUrl: `${baseURL}/company-users`,
        laravelValidation: {
            enabled: true,
            errorsPath: "errors", // This is the default in Laravel
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
                        label: "الشركة",
                        placeholder: "اختر الشركة",
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
                                message: 'اختر الشركة',
                            },
                        ],
                    },
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
                        disabled: true,
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
