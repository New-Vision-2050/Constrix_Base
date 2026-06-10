import React from "react";
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
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
  familyMembers?: any[];
  familyMembersRef?: React.RefObject<any[]>;
  onOpenFamilyDialog?: () => void;
};
export const PrivilegeItemFormConfig = ({
  privilegeData,
  privilegeId,
  onSuccess,
  familyMembers,
  familyMembersRef,
  onOpenFamilyDialog,
}: PropsT) => {
  // declare and define helper variables
  const isEdit = privilegeData ? true : false;
  const { userId, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefreshPrivilegesList, privileges } = useFinancialDataCxt();

  const t = useTranslations("UserProfile.nestedTabs.privilegesAndAllowances");
  const tActions = useTranslations("UserProfile.nestedTabs.commonActions");
  const tEdit = useTranslations(
    "UserProfile.nestedTabs.privilegesAndAllowances.edit",
  );

  const isMedicalInsurance = (() => {
    if (privilegeData) {
      return (
        privilegeData?.privilege?.type === "MedicalInsurance" ||
        privilegeData?.privilege?.type === "health_insurance" ||
        privilegeData?.privilege?.name?.includes("تأمين طبي")
      );
    }
    const selectedPrivilege = privileges?.find((p) => p.id === privilegeId);
    return (
      selectedPrivilege?.type === "MedicalInsurance" ||
      selectedPrivilege?.type === "health_insurance" ||
      selectedPrivilege?.name?.includes("تأمين طبي") ||
      false
    );
  })();

  const isSavingAndMedical = (values?: Record<string, any>) => {
    if (!isMedicalInsurance) return false;
    if (values) return values.type_allowance_code === AllowancesTypes?.Saving;
    return privilegeData?.type_allowance_code === AllowancesTypes?.Saving;
  };

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
            name: "type_allowance_code",
            label: tEdit("allowanceTypeCategory"),
            placeholder: tEdit("placeholders.allowanceTypeCategory"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/type_allowances`,
              valueField: "code",
              labelField: "name",
              searchParam: "name",
              totalCountHeader: "X-Total-Count",
              transformResponse: (data: any) => {
                const items = Array.isArray(data) ? data : data?.payload || [];
                return items
                  .filter(
                    (item: any) =>
                      item?.code && item?.name && item.code !== "percentage",
                  )
                  .map((item: any) => ({ value: item.code, label: item.name }));
              },
            },
            validation: [
              {
                type: "required",
                message: tEdit("validation.allowanceTypeCategoryRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "type_privilege_id",
            label: tEdit("allowanceType"),
            placeholder: tEdit("placeholders.allowanceType"),
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
                message: tEdit("validation.allowanceTypeRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "medical_insurance_id",
            label: tEdit("subscriptions.policy"),
            placeholder: tEdit("placeholders.medicalInsurancePolicyNumber"),
            condition: () => isMedicalInsurance,
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
                message: tEdit(
                  "validation.medicalInsurancePolicyNumberRequired",
                ),
              },
            ],
          },
          {
            type: "select",
            name: "subscriptions[0].medical_insurance_category_id",
            label: tEdit("subscriptions.category"),
            placeholder: tEdit("subscriptions.placeholders.category"),
            condition: (values) => isSavingAndMedical(values),
            dynamicOptions: {
              url: `${baseURL}/medical-insurances/{medical_insurance_id}/categories`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              dependsOn: [
                {
                  field: "medical_insurance_id",
                  method: "replace",
                },
              ],
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
          },
          {
            name: "subscriptions[0].subscription_no",
            label: tEdit("subscriptions.subscriptionNo"),
            type: "text",
            condition: (values) => isSavingAndMedical(values),
            placeholder: tEdit("subscriptions.placeholders.subscriptionNo"),
            validation: [
              {
                type: "required",
                message: tEdit(
                  "subscriptions.validation.subscriptionNoRequired",
                ),
              },
            ],
          },
          {
            name: "subscriptions[0].amount",
            label: tEdit("subscriptions.amount"),
            type: "text",
            postfix: "ر.س",
            condition: (values) => isSavingAndMedical(values),
            placeholder: tEdit("subscriptions.placeholders.amount"),
            validation: [
              {
                type: "required",
                message: tEdit("subscriptions.validation.amountRequired"),
              },
              {
                type: "pattern",
                value: /^\d+(\.\d+)?$/,
                message: tEdit("subscriptions.validation.amountInvalid"),
              },
            ],
          },
          {
            name: "charge_amount",
            label: tEdit("amount"),
            type: "text",
            postfix: "ر.س",
            condition: (values) => {
              if (values.type_allowance_code == null) return false;
              return values.type_allowance_code === AllowancesTypes?.Constant;
            },
            placeholder: tEdit("placeholders.amount"),
            validation: [
              {
                type: "required",
                message: tEdit("validation.amountRequired"),
              },
              {
                type: "pattern",
                value: /^\d+(\.\d+)?$/,
                message: tEdit("validation.amountInvalid"),
              },
            ],
          },
          {
            type: "select",
            name: "period_id",
            label: tEdit("periodUnit"),
            placeholder: tEdit("placeholders.periodUnit"),
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
              return values.type_allowance_code === AllowancesTypes?.Constant;
            },
            validation: [
              {
                type: "required",
                message: tEdit("validation.periodUnitRequired"),
              },
            ],
          },
          {
            name: "description",
            label: tEdit("description"),
            type: "textarea",
            placeholder: tEdit("placeholders.description"),
            condition: (values) => {
              return values.type_allowance_code !== AllowancesTypes?.Saving;
            },
          },
          {
            name: "_family_members_button",
            type: "text",
            label: " ",
            condition: (values) => {
              if (!isMedicalInsurance) return false;
              if (!values.type_privilege_id) return false;
              // Use privilegeData to detect individual vs family by ID
              if (privilegeData?.type_privilege?.id) {
                const savedName = (
                  privilegeData.type_privilege.name || ""
                ).toLowerCase();
                const isSavedFamily =
                  savedName.includes("عائل") || savedName.includes("family");
                const isSavedIndividual =
                  savedName.includes("فردي") ||
                  savedName.includes("individual");
                if (isSavedFamily) {
                  // Saved is family - show only if same ID selected
                  return (
                    values.type_privilege_id === privilegeData.type_privilege.id
                  );
                }
                if (isSavedIndividual) {
                  // Saved is individual - show only if different ID selected (family)
                  return (
                    values.type_privilege_id !== privilegeData.type_privilege.id
                  );
                }
              }
              return true;
            },
            render: () => {
              if (!onOpenFamilyDialog) return null;
              return React.createElement(
                "button",
                {
                  type: "button",
                  onClick: onOpenFamilyDialog,
                  className:
                    "w-fit rounded-md bg-pink-600 px-3 py-2 text-white text-xs font-medium hover:bg-pink-700 transition-colors",
                },
                `${tEdit("subscriptions.familyMembers")} (${familyMembers?.length || 0})`,
              );
            },
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      ...privilegeData,
      type_allowance_code: privilegeData?.type_allowance_code || "",
      type_privilege_id: privilegeData?.type_privilege_id || "",
      medical_insurance_id:
        privilegeData?.medical_insurance_id ||
        privilegeData?.subscriptions?.[0]?.medical_insurance_id ||
        "",
      "subscriptions[0].medical_insurance_category_id":
        privilegeData?.subscriptions?.[0]?.medical_insurance_category_id || "",
      "subscriptions[0].amount":
        privilegeData?.subscriptions?.[0]?.amount?.toString() || "",
      "subscriptions[0].subscription_no":
        privilegeData?.subscriptions?.[0]?.subscription_no || "",
    },
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: tActions("clearForm"),
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
      // Read latest familyMembers from ref to avoid stale closure
      const currentFamilyMembers =
        familyMembersRef?.current || familyMembers || [];

      console.log("=== DEBUG onSubmit ===");
      console.log("isMedicalInsurance:", isMedicalInsurance);
      console.log("type_allowance_code:", formData.type_allowance_code);
      console.log("AllowancesTypes.Saving:", AllowancesTypes?.Saving);
      console.log("familyMembersRef?.current:", familyMembersRef?.current);
      console.log("familyMembers prop:", familyMembers);
      console.log("currentFamilyMembers:", currentFamilyMembers);
      console.log("=== END DEBUG ===");

      const body: Record<string, unknown> = {
        user_id: userId,
        privilege_id: privilegeId,
        type_privilege_id: formData.type_privilege_id,
        type_allowance_code: formData.type_allowance_code,
        description: formData.description || "",
      };

      // Build subscriptions array for medical insurance with saving
      const hasMedicalData =
        isMedicalInsurance ||
        formData.medical_insurance_id ||
        currentFamilyMembers.length > 0;
      if (
        hasMedicalData &&
        formData.type_allowance_code === AllowancesTypes?.Saving
      ) {
        const subscription: Record<string, unknown> = {
          medical_insurance_id: formData.medical_insurance_id,
          amount:
            parseFloat(formData["subscriptions[0].amount"] as string) || 0,
          subscription_no: formData["subscriptions[0].subscription_no"],
          subscription_type: "individual",
          status: 1,
        };

        // Add medical_insurance_category_id if selected
        if (formData["subscriptions[0].medical_insurance_category_id"]) {
          subscription.medical_insurance_category_id =
            formData["subscriptions[0].medical_insurance_category_id"];
        }

        // Add family members if available
        if (currentFamilyMembers.length > 0) {
          subscription.subscription_type = "family";
          subscription.family_members = currentFamilyMembers.map(
            (member: any) => ({
              name: member.name,
              national_id: member.national_id,
              relation: member.relation,
              amount: parseFloat(member.amount) || 0,
              subscription_no: member.subscription_no || "",
            }),
          );
        }

        body.subscriptions = [subscription];
      }

      // For constant type, include charge_amount and period_id
      if (formData.type_allowance_code === AllowancesTypes?.Constant) {
        body.charge_amount = formData.charge_amount;
        body.period_id = formData.period_id;
      }

      const url = isEdit
        ? `/user_privileges/${privilegeData?.id}`
        : `/user_privileges`;

      return await defaultSubmitHandler(body, privilegeItemFormConfig, {
        url: url,
        method: "POST",
      });
    },
  };
  return privilegeItemFormConfig;
};
