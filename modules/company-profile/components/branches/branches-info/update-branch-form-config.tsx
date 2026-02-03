import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Branch } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "@i18n/navigation";
import PickupMap from "@/components/shared/pickup-map";
import { useTranslations } from "next-intl";
export const updateBranchFormConfig = (
  branches: Branch[],
  branch: Branch,
  isMainBranch?: boolean
) => {
  const mainBranch = branches.find((branch) => !Boolean(branch.parent_id));
  const t = useTranslations("UserProfile.header.branches");
  const { company_id }: { company_id: string | undefined } = useParams();

  const queryClient = useQueryClient();
  const formId = `update-branch-form-${company_id}-${branch.id}`;

  const updateBranchFormConfig: FormConfig = {
    formId,
    apiUrl: `${baseURL}/management_hierarchies/create-branch`,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["company-branches", company_id],
      });
    },
    title: t("updateBranchFormTitle"),
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "name",
            label: t("addNewBranchFormFieldsNameLabel"),
            placeholder: t("addNewBranchFormFieldsNamePlaceholder"),
            type: "text",
            validation: [
              {
                type: "required",
                message: t("addNewBranchFormValidationRequired"),
              },
            ],
          },
          {
            label: t("addNewBranchFormFieldsMapLabel"),
            name: "map",
            type: "text",
            render: () => (
              <PickupMap
                formId={formId}
                keysToUpdate={[
                  "country_id",
                  "state_id",
                  "city_id",
                  "latitude",
                  "longitude",
                ]}
                inGeneral={true}
                lat={branch.latitude ?? ""}
                long={branch.longitude ?? ""}
              />
            ),
          },
          {
            label: "",
            name: "",
            type: "text",
            render: () => (
              <p className="text-xs">
                - {t("addNewBranchFormFieldsMapRule")}
              </p>
            ),
          },
          {
            type: "select",
            name: "country_id",
            label: t("addNewBranchFormFieldsCountryIdLabel"),
            placeholder: t("addNewBranchFormFieldsCountryId"),
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
                message: t("addNewBranchFormFieldsCountryIdValidationRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "state_id",
            label: t("addNewBranchFormFieldsStateIdLabel"),
            placeholder: t("addNewBranchFormFieldsStateId")   ,
            required: true,
            dynamicOptions: {
              url: `${baseURL}/countries/get-country-states-cities`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
              dependsOn: "country_id",
              filterParam: "country_id",
            },
            validation: [
              {
                type: "required",
                message: t("addNewBranchFormFieldsStateIdValidationRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "city_id",
            label: t("MainBranch"),
            placeholder: t("MainBranch"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/countries/get-country-states-cities`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
              dependsOn: "state_id",
              filterParam: "state_id",
            },
          },
          {
            name: "parent_name",
            label: t("addNewBranchFormFieldsParentNameLabel"),
            type: "text",
            disabled: true,
          },
          {
            type: "select",
            name: "manager_id",
            label: t("addNewBranchFormFieldsManagerIdLabel"),
            placeholder: t("addNewBranchFormFieldsManagerIdPlaceholder")  ,
            required: true,
            dynamicOptions: {
              url: `${baseURL}/users`,
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
                message: t("addNewBranchFormFieldsManagerIdValidationRequired"),
              },
            ],
          },
          {
            name: "phone",
            label: t("addNewBranchFormFieldsPhoneLabel"),
            type: "phone",
            required: true,
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },
          {
            name: "email",
            label: t("addNewBranchFormFieldsEmailLabel"),
            type: "email",
            placeholder: t("addNewBranchFormFieldsEmail"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("addNewBranchFormFieldsEmailValidationRequired"),
              },
              {
                type: "email",
                message: t("addNewBranchFormFieldsEmailValidationEmail"),
              },
            ],
          },
          {
            name: "latitude",
            label: t("addNewBranchFormFieldsLatitudeLabel"),
            placeholder: "latitude",
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: t("addNewBranchFormFieldsLatitudeValidationRequired"),
              },
            ],
          },
          {
            name: "longitude",
            label: t("addNewBranchFormFieldsLongitudeLabel"),
            placeholder: t("addNewBranchFormFieldsLongitudePlaceholder"),
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: t("addNewBranchFormFieldsLongitudeValidationRequired") ,
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      ...branch,
      parent_id: mainBranch?.id ?? "",
      parent_name: mainBranch?.name ?? "",
    },
    submitButtonText: t("updateBranchFormSubmitButtonText"),
    cancelButtonText: t("updateBranchFormCancelButtonText"),
    showReset: false,
    resetButtonText: t("updateBranchFormResetButtonText"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData) => {
      return await defaultSubmitHandler(formData, updateBranchFormConfig, {
        url: `${baseURL}/management_hierarchies/update-branch/${branch.id}`,
        config: {
          params: {
            ...(company_id && { company_id }),
          },
        },
      });
    },
  };
  return updateBranchFormConfig;
};
