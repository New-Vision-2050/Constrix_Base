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
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const OfficialData = ({ id }: { id?: string }) => {
  const { company_id } = useParams();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["main-company-data", id, company_id],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyData>>(
        "/companies/current-auth-company",
        {
          params: {
            ...(id && { branch_id: id }),
            ...(company_id && { company_id }),
          },
        }
      );

      return response.data;
    },
  });

  const currentCompanyId = data?.payload?.id ?? "";

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

  return (
    <div className="bg-sidebar p-5 rounded-md space-y-5">
      {isPending && (
        <div className="border border-gray-500 rounded-2xl p-6 shadow-sm grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      )}

      {isSuccess && (
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
            id={id}
            currentCompanyId={currentCompanyId}
          />

          <LegalDataSection companyLegalData={company_legal_data} id={id} currentCompanyId={currentCompanyId} />

          <SupportData generalManager={general_manager} />

          <NationalAddress companyAddress={company_address} id={id} />

          <OfficialDocsSection
            companyOfficialDocuments={company_official_documents}
            id={id}
          />
        </>
      )}
    </div>
  );
};

export default OfficialData;
