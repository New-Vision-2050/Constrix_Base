import PickupMap from "@/components/shared/pickup-map";
import { CompanyAddress } from "@/modules/company-profile/types/company";
import FieldPreview from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";
import { CircleCheckIcon, MapPin } from "lucide-react";
import React from "react";

const NationalAddressDataPreview = ({
  companyAddress,
}: {
  companyAddress: CompanyAddress;
}) => {
  const previewData = [
    {
      valid: Boolean(companyAddress.country_name),
      label: "الدولة",
      value: companyAddress.country_name ?? "",
      needRequest: true,
    },
    {
      valid: Boolean(companyAddress.state_name),
      label: "المنطقة",
      value: companyAddress.state_name ?? "",
    },
    {
      valid: Boolean(companyAddress.city_name),
      label: "المدينة",
      value: companyAddress.city_name ?? "",
    },
    {
      valid: Boolean(companyAddress.neighborhood_name),
      label: "الحي",
      value: companyAddress.neighborhood_name ?? "",
    },

    {
      valid: Boolean(companyAddress.building_number),
      label: "رقم المبنى",
      value: companyAddress.building_number ?? "",
    },
    {
      valid: Boolean(companyAddress.additional_phone),
      label: "الرقم الاضافي",
      value: companyAddress.additional_phone ?? "",
    },

    {
      valid: Boolean(companyAddress.postal_code),
      label: "الرمز البريدي",
      value: companyAddress.postal_code ?? "",
    },
    {
      valid: Boolean(companyAddress.street_name),
      label: "الشارع",
      value: companyAddress.street_name ?? "",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
      <div className={"relative col-span-2 h-16"}>
        <PickupMap
          lat={companyAddress.country_lat}
          long={companyAddress.country_long}
          viewOnly={true}
          containerClassName="grow mb-2 rounded-none border-2 h-11"
        />{" "}
        <CircleCheckIcon color="green" className="absolute top-2.5 end-3" />
      </div>
      {previewData.map((preview) => (
        <div key={preview.label}>
          <FieldPreview {...preview} />
        </div>
      ))}
    </div>
  );
};

export default NationalAddressDataPreview;
