import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { CompanyAddress } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";
import PickupMap from "../../../../../components/shared/pickup-map";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "@i18n/navigation";
import { useTranslations } from "next-intl";
export const NationalAddressFormConfig = (
  companyAddress?: CompanyAddress,
  id?: string,
  company_id?: string
) => {
  const formId = `NationalAddressFormConfig-${id}-${company_id}`;
  const queryClient = useQueryClient();
  const t = useTranslations("UserProfile.header.nationalAddress");
  const NationalAddressFormConfig: FormConfig = {
    formId,
    title: t("addNewBranchForm")  ,
    apiUrl: `${baseURL}/write-the-url`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        columns: 2,
        fields: [
          {
            label: t("map"),
            name: "map",
            type: "text",
            render: () => (
              <PickupMap
                formId={formId}
                lat={companyAddress?.country_lat}
                long={companyAddress?.country_long}
                containerClassName="col-span-2"
                branchId={id}
                companyId={company_id}
                keysToUpdate={[
                  "city_id",
                  "state_id",
                  "postal_code",
                  "street_name",
                  "neighborhood_name",
                  "latitude",
                  "longitude",
                ]}
              />
            ),
          },
          {
            name: "latitude",
            label: "latitude",
            placeholder: "latitude",
            type: "hiddenObject",
          },
          {
            name: "longitude",
            label: "longitude",
            placeholder: "longitude",
            type: "hiddenObject",
          },
          {
            name: "country_name",
            label: t("country"),
            type: "text",
            placeholder: t("country"),
            disabled: true,
          },
          {
            type: "select",
            name: "state_id",
            label: t("state"),
            placeholder: t("state"),
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
                message: "ادخل المنطقة",
              },
            ],
          },
          {
            type: "select",
            name: "city_id",
            label: "المدينة",
            placeholder: "المدينة",
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
            validation: [
              {
                type: "required",
                message: "ادخل المدينة",
              },
            ],
          },
          {
            name: "neighborhood_name",
            label: t("neighborhood"),
            type: "text",
            placeholder: t("neighborhood"),
            validation: [
              {
                type: "required",
                message: t("neighborhoodRequired"),
              },
            ],
          },
          {
            name: "building_number",
            label: t("buildingNumber"),
            type: "text",
            placeholder: t("buildingNumber"),
            validation: [
              {
                type: "required",
                message: t("buildingNumberRequired"),
              },
            ],
          },
          {
            name: "additional_phone",
            label: t("additionalPhone"),
            type: "phone",
            placeholder: t("additionalPhone"),
            validation: [
              {
                type: "phone",
                message: t("additionalPhoneInvalid"),
              },
              {
                type: "required",
                message: t("additionalPhoneRequired"),
              },
            ],
          },
          {
            name: "postal_code",
            label: t("postalCode"),
            type: "text",
            placeholder: t("postalCode"),
            validation: [
              {
                type: "required",
                message: t("postalCodeRequired"),
              },
            ],
          },
          {
            name: "street_name",
            label: t("street"),
            type: "text",
            placeholder: t("street"),
            validation: [
              {
                type: "required",
                message: t("streetRequired"),
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      country_id: companyAddress?.country_id ?? "",
      country_name: companyAddress?.country_name ?? "",
      neighborhood_name: companyAddress?.neighborhood_name ?? "",
      city_id: companyAddress?.city_id ?? "",
      state_id: companyAddress?.state_id ?? "",
      building_number: companyAddress?.building_number ?? "",
      additional_phone: companyAddress?.additional_phone ?? "",
      postal_code: companyAddress?.postal_code ?? "",
      street_name: companyAddress?.street_name ?? "",
      longitude: companyAddress?.country_long ?? "",
      latitude: companyAddress?.country_lat ?? "",
    },
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: t("clearForm") ,
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      const obj = {
        country_id: formData.country_id,
        state_id: formData.state_id,
        city_id: formData.city_id,
        neighborhood_name: formData.neighborhood_name,
        street_name: formData.street_name,
        building_number: formData.building_number,
        additional_phone: formData.additional_phone,
        postal_code: formData.postal_code,
        longitude: formData.longitude,
        latitude: formData.latitude,
      };

      return await defaultSubmitHandler(obj, NationalAddressFormConfig, {
        config: {
          params: {
            ...(id && { branch_id: id }),
            ...(company_id && { company_id }),
          },
        },
        url: `${baseURL}/companies/company-profile/national-address/${companyAddress?.id}`,
        method: "PUT",
      });
    },

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["company-address", id, company_id],
      });
    },
  };
  return NationalAddressFormConfig;
};
