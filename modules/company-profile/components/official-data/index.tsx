"use client";

import SupportData from "./support-data";
import OfficialDataSection from "./official-data-section";
import LegalDataSection from "./legal-data-section";
import NationalAddress from "./national-address";
import OfficialDocsSection from "./official-docs-section";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { CompanyData } from "../../types/company";

const OfficialData = ({ id }: { id?: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["main-company-data", id],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyData>>(
        "/companies/current-auth-company"
      );
      return response.data;
    },
  });
  const payload = data?.payload ?? {};
  const {
    branch,
    name,
    name_en,
    company_type,
    country_name,
    country_id,
    company_field,
    company_field_id,
    phone,
    email,
    company_type_id,
    company_legal_data,
    general_manager,
    company_address,
    company_official_documents,
  } = payload as CompanyData;

  console.log({ payload, company_legal_data });

  return (
    <div className="bg-sidebar p-5 rounded-md space-y-5">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <OfficialDataSection
            officialData={{
              branch,
              name,
              name_en,
              company_type,
              country_name,
              country_id,
              company_field,
              company_field_id,
              phone,
              email,
              company_type_id,
            }}
          />

          <LegalDataSection companyLegalData={company_legal_data} />

          <SupportData generalManager={general_manager} />

          <NationalAddress companyAddress={company_address} />

          <OfficialDocsSection
            companyOfficialDocuments={company_official_documents}
          />
        </>
      )}
    </div>
  );
};

export default OfficialData;
