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
      {previewData.map((preview) => (
        <div key={preview.label}>
          <FieldPreview {...preview} />
        </div>
      ))}
      <div
        className={
          "relative border col-span-2 h-10 rounded-md flex items-center justify-between px-3"
        }
      >
        <div className="flex w-full items-center gap-2">
          <MapPin className="text-primary w-4" />
          <p className="underline">اظهار الموقع من الخريطة</p>
        </div>
        <CircleCheckIcon color="green" />
      </div>
    </div>
  );
};

export default NationalAddressDataPreview;
