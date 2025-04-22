import { CompanyAddress } from "@/modules/company-profile/types/company";
import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";
import { CircleCheckIcon, MapPin } from "lucide-react";
import React from "react";

const NationalAddressDataPreview = ({
  companyAddress,
}: {
  companyAddress: CompanyAddress;
}) => {
  const previewData = [
    {
      valid: true,
      label: "الدولة",
      value: companyAddress.country_name ?? "",
      needRequest: true,
    },
    {
      valid: true,
      label: "المنطقة",
      value: companyAddress.state_name ?? "",
    },
    {
      valid: true,
      label: "المدينة",
      value: companyAddress.city_name ?? "",
    },
    {
      valid: true,
      label: "الحي",
      value: companyAddress.neighborhood_name ?? "",
    },

    {
      valid: true,
      label: "رقم المبنى",
      value: companyAddress.building_number ?? "",
    },
    {
      valid: true,
      label: "الرقم الاضافي",
      value: companyAddress.additional_phone ?? "",
    },

    {
      valid: true,
      label: "الرمز البريدي",
      value: companyAddress.postal_code ?? "",
    },
    {
      valid: true,
      label: "الشارع",
      value: companyAddress.street_name ?? "",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
      {previewData.map((preview) => (
        <div key={preview.label}>
          <PreviewTextField {...preview} />
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
