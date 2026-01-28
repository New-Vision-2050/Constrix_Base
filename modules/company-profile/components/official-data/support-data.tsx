"use client";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import React from "react";
import { GeneralManager } from "../../types/company";
import { useTranslations } from "next-intl";


const SupportData = ({
  generalManager,
}: {
  generalManager: GeneralManager;
}) => {
  const t = useTranslations("companyProfile");
  const data = [
    {
      name: generalManager?.name,
      phone: generalManager?.phone,
      email: generalManager?.email,
      nationality: generalManager?.nationality,
    },
  ];

  return (
    <FormFieldSet title={t("header.Label.SupportData")}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-500 px-4 py-2 text-center font-normal">
              {t("header.Label.Name")}
            </th>
            <th className="border-b border-gray-500 px-4 py-2 text-center font-normal">
              {t("header.Label.Phone")}
            </th>
            <th className="border-b border-gray-500 px-4 py-2 text-center font-normal">
              {t("header.Label.Email")}
            </th>
            <th className="border-b border-gray-500 px-4 py-2 text-center font-normal">
              {t("header.Label.Nationality")}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border-b border-gray-500 px-4 py-2 text-center">
                {item.name}
              </td>
              <td
                dir="ltr"
                className="border-b border-gray-500 px-4 py-2 text-center"
              >
                {item.phone}
              </td>
              <td className="border-b border-gray-500 px-4 py-2 text-center">
                {item.email}
              </td>
              <td className="border-b border-gray-500 px-4 py-2 text-center">
                {item.nationality}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </FormFieldSet>
  );
};

export default SupportData;
