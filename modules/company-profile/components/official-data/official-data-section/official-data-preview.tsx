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
      label: "اسم الشركة",
      value: name ?? "",
      valid: Boolean(name),
      needRequest: true,
    },
    {
      valid: Boolean(branch),
      label: "اسم الفرع",
      value: branch ?? "",
    },
    {
      valid: Boolean(name_en),
      label: "اسم الشركة بالانجليزي",
      value: name_en ?? "",
      containerClassName: "col-span-2",
    },
    {
      valid: Boolean(company_type),
      label: "كيان الشركة",
      value: company_type ?? "",
    },
    {
      valid: Boolean(country_name),
      label: "دولة المركز الرئيسي",
      value: country_name ?? "",
      needRequest: true,
    },
    {
      valid: Boolean(company_field) && company_field.length > 0,
      label: "مجال الشركة",
      value: Boolean(company_field)
        ? company_field.map((field) => field.name).join(" , ")
        : "",
      needRequest: true,
    },
    {
      valid: Boolean(phone),
      label: "رقم الجوال",
      value: phone ?? "",
    },
    {
      valid: Boolean(email),
      label: "البريد الالكتروني",
      value: email ?? "",
    },
    {
      valid: Boolean("متميز"),
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
