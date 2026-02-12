import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Relative } from "@/modules/user-profile/types/relative";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useConnectionDataCxt } from "../../../../context/ConnectionDataCxt";
import { MaritalStatusList } from "../../marital-status-enum";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";
import { useState } from "react";

type PropsT = {
  relative?: Relative;
  onSuccess?: () => void;
};

export const MaritalStatusRelativesFormConfig = (props: PropsT) => {
  const { relative, onSuccess } = props;
  const { userId, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchUserRelativesData } = useConnectionDataCxt();
  const formMode = !relative ? "Create" : "Edit";
  const t = useTranslations("UserProfile.nestedTabs.maritalStatusRelatives");
  const [maritalStatusOptions, setMaritalStatusOptions] = useState<Array<{
    id: string;
    name: string;
    type: string;
  }>>([]);

  const getMaritalStatusType = (id: string): string | undefined => {
    // First try to find in loaded options
    const foundType = maritalStatusOptions.find((item) => item.id === id)?.type;
    if (foundType) return foundType;

    // Fallback to relative's marital_status if in edit mode
    if (relative?.marital_status?.id === id) {
      return relative.marital_status.type;
    }

    return undefined;
  };

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
              transformResponse: (data: unknown) => {
                const items = data as Array<{
                  id: string;
                  name: string;
                  type: string;
                }>;
                setMaritalStatusOptions(items);
                return items.map((item) => ({
                  value: item.id,
                  label: item.name,
                  type: item.type,
                }));
              },
            },
            placeholder: t("maritalStatus"),
          },
          {
            name: "name",
            label: t("name"),
            type: "text",
            placeholder: t("name"),
            condition: (values) => {
              const maritalStatusId = values.marital_status_id as string;
              const type = getMaritalStatusType(maritalStatusId);
              return type !== "not-married";
            },
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
            condition: (values) => {
              const maritalStatusId = values.marital_status_id as string;
              const type = getMaritalStatusType(maritalStatusId);
              return type !== "not-married";
            },
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
            condition: (values) => {
              const maritalStatusId = values.marital_status_id as string;
              const type = getMaritalStatusType(maritalStatusId);
              return type !== "not-married";
            },
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
      marital_status_id: relative?.marital_status?.id,
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
        user_id: userId,
      };

      return await defaultSubmitHandler(
        body,
        maritalStatusRelativesFormConfig,
        {
          url: url,
          method: method,
        },
      );
    },
  };
  return maritalStatusRelativesFormConfig;
};
