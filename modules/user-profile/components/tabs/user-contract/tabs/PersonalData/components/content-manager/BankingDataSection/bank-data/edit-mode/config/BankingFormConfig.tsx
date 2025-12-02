import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useUserBankingDataCxt } from "../../../context";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

type PropsT = {
  bank?: BankAccount;
  onSuccess?: () => void;
};
export const BankingDataFormConfig = (props: PropsT) => {
  // declare and define helper state and variables
  const { bank, onSuccess } = props ?? {};
  const formType = bank ? "Edit" : "Create";
  const { handleRefreshBankingData } = useUserBankingDataCxt();
  const { userId, handleRefetchDataStatus, handleRefetchProfileData } =
    useUserProfileCxt();
  const t = useTranslations("UserProfile.nestedTabs.bankingData");

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
            label: t("country"),
            placeholder: t("countryPlaceholder"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/countries`,
              valueField: "id",
              labelField: "name",
              // searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("countryRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "bank_id",
            label: t("bank"),
            placeholder: t("bankPlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/banks`,
              valueField: "id",
              labelField: "name",
              // searchParam: "name",
              dependsOn: "country_id",
              filterParam: "country_id",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
            },
            required: true,
            validation: [
              {
                type: "required",
                message: t("bankRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "type_id",
            label: t("accountType"),
            placeholder: t("accountTypePlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/bank_type_accounts`,
              valueField: "id",
              setFirstAsDefault: true,
              labelField: "name",
              // searchParam: "name",
              paginationEnabled: true,
            },
            required: true,
            validation: [
              {
                type: "required",
                message: t("accountTypeRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "currency_id",
            label: t("currency"),
            placeholder: t("currencyPlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/currencies`,
              valueField: "id",
              labelField: "name",
              // searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
            },
            required: true,
            validation: [
              {
                type: "required",
                message: t("currencyRequired"),
              },
            ],
          },
          {
            type: "text",
            name: "iban",
            label: t("iban"),
            placeholder: t("ibanPlaceholder"),
            validation: [
              {
                type: "pattern",
                value: "^[A-Z]{2}[0-9A-Z]{13,32}$",
                message: t("ibanPattern"),
              },
            ],
          },
          {
            type: "text",
            name: "user_name",
            label: t("userName"),
            placeholder: t("userNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("userNameRequired"),
              },
            ],
          },
          {
            type: "text",
            name: "account_number",
            label: t("accountNumber"),
            placeholder: t("accountNumberPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("accountNumberRequired"),
              },
              {
                type: "pattern",
                value: "^[0-9]{8,32}$",
                message: t("accountNumberPattern"),
              },
            ],
          },
          {
            type: "text",
            name: "swift_bic",
            label: t("swiftBic"),
            placeholder: t("swiftBicPlaceholder"),
            validation: [
              {
                type: "pattern",
                value: "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
                message: t("swiftBicPattern"),
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
      type_id: bank?.type_id,
      iban: bank?.iban,
      swift_bic: bank?.swift_bic,
      type: bank?.type,
      user_name: bank?.user_name,
    },
    submitButtonText: t("submitButtonText"),
    cancelButtonText: t("cancelButtonText"),
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
        user_id: userId,
      };
      const method = formType !== "Edit" ? "POST" : "PUT";
      const url = `/bank_accounts${formType === "Edit" ? `/${bank?.id}` : ""}`;

      return await defaultSubmitHandler(body, BankingFormConfig, {
        url: url,
        method: method,
      });
    },
  };
  return BankingFormConfig;
};
