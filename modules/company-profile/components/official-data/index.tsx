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
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";

const OfficialData = ({ id }: { id?: string }) => {
  const { company_id } = useParams();
  
  // State to track cookie changes
  const [cookieBranchId, setCookieBranchId] = useState<string | undefined>();

  // Monitor cookie changes
  useEffect(() => {
    const checkCookieChanges = () => {
      const currentCookieValue = getCookie("current-branch-id");
      // Handle both sync and async cookie values
      const cookieValue = typeof currentCookieValue === 'string' 
        ? currentCookieValue 
        : undefined;
      
      if (cookieValue !== cookieBranchId) {
        setCookieBranchId(cookieValue);
      }
    };

    // Initial check
    checkCookieChanges();

    // Check for cookie changes every 100ms
    const interval = setInterval(checkCookieChanges, 100);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [cookieBranchId]);

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["main-company-data", id, company_id, cookieBranchId],
    queryFn: async () => {
      const _url = Boolean(cookieBranchId)
        ? "/companies/current-auth-company?branch_id=" + cookieBranchId
        : "/companies/current-auth-company";
      const response = await apiClient.get<ServerSuccessResponse<CompanyData>>(
        _url,
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
    general_manager,
    packages,
    company_access_programs,
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
          {!id ? (
            <Can check={[PERMISSIONS.companyProfile.officialData.view]}>
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
                  packages,
                  company_access_programs,
                }}
                id={id}
                currentCompanyId={currentCompanyId}
              />
            </Can>
          ) : (
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
                packages,
                company_access_programs,
              }}
              id={id}
              currentCompanyId={currentCompanyId}
            />
          )}

          {!id ? (
            <Can check={[PERMISSIONS.companyProfile.legalData.view]}>
              <LegalDataSection id={id} currentCompanyId={currentCompanyId} />
            </Can>
          ) : (
            <LegalDataSection id={id} currentCompanyId={currentCompanyId} />
          )}

          <Can check={[PERMISSIONS.companyProfile.supportData.view]}>
            <SupportData generalManager={general_manager} />
          </Can>

          {!id ? (
            <Can check={[PERMISSIONS.companyProfile.address.view]}>
              <NationalAddress id={id} currentCompanyId={currentCompanyId} />
            </Can>
          ) : (
            <NationalAddress id={id} currentCompanyId={currentCompanyId} />
          )}

          {!id ? (
            <Can check={[PERMISSIONS.companyProfile.officialDocument.view]}>
              <OfficialDocsSection
                id={id}
                currentCompanyId={currentCompanyId}
              />
            </Can>
          ) : (
            <OfficialDocsSection id={id} currentCompanyId={currentCompanyId} />
          )}
        </>
      )}
    </div>
  );
};

export default OfficialData;
