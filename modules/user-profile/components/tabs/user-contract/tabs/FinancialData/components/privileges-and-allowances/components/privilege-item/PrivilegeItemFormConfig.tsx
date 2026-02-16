import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../../../context/financialDataCxt";
import { UserPrivilege } from "@/modules/user-profile/types/privilege";
import { AllowancesTypes } from "../../AllowancesEnum";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

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
  const { userId, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefreshPrivilegesList, privileges } = useFinancialDataCxt();

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
            name: "type_allowance_code",
            label: "نوع البدل (ثابت - نسبة - توفير)",
            placeholder: "اختر البدل",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/type_allowances`,
              valueField: "code",
              labelField: "name",
              searchParam: "name",
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
            postfix: "%",
            condition: (values) => {
              if (values.type_allowance_code == null) return false;
              return values.type_allowance_code === AllowancesTypes?.Percentage;
            },
            placeholder: "معدل حساب النسبة من اصل الراتب",
            validation: [
              {
                type: "required",
                message: "معدل حساب النسبة من اصل الراتب مطلوب",
              },
              {
                type: "pattern",
                value: /^\d+(\.\d+)?$/,
                message: "يجب إدخال رقم فقط",
              }
            ],
          },
          {
            name: "charge_amount",
            label: "المبلغ",
            type: "text",
            postfix: "ر.س",
            condition: (values) => {
              if (values.type_allowance_code == null) return false;
              return values.type_allowance_code === AllowancesTypes?.Constant;
            },
            placeholder: "المبلغ",
            validation: [
              {
                type: "required",
                message: "المبلغ مطلوب",
              },
              {
                type: "pattern",
                value: /^\d+(\.\d+)?$/,
                message: "يجب إدخال رقم فقط",
              }
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
            condition: (values) => {
              if (values.type_allowance_code == null) return false;
              return values.type_allowance_code !== AllowancesTypes?.Saving;
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
            name: "medical_insurance_id",
            label: "التأمين الطبي",
            placeholder: "اختر التأمين الطبي",
            condition: (values) => {
              // Show this field only when privilege is MedicalInsurance
              const selectedPrivilege = privileges?.find(p => p.id === values.privilege_id);
              const isMedicalInsurance = selectedPrivilege?.type === "MedicalInsurance" ||
                                     selectedPrivilege?.name?.includes("تأمين طبي") ||
                                     privilegeData?.privilege?.type === "MedicalInsurance" ||
                                     privilegeData?.privilege?.name?.includes("تأمين طبي") ||
                                     privilegeData?.type === "MedicalInsurance" ||
                                     privilegeData?.name?.includes("تأمين طبي");
              return isMedicalInsurance;
            },
            dynamicOptions: {
              url: `${baseURL}/medical-insurances`,
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
                message: "اختر التأمين الطبي",
              },
            ],
          },
          {
            name: "description",
            label: "وصف",
            type: "textarea",
            placeholder: "وصف",
          },
        ],
        columns: 2,
      },
    ],
    initialValues: privilegeData,
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      onSuccess?.();
      handleRefetchDataStatus();
      handleRefreshPrivilegesList();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        user_id: userId,
        privilege_id: privilegeId,
      };

      const url = isEdit
        ? `/user_privileges/${privilegeData?.id}`
        : `/user_privileges`;
      // const method = isEdit ? "PUT" : "POST";

      return await defaultSubmitHandler(serialize(body), privilegeItemFormConfig, {
        url: url,
        method: "POST",
      });
    },
  };
  return privilegeItemFormConfig;
};
