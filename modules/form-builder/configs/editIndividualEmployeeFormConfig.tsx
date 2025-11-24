// Edit Individual Employee Form Configuration
// Simplified version for editing existing employees in sub-entity tables
import React from "react";
import { useTranslations } from "next-intl";
import { apiClient, baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export function editIndividualEmployeeFormConfig(
  t: ReturnType<typeof useTranslations>,
  handleCloseForm?: () => void
): FormConfig {
  const formId = "edit-individual-employee-form";

  return {
    formId,
    title: "تعديل بيانات الموظف",
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
            label: "البريد الإلكتروني",
            type: "email",
            placeholder: "البريد الإلكتروني",
            disabled: true,
            required: false,
          },
          // First Name - Disabled (display only)
          {
            name: "first_name",
            label: "اسم الموظف الأول",
            type: "text",
            placeholder: "اسم الموظف الأول",
            disabled: true,
            required: false,
          },
          // Last Name - Disabled (display only)
          {
            name: "last_name",
            label: "اسم الموظف الأخير",
            type: "text",
            placeholder: "اسم الموظف الأخير",
            disabled: true,
            required: false,
          },
          // Country - Disabled (display only)
          {
            name: "country_id",
            label: "الجنسية",
            type: "select",
            placeholder: "اختر الجنسية",
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
            label: "الهاتف",
            type: "phone",
            placeholder: "الهاتف",
            disabled: true,
            required: false,
          },
          // Job Title - Disabled (display only)
          {
            name: "job_title_id",
            label: "المسمى الوظيفي",
            type: "select",
            placeholder: "اختر المسمى الوظيفي",
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
            label: "الفرع",
            type: "select",
            placeholder: "اختر الفرع",
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
            label: "حالة الموظف",
            type: "select",
            placeholder: "اختر حالة الموظف",
            options: [
              { label: "نشط", value: "1" },
              { label: "غير نشط", value: "0" },
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
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "إعادة تعيين",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: true,
    showBackButton: false,
  };
}

