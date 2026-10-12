"use client";

import { useQueryClient } from "@tanstack/react-query";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";
import { contractBalanceQueryKey } from "../hooks/useContractBalance";

type AssignmentFormOptions = {
  formId: string;
  fieldName: string;
  label: string;
  placeholder: string;
  isMulti: boolean;
  systemsUrl: string;
  submitUrl: string;
  initialValue: string | string[];
  summaryScope: string;
  summaryUrl: string;
  buildBody: (value: unknown, userId: string) => Record<string, unknown>;
  userId: string;
};

export function useAssignmentFormConfig(
  options: AssignmentFormOptions,
): FormConfig {
  const t = useTranslations("UserProfile.tabs.contractTabs.contractSettings");
  const queryClient = useQueryClient();
  const {
    formId,
    fieldName,
    label,
    placeholder,
    isMulti,
    systemsUrl,
    submitUrl,
    initialValue,
    summaryScope,
    summaryUrl,
    buildBody,
    userId,
  } = options;

  const formConfig: FormConfig = {
    formId,
    apiUrl: submitUrl || undefined,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        columns: 1,
        fields: [
          {
            name: fieldName,
            label,
            type: "select",
            isMulti,
            placeholder,
            required: true,
            ...(systemsUrl
              ? {
                  dynamicOptions: {
                    url: systemsUrl,
                    valueField: "id",
                    labelField: "name",
                    searchParam: "name",
                    paginationEnabled: true,
                    pageParam: "page",
                    limitParam: "per_page",
                    itemsPerPage: 10,
                    totalCountHeader: "X-Total-Count",
                  },
                }
              : { options: [] }),
            validation: [
              {
                type: "required",
                message: placeholder,
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      [fieldName]: initialValue,
    },
    submitButtonText: t("save"),
    showReset: false,
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      if (!summaryUrl) return;
      void queryClient.invalidateQueries({
        queryKey: contractBalanceQueryKey(summaryScope, summaryUrl),
      });
    },
    onSubmit: async (formData) => {
      if (!submitUrl) {
        return { success: false, message: t("apiPending") };
      }

      return defaultSubmitHandler(
        buildBody(formData[fieldName], userId),
        formConfig,
      );
    },
  };

  return formConfig;
}
