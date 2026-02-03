"use client";
import { CalendarDays, MapPin, AlertCircle } from "lucide-react";
import CompanyLogo from "./company-logo";
import { useQuery } from "@tanstack/react-query";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { Branch, CompanyData } from "@/modules/company-profile/types/company";
import { apiClient } from "@/config/axios-config";
import { Skeleton } from "@/components/ui/skeleton";
import { getCookie } from "cookies-next/client";
import { useParams } from "@i18n/navigation";
import {useTranslations} from "next-intl";
export const useCurrentCompany = () => {
  const { company_id }: { company_id: string } = useParams();
  return useQuery({
    queryKey: ["main-company-data", undefined, company_id],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyData>>(
        "/companies/current-auth-company",
        {
          params: {
            ...(company_id && { company_id }),
          },
        }
      );
      return response.data;
    },
  });
};

const CompanyHeader = () => {
  const { data, isPending, isSuccess } = useCurrentCompany();
  const t = useTranslations("UserProfile.header.address");
  const createdAt = data?.payload?.created_at;
  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB")
    : "";

  return (
    <div className="bg-sidebar rounded-lg w-full flex items-center justify-between p-4">
      <CompanyLogo logo={data?.payload?.logo || ""} isPending={isPending} />

      <div className="flex flex-col  w-full pr-6">
        {isPending && <Skeleton className="h-6 w-[150px] mb-4" />}
        {isSuccess && (
          <h2 className="text-2xl font-bold mb-4">{data?.payload?.name}</h2>
        )}
        {isPending && <Skeleton className="h-6 w-[250px]" />}
        {isSuccess && (
          <div className="flex items-start gap-8 text-sm">
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-foreground/70" />

              <Branches />
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-foreground/70" />
              <div className="leading-tight">
                <div className="text-xs">{t("joinDate")}</div>
                <div className="font-bold text-base">{joinDate}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Branches = () => {
  const { company_id }: { company_id: string } = useParams();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["company-branches", company_id],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<Branch[]>>(
        "/companies/company-profile/company-branches",
        {
          params: {
            ...(company_id && { company_id }),
          },
        }
      );

      return response.data;
    },
  });

  return (
    <>
      {isPending && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-[150px]" />
        </div>
      )}

      {isSuccess && (
        <div className="flex flex-col  gap-2">
          {data?.payload?.map((branch) => (
            <div key={branch.id} className="flex  gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span>{branch.name}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CompanyHeader;
