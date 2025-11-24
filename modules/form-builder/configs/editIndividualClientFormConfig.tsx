// Edit Individual Client Form Configuration
// Simplified version for editing existing clients in sub-entity tables
import React from "react";
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { editClientData } from "@/modules/clients/apis/edit-client-data";

export function editIndividualClientFormConfig(
  t: ReturnType<typeof useTranslations>,
  handleCloseForm?: () => void,
  isShareClient?: boolean,
  currentEmpId?: string,
): FormConfig {
  console.log('isShareClient', isShareClient, currentEmpId);
  const formId = "edit-individual-client-form";

  return {
    formId,
    title: "تعديل بيانات العميل",
    apiUrl: `${baseURL}/users`,
    editIdField: 'user_id',
    isEditMode: true,
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
            defaultValue: "1", // Individual client
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
            name: "branch_ids_all",
            label: "الفروع",
            type: "select",
            isMulti: true,
            placeholder: "اختر الفروع",
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/user-access/user/${currentEmpId}/branches?role=2`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              selectAll: isShareClient,
              paginationEnabled: false,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              // disableReactQuery: true,
              // disableReactQuery: false,
            },
            disabled: isShareClient,
          },
          // Broker - Enabled for editing
          {
            name: "broker_id",
            label: "الوسيط",
            type: "select",
            placeholder: "اختر الوسيط",
            dynamicOptions: {
              url: `${baseURL}/company-users/brokers`,
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
      console.log('editDataTransformer', data);
      // Transform the API response to match form fields
      return {
        id: data?.id,
        user_id: data?.id,
        email: data?.email,
        name: data?.name,
        phone: data?.phone,
        residence: data?.residence,
        branch_ids_all: data?.branch_ids || data?.branches?.map((b: any) => b.id) || [],
        broker_id: data?.broker_id,
        chat_mail: data?.chat_mail,
        type: "1",
      };
    },
    onSubmit: async (formData) => {
      const body = {
        branch_ids: formData.branch_ids_all,
        broker_id: formData.broker_id,
        chat_mail: formData.chat_mail,
      };
      await editClientData(formData.id, body);
      return {
        success: true,
        message: 'Client data edited successfully',
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

