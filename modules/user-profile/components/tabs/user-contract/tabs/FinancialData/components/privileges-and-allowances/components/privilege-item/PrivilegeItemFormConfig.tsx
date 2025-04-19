import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../../../context/financialDataCxt";
import { UserPrivilege } from "@/modules/user-profile/types/privilege";

type PropsT = {
  privilegeData?: UserPrivilege;
  privilegeId?: string;
  onSuccess?: () => void;
};
export const PrivilegeItemFormConfig = ({
  privilegeData,
  privilegeId,
  onSuccess,
}: PropsT) => {
  // declare and define helper variables
  const isEdit = privilegeData ? true : false;
  const { user } = useUserProfileCxt();
  const { handleRefreshPrivilegesList } = useFinancialDataCxt();

  const privilegeItemFormConfig: FormConfig = {
    formId: `privilege-form-${privilegeData?.id}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "type_privilege_id",
            label: "نوع البدل (عائلي - فردي)",
            placeholder: "اختر البدل",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/type_privileges`,
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
                message: "ادخل البدل",
              },
            ],
          },
          {
            type: "select",
            name: "type_allowance_id",
            label: " (ثابت - نسبة - توفير) نوع البدل",
            placeholder: "اختر البدل",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/type_allowances`,
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
                message: "ادخل البدل",
              },
            ],
          },
          {
            name: "charge_amount",
            label: "معدل حساب النسبة من اصل الراتب",
            type: "text",
            placeholder: "معدل حساب النسبة من اصل الراتب",
            validation: [
              {
                type: "required",
                message: "معدل حساب النسبة من اصل الراتب مطلوب",
              },
            ],
          },
          {
            type: "select",
            name: "period_id",
            label: "وحدة المدة",
            placeholder: "اختر البدل",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/periods`,
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
                message: "ادخل البدل",
              },
            ],
          },
          {
            name: "description",
            label: "وصف",
            type: "text",
            placeholder: "وصف",
            validation: [
              {
                type: "required",
                message: "وصف مطلوب",
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      type_privilege_id: privilegeData?.type_privilege_id,
      type_allowance_id: privilegeData?.type_allowance_id,
      charge_amount: privilegeData?.charge_amount,
      period_id: privilegeData?.period_id,
      description: privilegeData?.description,
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      onSuccess?.();
      handleRefreshPrivilegesList();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        user_id: user?.user_id,
        privilege_id: privilegeId,
      };

      const url = isEdit
        ? `/user_privileges/${privilegeData?.id}`
        : `/user_privileges`;
        
      const _apiClient = isEdit ? apiClient.put : apiClient.post;


      const response = await _apiClient(url, serialize(body));

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return privilegeItemFormConfig;
};
