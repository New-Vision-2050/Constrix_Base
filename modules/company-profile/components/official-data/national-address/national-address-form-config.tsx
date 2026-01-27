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
  const t = useTranslations("companyProfile");

  const NationalAddressFormConfig: FormConfig = {
    formId,
    title:t("header.Label.NationalAddress"),
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
            label: t("header.placeholder.PickupMap"),
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
            label: t("header.Label.Country"),
            type: "text",
            placeholder: t("header.placeholder.Country"),
            disabled: true,
          },
          {
            type: "select",
            name: "state_id",
            label: t("header.Label.State"),
            placeholder: t("header.placeholder.State"),
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
                message: t("header.placeholder.State"),
              },
            ],
          },
          {
            type: "select",
            name: "city_id",
            label: t("header.Label.City"),
            placeholder: t("header.placeholder.City"),
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
                message: t("header.placeholder.City"),
              },
            ],
          },
          {
            name: "neighborhood_name",
            label: t("header.Label.Neighborhood"),
            type: "text",
            placeholder: t("header.placeholder.Neighborhood") ,
            validation: [
              {
                type: "required",
                message: t("header.placeholder.Neighborhood"),
              },
            ],
          },
          {
            name: "building_number",
            label: t("header.Label.BuildingNumber"),
            type: "text",
            placeholder: t("header.placeholder.BuildingNumber"),
            validation: [
              {
                type: "required",
                message: t("header.placeholder.BuildingNumber"),
              },
            ],
          },
          {
            name: "additional_phone",
            label: t("header.Label.AdditionalPhone"),
            type: "phone",
            placeholder: t("header.placeholder.AdditionalPhone"),
            validation: [
              {
                type: "phone",
                message: t("header.placeholder.AdditionalPhoneInvalid"),
              },
              {
                type: "required",
                message: t("header.placeholder.AdditionalPhoneRequired"),
              },
            ],
          },
          {
            name: "postal_code",
            label: t("header.Label.PostalCode"),
            type: "text",
            placeholder: t("header.placeholder.PostalCode"),
            validation: [
              {
                type: "required",
                message: t("header.placeholder.PostalCodeRequired"),
              },
            ],
          },
          {
            name: "street_name",
            label: t("header.Label.Street"),
            type: "text",
            placeholder: t("header.placeholder.Street"),
            validation: [
              {
                type: "required",
                message: t("header.placeholder.StreetRequired")   ,
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
    resetButtonText: "Clear Form",
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
