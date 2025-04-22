import React from "react";
import { officialData } from "@/modules/company-profile/types/company";
import PreviewField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";

const OfficialDataPreview = ({
  officialData,
}: {
  officialData: officialData;
}) => {
  const {
    branch,
    name,
    name_en,
    company_type,
    country_name,
    company_field,
    phone,
    email,
  } = officialData;

  const previewData = [
    {
      valid: true,
      label: "اسم الشركة",
      value: name ?? "",
      needRequest: true,
    },
    {
      valid: false,
      label: "اسم الفرع",
      value: branch ?? "",
    },
    {
      valid: true,
      label: "اسم الشركة بالانجليزي",
      value: name_en ?? "",
      containerClassName: "col-span-2",
    },
    {
      valid: true,
      label: "كيان الشركة",
      value: company_type ?? "",
      needRequest: true,
    },
    {
      valid: true,
      label: "دولة المركز الرئيسي",
      value: country_name ?? "",
      needRequest: true,
    },
    {
      valid: true,
      label: "مجال الشركة",
      value: company_field ?? "",
      needRequest: true,
    },
    {
      valid: true,
      label: "رقم الجوال",
      value: phone ?? "",
    },
    {
      valid: true,
      label: "البريد الالكتروني",
      value: email ?? "",
    },
    {
      valid: true,
      label: "الباقة",
      value: "متميز",
      needRequest: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
      {previewData.map((preview) => (
        <div
          key={preview.label}
          className={preview?.containerClassName && preview?.containerClassName}
        >
          <PreviewField {...preview} />
        </div>
      ))}
    </div>
  );
};

export default OfficialDataPreview;
