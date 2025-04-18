import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/PreviewTextField";
import { CircleCheckIcon, MapPin } from "lucide-react";
import React from "react";

const NationalAddressDataPreview = () => {
  const previewData = [
    {
      valid: true,
      label: "الدولة",
      value: "المملكة العربية السعودية",
      needRequest: true,
    },
    {
      valid: true,
      label: "المنطقة",
      value: "الشمالية",
    },
    {
      valid: true,
      label: "المدينة",
      value: "الرياض",
    },
    {
      valid: true,
      label: "الحي",
      value: "c",
    },

    {
      valid: true,
      label: "رقم المبنى",
      value: "256",
    },
    {
      valid: true,
      label: "الرقم الاضافي",
      value: "+966548552355",
    },

    {
      valid: true,
      label: "الرمز البريدي",
      value: "052",
    },
    {
      valid: true,
      label: "الشارع",
      value: "شارع الصفا - مبنى 257",
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
          <button className="underline">اظهار الموقع من الخريطة</button>
        </div>
        <CircleCheckIcon color="green" />
      </div>
    </div>
  );
};

export default NationalAddressDataPreview;
