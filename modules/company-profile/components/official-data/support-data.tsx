import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import React from "react";
import { GeneralManager } from "../../types/company";

const SupportData = ({
  generalManager,
}: {
  generalManager: GeneralManager;
}) => {
  const data = [
    {
      name: generalManager.name,
      phone: generalManager.phone,
      email: generalManager.email,
      nationality: generalManager.nationality,
    },
  ];

  return (
    <FormFieldSet title="بيانات الدعم">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-500 px-4 py-2 text-center font-normal">
              الاسم
            </th>
            <th className="border-b border-gray-500 px-4 py-2 text-center font-normal">
              الهاتف
            </th>
            <th className="border-b border-gray-500 px-4 py-2 text-center font-normal">
              البريد الإلكتروني
            </th>
            <th className="border-b border-gray-500 px-4 py-2 text-center font-normal">
              الجنسية
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
