"use client";

import React from "react";
import { officialData } from "@/modules/company-profile/types/company";
import PreviewField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";
import { useTranslations } from "next-intl";
const OfficialDataPreview = ({
  officialData,
}: {
  officialData: officialData;
}) => {
  const t = useTranslations("companyProfile");
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

  const previewData = [
    {
      label: t("header.Label.CompanyName"),
      value: name ?? "",
      valid: Boolean(name),
      needRequest: true,
    },
    {
      valid: Boolean(branch),
      label: t("header.Label.Branch"),
      value: branch ?? "",
    },
    {
      valid: Boolean(name_en),
      label: t("header.Label.CompanyNameEnglish"),
      value: name_en ?? "",
      containerClassName: "col-span-2",
    },
    {
      valid: Boolean(company_type),
      label: t("header.Label.CompanyType"),
      value: company_type ?? "",
    },
    {
      valid: Boolean(country_name),
      label: t("header.Label.MainCountry"),
      value: country_name ?? "",
      needRequest: true,
    },
    {
      valid: Boolean(company_field) && company_field?.length > 0,
      label: t("header.Label.CompanyField"),
      value: Boolean(company_field)
        ? company_field?.map((field) => field?.name).join(" , ")
        : "",
      needRequest: true,
    },
    {
      valid: Boolean(phone),
      label: t("header.Label.Phone"),
      value: phone ?? "",
    },
    {
      valid: Boolean(email),
      label: t("header.Label.Email"),
      value: email ?? "",
    },
    {
      valid: Boolean(company_access_programs),
      label: t("header.Label.Program"),
      value: company_access_programs?.[0]?.name ?? "",
      needRequest: true,
    },
    {
      valid: Boolean(packages),
      label: t("header.Label.Bucket"),
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
