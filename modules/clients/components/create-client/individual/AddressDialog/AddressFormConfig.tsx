// Define the form configuration
import React from "react";
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import ChooseMapLocationDialog from "./map/ChooseMapLocationDialog";

export function getAddreessFormConfig(
  formId: string,
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void
): FormConfig {
  return {
    formId: "address-individual-client-form",
    apiUrl: `${baseURL}/company-users/clients/address`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        fields: [
          // longitude
          {
            name: "longitude",
            label: t("longitude"),
            type: "number",
            placeholder: t("longitudePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("longitudeRequired"),
              },
            ],
          },
          // latitude
          {
            name: "latitude",
            label: t("latitude"),
            type: "number",
            placeholder: t("latitudePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("latitudeRequired"),
              },
            ],
          },
          // country
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
            onChange: (newVal, values) => {
              useFormStore.getState().setValue(formId, "local-time", {
                "country-id": newVal,
              });
            },
            validation: [
              {
                type: "required",
                message: t("countryRequired"),
              },
            ],
          },
          // city
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
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "country_id",
            },
            onChange: (newVal, values) => {
              useFormStore.getState().setValue(formId, "local-time", {
                "city-id": newVal,
              });
            },
            validation: [
              {
                type: "required",
                message: t("cityRequired"),
              },
            ],
          },
          // region
          {
            type: "text",
            name: "area",
            label: t("region"),
            placeholder: t("regionPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("regionRequired"),
              },
            ],
          },
          // neighborhood
          {
            type: "text",
            name: "neighborhood_name",
            label: t("neighborhood"),
            placeholder: t("neighborhoodPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("neighborhoodRequired"),
              },
            ],
          },
          // building number
          {
            name: "building_number",
            label: t("buildingNumber"),
            type: "number",
            placeholder: t("buildingNumberPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("buildingNumberRequired"),
              },
            ],
          },
          // phone number
          {
            name: "additional_phone",
            label: t("phoneNumber"),
            type: "phone",
            placeholder: t("phoneNumberPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("phoneNumberRequired"),
              },
            ],
          },
          //   postal code
          {
            name: "postal_code",
            label: t("postalCode"),
            type: "number",
            placeholder: t("postalCodePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("postalCodeRequired"),
              },
            ],
          },
          //   street
          {
            name: "street_name",
            label: t("street"),
            type: "text",
            placeholder: t("streetPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("streetRequired"),
              },
            ],
          },
          // map
          {
            name: "map",
            label: "",
            type: "text",
            render: () => {
              return <ChooseMapLocationDialog />;
            },
            containerClassName: "col-span-2",
          },
        ],
        columns: 2,
      },
    ],
    // editDataTransformer: (data) => {},
    onSuccess: onSuccessFn,
    onSubmit: async (values) => {
      useFormStore.getState().setValues(formId, values);

      return {
        success: true,
        message: "Address added successfully",
      };
    },
    submitButtonText: t("submitButtonText"),
    cancelButtonText: t("cancelButtonText"),
    showReset: false,
    resetButtonText: t("resetButtonText"),
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
