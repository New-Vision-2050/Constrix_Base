import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Relative } from "@/modules/user-profile/types/relative";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useConnectionDataCxt } from "../../../../context/ConnectionDataCxt";
import { MaritalStatusList } from "../../marital-status-enum";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

type PropsT = {
  relative?: Relative;
  onSuccess?: () => void;
};

export const MaritalStatusRelativesFormConfig = (props: PropsT) => {
  const { relative, onSuccess } = props;
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchUserRelativesData } = useConnectionDataCxt();
  const formMode = !relative ? "Create" : "Edit";
  const t = useTranslations("UserProfile.nestedTabs.maritalStatusRelatives");

  const maritalStatusRelativesFormConfig: FormConfig = {
    formId: `ConnectionInformation-relatives-data-form-${relative?.id ?? ""}`,
    title: t("title"),
    apiUrl: `${baseURL}/user_relatives`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "marital_status_id",
            label: t("maritalStatus"),
            type: "select",
            options: MaritalStatusList,
            dynamicOptions: {
              url: `${baseURL}/marital_statuses`,
              valueField: "id",
              labelField: "name",
            },
            placeholder: t("maritalStatus"),
          },
          {
            name: "name",
            label: t("name"),
            type: "text",
            placeholder: t("name"),
            validation: [
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty
                  // Check if the value contains only letters (Arabic or English) and spaces
                  const lettersOnlyRegex = /^[\u0600-\u06FF\s\u0020a-zA-Z]+$/;
                  return lettersOnlyRegex.test(value);
                },
                message: t("nameValidationMessage"),
              },
            ],
          },
          {
            name: "relationship",
            label: t("relationship"),
            type: "text",
            placeholder: t("relationship"),
            validation: [
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty
                  // Check if the value contains only letters (Arabic or English) and spaces
                  const lettersOnlyRegex = /^[\u0600-\u06FF\s\u0020a-zA-Z]+$/;
                  return lettersOnlyRegex.test(value);
                },
                message: t("relationshipValidationMessage"),
              },
            ],
          },
          {
            name: "phone",
            label: t("phone"),
            type: "phone",
            placeholder: t("phone"),
            validation: [
              {
                type: "phone",
                message: t("phoneValidationMessage"),
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      marital_status: relative?.marital_status,
      name: relative?.name,
      phone: relative?.phone,
      relationship: relative?.relationship,
    },
    submitButtonText: t("submitButtonText"),
    cancelButtonText: t("cancelButtonText"),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: formMode === "Create" ? true : false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      onSuccess?.();
      handleRefetchDataStatus();
      handleRefetchUserRelativesData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const url =
        formMode === "Create"
          ? "/user_relatives"
          : `/user_relatives/${relative?.id}`;
      const method = formMode === "Create" ? "POST" : `PUT`;

      const body = {
        ...formData,
        user_id: user?.user_id,
      };

      return await defaultSubmitHandler(
        body,
        maritalStatusRelativesFormConfig,
        {
          url: url,
          method: method,
        }
      );
    },
  };
  return maritalStatusRelativesFormConfig;
};
