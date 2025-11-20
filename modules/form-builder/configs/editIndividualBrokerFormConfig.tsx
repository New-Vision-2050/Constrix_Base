// Edit Individual Broker Form Configuration
// Simplified version for editing existing brokers in sub-entity tables
import React from "react";
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";

export function editIndividualBrokerFormConfig(
  t: ReturnType<typeof useTranslations>,
  handleCloseForm?: () => void
): FormConfig {
  const formId = "edit-individual-broker-form";

  return {
    formId,
    title: "تعديل بيانات الوسيط",
    apiUrl: `${baseURL}/company-users/brokers`,
    isEditMode: true,
    editApiUrl: `${baseURL}/company-users/brokers/:id`,
    editApiMethod: "PUT",
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
          {
            name: "type",
            label: "type",
            type: "hiddenObject",
            defaultValue: "1", // Individual broker
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
          // Name - Disabled (display only)
          {
            name: "name",
            label: "الاسم",
            type: "text",
            placeholder: "الاسم",
            disabled: true,
            required: false,
          },
          // Phone - Disabled (display only)
          {
            name: "phone",
            label: "رقم الجوال",
            type: "phone",
            placeholder: "رقم الجوال",
            disabled: true,
            required: false,
          },
          // Identity (residence) - Disabled (display only)
          {
            name: "residence",
            label: "رقم الهوية",
            type: "text",
            placeholder: "رقم الهوية",
            disabled: true,
            required: false,
          },
          // Branches - Conditional enable/disable based on sharing settings
          {
            name: "branch_ids",
            label: "الفروع",
            type: "select",
            isMulti: true,
            placeholder: "اختر الفروع",
            dynamicOptions: {
              url: `${baseURL}/branches`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            // Note: disabled property will be set dynamically based on sharing settings
          },
          // Correspondence Address - Enabled for editing
          {
            name: "chat_mail",
            label: "عنوان المراسلات",
            type: "text",
            placeholder: "عنوان المراسلات",
          },
        ],
      },
    ],
    editDataTransformer: (data) => {
      // Transform the API response to match form fields
      return {
        id: data?.id,
        user_id: data?.user_id,
        email: data?.email,
        name: data?.name,
        phone: data?.phone,
        residence: data?.residence,
        branch_ids: data?.branch_ids || data?.branches?.map((b: any) => b.id) || [],
        chat_mail: data?.chat_mail,
        type: "1",
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

