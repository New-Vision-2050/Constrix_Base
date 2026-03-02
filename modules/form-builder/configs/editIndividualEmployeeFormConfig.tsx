// Edit Individual Employee Form Configuration
// Simplified version for editing existing employees in sub-entity tables
import React from "react";
import { useTranslations } from "next-intl";
import { apiClient, baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export function editIndividualEmployeeFormConfig(
  t: (key: string) => string,
  handleCloseForm?: () => void
): FormConfig {
  const formId = "edit-individual-employee-form";

  return {
    formId,
    title: t("EditEmployeeData"),
    apiUrl: `${baseURL}/users`,
    editIdField: 'user_id',
    isEditMode: true,
    editApiUrl: `${baseURL}/users/:id`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        collapsible: false,
        fields: [
          // Hidden fields for data management
          {
            name: "id",
            label: "id",
            type: "hiddenObject",
          },
          {
            name: "user_id",
            label: "user_id",
            type: "hiddenObject",
          },
          // Email - Disabled (display only)
          {
            name: "email",
            label: t("Email"),
            type: "email",
            placeholder: t("Email"),
            disabled: true,
            required: false,
          },
          // First Name - Disabled (display only)
          {
            name: "first_name",
            label: t("FirstName"),
            type: "text",
            placeholder: t("FirstName"),
            disabled: true,
            required: false,
          },
          // Last Name - Disabled (display only)
          {
            name: "last_name",
            label: t("LastName"),
            type: "text",
            placeholder: t("LastName"),
            disabled: true,
            required: false,
          },
          // Country - Disabled (display only)
          {
            name: "country_id",
            label: t("Nationality"),
            type: "select",
            placeholder: t("SelectNationality"),
            dynamicOptions: {
              url: `${baseURL}/countries`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            disabled: true,
            required: false,
          },
          // Phone - Disabled (display only)
          {
            name: "phone",
            label: t("Phone"),
            type: "phone",
            placeholder: t("Phone"),
            disabled: true,
            required: false,
          },
          // Job Title - Disabled (display only)
          {
            name: "job_title_id",
            label: t("JobTitle"),
            type: "select",
            placeholder: t("SelectJobTitle"),
            dynamicOptions: {
              url: `${baseURL}/job_titles/list`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            disabled: true,
            required: false,
          },
          // Branch - Enabled for editing
          {
            name: "branch_id",
            label: t("Branch"),
            type: "select",
            placeholder: t("SelectBranch"),
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=branch`,
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
          // Status - Enabled for editing
          {
            name: "status",
            label: t("EmployeeStatus"),
            type: "select",
            placeholder: t("SelectEmployeeStatus"),
            options: [
              { label: t("Active"), value: "1" },
              { label: t("Inactive"), value: "0" },
            ],
          },
        ],
      },
    ],
    editDataTransformer: (data) => {
      // Transform the API response to match form fields
      return {
        id: data?.id,
        user_id: data?.id,
        email: data?.email,
        first_name: data?.name?.split(" ")[0],
        last_name: data?.name?.split(" ")[1],
        country_id: data?.country_id,
        phone: data?.phone,
        job_title_id: data?.job_title_id,
        branch_id: data?.branch_id,
        status: data?.status?.toString() || "1",
      };
    },
    onSubmit: async (formData) => {
        const body = {
            branch_id: formData?.branch_id,
            status: formData?.status,
        };
        await apiClient.post(`${baseURL}/company-users/employees/${formData.user_id}`, body);
        return {
            success: true,
            message: 'Employee data edited successfully',
            data: formData,
        };
    },
    onSuccess: handleCloseForm,
    submitButtonText: t("Save"),
    cancelButtonText: t("Cancel"),
    showReset: false,
    resetButtonText: t("Reset"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton:false,
    showBackButton: false,
  };
}

