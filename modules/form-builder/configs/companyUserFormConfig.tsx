import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
const t = useTranslations("CompanyUserForm");
export const companyUserFormConfig: FormConfig = {
    formId: "company-user-form",
    title: t("CreateUser"),
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
                    label: t("Company"),
                    placeholder: t("SelectCompany"),
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
                            message: t("SelectCompany"),
                        },
                    ],
                },
                {
                    name: "first_name",
                    label: t("FirstName"),
                    type: "text",
                    placeholder: t("FirstName"),
                    required: true,
                    validation: [
                        {
                            type: "required",
                            message: t("EnterFirstName"),
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
                    label: t("LastName"),
                    type: "text",
                    placeholder: t("LastName"),
                    required: true,
                    validation: [
                        {
                            type: "required",
                            message: t("EnterLastName"),
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
                    label: t("Email"),
                    type: "email",
                    placeholder: t("Email"),
                    required: true,
                    validation: [
                        {
                            type: "required",
                            message: t("EnterEmail"),
                        },
                        {
                            type: "email",
                            message: "Please enter a valid email address",
                        },
                    ],
                },
                {
                    name: "phone",
                    label: t("Phone"),
                    type: "phone",
                    placeholder: t("Phone"),
                    validation: [
                        {
                            type: "required",
                            message: t("PleaseEnterPhoneNumber"),
                        },
                    ],
                },
                {
                    type: "select",
                    name: "job_title_id",
                    label: t("JobTitle"),
                    placeholder: t("SelectJobTitle"),
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
                            message: t("JobTitle"),
                        },
                    ],
                },
            ],
        },
    ],
    submitButtonText: t("Save"),
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
