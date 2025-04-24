"use client";
import { CalendarDays, MapPin, AlertCircle } from "lucide-react";
import CompanyLogo from "./company-logo";
import { useQuery } from "@tanstack/react-query";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { CompanyData } from "@/modules/company-profile/types/company";
import { apiClient } from "@/config/axios-config";
import { Skeleton } from "@/components/ui/skeleton";
import { getCookie } from "cookies-next/client";

const CompanyHeader = () => {
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["main-company-data", undefined],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyData>>(
        "/companies/current-auth-company"
      );
      return response.data;
    },
  });

  const companyData = JSON.parse(getCookie("company-data") ?? "");

  console.log({ companyData });

  const logo = companyData?.logo || data?.payload?.logo || "";
  const companyName = companyData?.name || data?.payload?.name || "";
  const createdAt = data?.payload?.created_at;
  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB")
    : "";

  console.log({ logo });
  return (
    <div className="bg-sidebar rounded-lg w-full flex items-center justify-between p-4">
      <CompanyLogo logo={logo} />

      <div className="flex flex-col text-right w-full pr-6">
        <h2 className="text-2xl font-bold mb-4">{companyName}</h2>
        {isPending && <Skeleton className="h-6 w-[250px]" />}
        {isSuccess && (
          <div className="flex gap-8 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-foreground/70" />
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span>الفروع</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-foreground/70" />
              <div className="leading-tight">
                <div className="text-xs">تاريخ الانضمام</div>
                <div className="font-bold text-base">{joinDate}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyHeader;
