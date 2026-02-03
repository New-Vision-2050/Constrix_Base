import React from "react";
import { officialData } from "@/modules/company-profile/types/company";
import PreviewField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";
import { useTranslations } from "next-intl";
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
    packages,
    company_access_programs,
  } = officialData || {};

  const t = useTranslations("UserProfile.header.officialData");
  const previewData = [
    {
      label: t("name"),
      value: name ?? "",
      valid: Boolean(name),
      needRequest: true,
    },
    {
      valid: Boolean(branch),
      label: t("branch"),
      value: branch ?? "",
    },
    {
      valid: Boolean(name_en),
      label: t("nameEn"),
      value: name_en ?? "",
      containerClassName: "col-span-2",
    },
    {
      valid: Boolean(company_type),
      label: t("companyType"),
      value: company_type ?? "",
    },
    {
      valid: Boolean(country_name),
      label: t("countryName"),
      value: country_name ?? "",
      needRequest: true,
    },
    {
      valid: Boolean(company_field) && company_field?.length > 0,
      label: t("companyField"),
      value: Boolean(company_field)
        ? company_field?.map((field) => field?.name).join(" , ")
        : "",
      needRequest: true,
    },
    {
      valid: Boolean(phone),
      label: t("phone"),
      value: phone ?? "",
    },
    {
      valid: Boolean(email),
      label: t("email"),
      value: email ?? "",
    },
    {
      valid: Boolean(company_access_programs),
      label: t("companyAccessPrograms"),
      value: company_access_programs?.[0]?.name ?? "",
      needRequest: true,
    },
    {
      valid: Boolean(packages),
      label: t("packages"),
      value: packages?.[0]?.name ?? "",
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
