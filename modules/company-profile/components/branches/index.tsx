"use client";
import { MapPin, CircleCheck } from "lucide-react";
import { useLocale } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BranchesInfo from "./branches-info";
import OfficialData from "../official-data";
import { useQuery } from "@tanstack/react-query";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { Branch } from "../../types/company";
import { apiClient } from "@/config/axios-config";
import { useParams } from "next/navigation";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Tab } from "@/types/Tab";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

const Branches = () => {
  const { company_id } = useParams();

  const { can } = usePermissions();

  const locale = useLocale();
  const isRtl = locale === "ar";
  const {
    data,
    isPending,
    isSuccess,
    refetch: refetchBranches,
  } = useQuery({
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
  const branches = data?.payload ?? [];

  const handleBranchesRefetch = () => {
    refetchBranches();
  };

  const dynamicBranchTabs =
    branches.length > 0
      ? branches.map((branch) => ({
          label: branch.name,
          value: branch.id,
          component: <OfficialData id={branch.id} />,
          disabled: !can([PERMISSIONS.companyProfile.branch.view]),
          show: true,
        }))
      : [];

  const tabs: (Tab & { show: boolean; disabled: boolean })[] = [
    {
      label: "معلومات الفروع",
      value: "general",
      component: (
        <Can check={[PERMISSIONS.companyProfile.branch.list]}>
          <BranchesInfo branches={branches} handleBranchesRefetch={handleBranchesRefetch} />
        </Can>
      ),
      show: can([PERMISSIONS.companyProfile.branch.list]),
      disabled: false,
    },
    ...dynamicBranchTabs,
  ];

  const filteredTabs = tabs
    .filter((tab) => tab.show)
    .map(({ show, ...rest }) => rest);

  return (
    <div>
      <Tabs
        defaultValue="general"
        className="w-full flex flex-col md:flex-row"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <TabsList
          className="flex flex-col bg-sidebar p-2 w-36 h-full gap-4 rounded-lg justify-start"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {filteredTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className="flex items-start justify-between w-full px-2 py-4 rounded-md data-[state=active]:bg-sidebar gap-2 whitespace-normal"
              value={tab.value}
              title={tab.label}
              disabled={tab.disabled}
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
          {filteredTabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              dir={isRtl ? "rtl" : "ltr"}
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
