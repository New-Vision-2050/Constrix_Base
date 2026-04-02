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
  const { company_id }: { company_id: string | undefined } = useParams();
  const t = useTranslations("companyProfile.branches.form");
  const tLocation = useTranslations("location");

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
    title: t("editTitle"),
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "name",
            label: t("branchName"),
            placeholder: t("branchNamePlaceholder"),
            type: "text",
            validation: [
              {
                type: "required",
                message: t("branchNameRequired"),
              },
            ],
          },
          {
            label: tLocation("chooseLocationCoordinates"),
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
                {t("mapNote")}
              </p>
            ),
          },
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
                message: t("countryRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "state_id",
            label: t("governorate"),
            placeholder: t("governoratePlaceholder"),
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
                message: t("governorateRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "city_id",
            label: t("city"),
            placeholder: t("cityPlaceholder"),
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
            label: t("mainBranch"),
            type: "text",
            disabled: true,
          },
          {
            type: "select",
            name: "manager_id",
            label: t("branchManager"),
            placeholder: t("branchManagerPlaceholder"),
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
                message: t("branchManagerRequired"),
              },
            ],
          },
          {
            name: "phone",
            label: t("mobileNumber"),
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
            label: t("email"),
            type: "email",
            placeholder: t("emailPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("emailRequired"),
              },
              {
                type: "email",
                message: t("emailInvalid"),
              },
            ],
          },
          {
            name: "latitude",
            label: "latitude",
            placeholder: "latitude",
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: t("latitudeRequired"),
              },
            ],
          },
          {
            name: "longitude",
            label: "longitude",
            placeholder: "longitude",
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: t("longitudeRequired"),
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
    submitButtonText: t("edit"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
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
