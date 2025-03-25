import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const companyUserFormConfig: FormConfig = {
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
                    placeholder: "اسم المستخدم الاول",
                    required: true,
                    validation: [
                        {
                            type: "required",
                            message: "ادخل اسم المستخدم الاول",
                        },
                        {
                            type: "minLength",
                            value: 2,
                            message: "Name must be at least 2 characters",
                        },
                    ],
                },
                {
                    name: "last_name",
                    label: "اسم المستخدم ألأحير",
                    type: "text",
                    placeholder: "اسم المستخدم ألأحير",
                    required: true,
                    validation: [
                        {
                            type: "required",
                            message: "ادخل اسم المستخدم ألأحير",
                        },
                        {
                            type: "minLength",
                            value: 2,
                            message: "Name must be at least 2 characters",
                        },
                    ],
                },
                {
                    name: "email",
                    label: "البريد الإلكتروني",
                    type: "email",
                    placeholder: "البريد الإلكتروني",
                    required: true,
                    validation: [
                        {
                            type: "required",
                            message: "ادخل البريد الإلكتروني",
                        },
                        {
                            type: "email",
                            message: "Please enter a valid email address",
                        },
                    ],
                },
                {
                    name: "phone",
                    label: "الهاتف",
                    type: "phone",
                    placeholder: "الهاتف",
                    validation: [
                        {
                            type: "required",
                            message: "برجاء إدخال رقم الهاتف",
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
                        url: `${baseURL}/job_titles`,
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
                            message: "المسمى الوظيفي",
                        },
                    ],
                },
            ],
        },
    ],
    submitButtonText: "حفظ",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    editDataTransformer:(data)=>{
        return {
            'company_id' : data.company[0].id,
            'first_name' : data.name,
            'last_name' : data.name,
            'email' : data.email,
            'phone' : data.phone,
            'job_title_id' : data.job_title_id
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
