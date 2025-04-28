import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useUserBankingDataCxt } from "../../../context";

type PropsT = {
  bank?: BankAccount;
  onSuccess?: () => void;
};
export const BankingDataFormConfig = (props: PropsT) => {
  // declare and define helper state and variables
  const { bank, onSuccess } = props ?? {};
  const formType = bank ? "Edit" : "Create";
  const { handleRefreshBankingData } = useUserBankingDataCxt();
  const { user, handleRefetchDataStatus, handleRefetchProfileData } =
    useUserProfileCxt();

  // form config

  const BankingFormConfig: FormConfig = {
    formId: `Banking-data-form-${formType}-${bank?.id ?? ""}`,
    apiUrl: `${baseURL}/bank_accounts`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "country_id",
            label: "الدولة",
            placeholder: "اختر الدولة",
            required: true,
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
            validation: [
              {
                type: "required",
                message: "ادخل الدولة",
              },
            ],
          },
          {
            type: "select",
            name: "bank_id",
            label: "البنك",
            placeholder: "اختر البنك",
            dynamicOptions: {
              url: `${baseURL}/banks`,
              valueField: "id",
              labelField: "name",
              dependsOn: "country_id",
              filterParam: "country_id",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
            },
            validation: [
              {
                type: "required",
                message: "البنك مطلوب",
              },
            ],
          },
          {
            type: "select",
            name: "type",
            label: "نوع الحساب",
            placeholder: "اختر نوع الحساب",
            options: [
              { label: "أفتراضي", value: "default" },
              { label: "عهد", value: "custody" },
              { label: "رواتب", value: "salaries" },
            ],
            validation: [
              {
                type: "required",
                message: "نوع الحساب مطلوب",
              },
            ],
          },
          {
            type: "select",
            name: "currency_id",
            label: "عملة الحساب",
            placeholder: "اختر عملة الحساب",
            dynamicOptions: {
              url: `${baseURL}/currencies`,
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
                message: "عملة الحساب مطلوب",
              },
            ],
          },
          {
            type: "text",
            name: "iban",
            label: "رمز ال iban",
            placeholder: "اختر رمز ال iban",
            validation: [
              {
                type: "required",
                message: "رمز ال iban مطلوب",
              },
            ],
          },
          {
            type: "text",
            name: "user_name",
            label: "أسم المستخدم",
            placeholder: "اختر أسم المستخدم",
            validation: [
              {
                type: "required",
                message: "أسم المستخدم مطلوب",
              },
            ],
          },
          {
            type: "text",
            name: "account_number",
            label: "رقم الحساب",
            placeholder: "اختر رقم الحساب",
            validation: [
              {
                type: "required",
                message: "رقم الحساب مطلوب",
              },
            ],
          },
          {
            type: "text",
            name: "swift_bic",
            label: "كود ال swift",
            placeholder: "اختر كود ال swift",
            validation: [
              {
                type: "required",
                message: "كود ال swift مطلوب",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      account_number: bank?.account_number,
      bank_id: bank?.bank_id,
      country_id: bank?.country_id,
      currency_id: bank?.currency_id,
      iban: bank?.iban,
      swift_bic: bank?.swift_bic,
      type: bank?.type,
      user_name: bank?.user_name,
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: formType === "Create" ? true : false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchProfileData();
      handleRefreshBankingData();
      handleRefetchDataStatus();
      onSuccess?.();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        user_id: user?.user_id,
      };
      const url = `/bank_accounts${formType === "Edit" ? `/${bank?.id}` : ""}`;
      const response = await (formType == "Create"
        ? apiClient.post
        : apiClient.put)(url, body);

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return BankingFormConfig;
};
