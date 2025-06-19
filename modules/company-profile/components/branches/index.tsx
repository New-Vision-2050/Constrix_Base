"use client";
import {  MapPin, CircleCheck } from "lucide-react";
import { useLocale } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BranchesInfo from "./branches-info";
import OfficialData from "../official-data";
import { useQuery } from "@tanstack/react-query";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { CompanyData } from "../../types/company";
import { apiClient } from "@/config/axios-config";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBranchStore } from "@/store/branch-select-store";

const Branches = () => {
  const { company_id } = useParams();
  const branchId = useBranchStore((state) => state.branchId);
  const setBranchId = useBranchStore((state) => state.setBranchId);
  
  const locale = useLocale();
  // Initialize activeTab from localStorage if available
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (branchId) {
      try {
        return branchId || "general";
      } catch {
        return "general";
      }
    }
    return "general";
  });

  useEffect(() => {
    if (branchId) {
      setActiveTab(branchId);
    }
  }, [branchId]);

  const { data: cachedData } = useQuery({
    queryKey: ["main-company-data", undefined, company_id,branchId],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyData>>(
        "/companies/current-auth-company",
        {
          params: {
            ...(company_id && { company_id }),
            ...(activeTab !== "general" && { branch_id: branchId }),
          },
        }
      );

      return response.data;
    },
  });

  const branches = cachedData?.payload?.branches ?? [];

  const tabs = () => {
    const dynamicBranchTabs =
      branches.length > 0
        ? branches.map((branch) => ({
            label: branch.name,
            value: branch.id,
            component: <OfficialData id={branch.id} />,
          }))
        : [];
    return [
      {
        label: "معلومات الفروع",
        value: "general",
        component: <BranchesInfo branches={branches} />,
      },
      ...dynamicBranchTabs,
    ];
  };

  const handleTabChange = (branchId: string) => {
    console.log(branchId + " tab changed");
    setActiveTab(branchId);
    const selectedBranch = branches.find((branch) => branch.id === branchId);
    if (selectedBranch) {
      setBranchId(selectedBranch.id);
    } else {
      setBranchId(null);
    }
  };

  return (
    <div>
      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full flex flex-col md:flex-row"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <TabsList
          className="flex flex-col bg-sidebar p-2 w-36 h-full gap-4 rounded-lg justify-start"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          {tabs().map((tab) => (
            <TabsTrigger
              key={tab.value}
              className="flex items-start justify-between w-full px-2 py-4 rounded-md data-[state=active]:bg-sidebar gap-2 whitespace-normal"
              value={tab.value}
              title={tab.label}
            >
              <div className="flex text-sm items-start text-start gap-2 grow">
                <MapPin size={18} className="shrink-0" />
                <p className="w-[60px] truncate whitespace-normal">
                  {tab.label}
                </p>
              </div>
              <CircleCheck
                size={18}
                className="text-green-500 shrink-0 me-auto"
              />
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1">
          {tabs().map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="h-full pr-6"
            >
              {tab.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default Branches;
