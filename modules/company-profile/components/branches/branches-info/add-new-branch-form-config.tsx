import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Branch } from "@/modules/company-profile/types/company";
import PickupMap from "../../../../../components/shared/pickup-map";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "@i18n/navigation";
import { useTranslations } from "next-intl";

export const addNewBranchFormConfig = (branches: Branch[]) => {
  const { company_id }: { company_id: string | undefined } = useParams();
  const t = useTranslations("companyProfile.branches.form");
  const tLocation = useTranslations("location");

  const mainBranch = branches.find((branch) => !Boolean(branch.parent_id));

  const queryClient = useQueryClient();
  const formId = `add-new-branch-form-${company_id}`;
  const addNewBranchFormConfig: FormConfig = {
    formId,
    apiUrl: `${baseURL}/management_hierarchies/create-branch`,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["company-branches", company_id],
      });
    },
    title: t("addNewTitle"),
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
              />
            ),
          },
          // {
          //   label: "",
          //   name: "",
          //   type: "text",
          //     render: () => (
          //         <p className="text-xs text-red-500">
          //             - يجب اختيار خطوط الطول و دوائر العرض من الخريطة
          //         </p>
          //     ),
          // },
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
            // validation: [
            //   {
            //     type: "required",
            //     message: "ادخل دائرة العرض",
            //   },
            // ],
          },
          {
            name: "longitude",
            label: "longitude",
            placeholder: "longitude",
            type: "hiddenObject",
            // validation: [
            //   {
            //     type: "required",
            //     message: "ادخل خط الطول",
            //   },
            // ],
          },
        ],
      },
    ],
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    initialValues: {
      parent_id: mainBranch?.id ?? "",
      parent_name: mainBranch?.name ?? "",
    },
    onSubmit: async (formData) => {
      console.log("formData", formData);
      return await defaultSubmitHandler(formData, addNewBranchFormConfig, {
        url: `${baseURL}/management_hierarchies/create-branch`,
        config: {
          params: {
            ...(company_id && { company_id }),
          },
        },
      });
    },
  };
  return addNewBranchFormConfig;
};
