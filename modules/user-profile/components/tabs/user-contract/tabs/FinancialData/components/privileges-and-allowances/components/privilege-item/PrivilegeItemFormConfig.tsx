import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../../../context/financialDataCxt";
import { UserPrivilege } from "@/modules/user-profile/types/privilege";
import { AllowancesTypes } from "../../AllowancesEnum";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

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
  const { handleRefreshPrivilegesList } = useFinancialDataCxt();
  const t = useTranslations("UserProfile.tabs.financialData.privilegeForm");

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
            label: t("typePrivilegeLabel"),
            placeholder: t("typePrivilegePlaceholder"),
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
                message: t("typePrivilegeRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "type_allowance_code",
            label: t("typeAllowanceLabel"),
            placeholder: t("typeAllowancePlaceholder"),
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
                message: t("typeAllowanceRequired"),
              },
            ],
          },
          {
            name: "charge_amount",
            label: t("chargeAmountPercentageLabel"),
            type: "text",
            postfix: "%",
            condition: (values) => {
              if (values.type_allowance_code == null) return false;
              return values.type_allowance_code === AllowancesTypes?.Percentage;
            },
            placeholder: t("chargeAmountPercentagePlaceholder"),
            validation: [
              {
                type: "required",
                message: t("chargeAmountPercentageRequired"),
              },
              {
                type: "pattern",
                value: /^\d+(\.\d+)?$/,
                message: t("numberOnlyValidation"),
              }
            ],
          },
          {
            name: "charge_amount",
            label: t("chargeAmountLabel"),
            type: "text",
            postfix: "ر.س",
            condition: (values) => {
              if (values.type_allowance_code == null) return false;
              return values.type_allowance_code === AllowancesTypes?.Constant;
            },
            placeholder: t("chargeAmountPlaceholder"),
            validation: [
              {
                type: "required",
                message: t("chargeAmountRequired"),
              },
              {
                type: "pattern",
                value: /^\d+(\.\d+)?$/,
                message: t("numberOnlyValidation"),
              }
            ],
          },
          {
            type: "select",
            name: "period_id",
            label: t("periodLabel"),
            placeholder: t("periodPlaceholder"),
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
                message: t("periodRequired"),
              },
            ],
          },
          {
            name: "description",
            label: t("descriptionLabel"),
            type: "textarea",
            placeholder: t("descriptionPlaceholder"),
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      type_privilege_id: privilegeData?.type_privilege_id,
      type_allowance_code: privilegeData?.type_allowance_code,
      charge_amount: privilegeData?.charge_amount,
      period_id: privilegeData?.period_id,
      description: privilegeData?.description,
    },
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
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
