import React from "react";
import useCompanyStore from "../../../store/useCompanyOfficialData";
import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/PreviewTextField";

const OfficialDataPreview = () => {
  const { company } = useCompanyStore();

  const previewData = [
    {
      valid: true,
      label: "اسم الشركة",
      value: company?.name ?? "",
      needRequest: true,
    },
    {
      valid: false,
      label: "اسم الفرع",
      value: company?.main_branch?.name ?? "",
    },
    {
      valid: true,
      label: "اسم الشركة بالانجليزي",
      value: company?.name_en ?? "يجب كتابة الاسم باللغة الانجليزية",
      containerClassName: "col-span-2",
    },
    {
      valid: true,
      label: "كيان الشركة",
      value: company?.company_type ?? "",
      needRequest: true,
    },
    {
      valid: true,
      label: "دولة المركز الرئيسي",
      value: "المملكة العربية السعودية", 
      needRequest: true,
    },
    {
      valid: true,
      label: "مجال الشركة",
      value: company?.company_field ?? "",
      needRequest: true,
    },
    {
      valid: true,
      label: "رقم الجوال",
      value: company?.phone ?? "",
    },
    {
      valid: true,
      label: "البريد الالكتروني",
      value: company?.email ?? "",
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
          <PreviewTextField {...preview} />
        </div>
      ))}
    </div>
  );
};

export default OfficialDataPreview;
